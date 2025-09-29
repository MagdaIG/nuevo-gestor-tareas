// API Base URL
const API_BASE = '';

// Estado de la aplicación
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let confirmCallback = null;

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const tasksList = document.getElementById('tasksList');
const loadingMessage = document.getElementById('loadingMessage');
const emptyMessage = document.getElementById('emptyMessage');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editTitleInput = document.getElementById('editTitle');
const editCompletedInput = document.getElementById('editCompleted');
const closeModalBtn = document.getElementById('closeModal');
const cancelEditBtn = document.getElementById('cancelEdit');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const closeConfirmModalBtn = document.getElementById('closeConfirmModal');
const cancelConfirmBtn = document.getElementById('cancelConfirm');
const confirmActionBtn = document.getElementById('confirmAction');
const toast = document.getElementById('toast');

// Elementos de estadísticas
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Filtros
const filterButtons = document.querySelectorAll('.filter-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulario de nueva tarea
    taskForm.addEventListener('submit', handleCreateTask);

    // Modal de edición
    editForm.addEventListener('submit', handleEditTask);
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);

    // Modal de confirmación
    closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    confirmActionBtn.addEventListener('click', handleConfirmAction);

    // Cerrar modales al hacer clic fuera
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });

    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            setFilter(filter);
        });
    });
}

// Cargar tareas desde la API
async function loadTasks() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/tasks`);
        const data = await response.json();

        if (data.success) {
            tasks = data.data;
            renderTasks();
            updateStats();
        } else {
            showToast('Error al cargar las tareas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

// Crear nueva tarea
async function handleCreateTask(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                completed: false
            })
        });

        const data = await response.json();

        if (data.success) {
            tasks.push(data.data);
            renderTasks();
            updateStats();
            taskTitleInput.value = '';
            showToast('Tarea creada exitosamente', 'success');
        } else {
            showToast(data.message || 'Error al crear la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

// Actualizar tarea
async function updateTask(taskId, updateData) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (data.success) {
            const index = tasks.findIndex(task => task.id === taskId);
            if (index !== -1) {
                tasks[index] = data.data;
                renderTasks();
                updateStats();
            }
            return true;
        } else {
            showToast(data.message || 'Error al actualizar la tarea', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
        return false;
    }
}

// Eliminar tarea
async function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const taskTitle = task ? task.title : 'esta tarea';

    showConfirmModal(
        `¿Estás seguro de que quieres eliminar "${taskTitle}"?`,
        async () => {
            try {
                const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    tasks = tasks.filter(task => task.id !== taskId);
                    renderTasks();
                    updateStats();
                    showToast('Tarea eliminada exitosamente', 'success');
                } else {
                    showToast(data.message || 'Error al eliminar la tarea', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error de conexión', 'error');
            }
        }
    );
}

// Manejar edición de tarea
async function handleEditTask(e) {
    e.preventDefault();

    const title = editTitleInput.value.trim();
    const completed = editCompletedInput.checked;

    if (!title) return;

    const success = await updateTask(editingTaskId, {
        title: title,
        completed: completed
    });

    if (success) {
        closeModal();
        showToast('Tarea actualizada exitosamente', 'success');
    }
}

// Abrir modal de edición
function openEditModal(task) {
    editingTaskId = task.id;
    editTitleInput.value = task.title;
    editCompletedInput.checked = task.completed;
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editingTaskId = null;
    editForm.reset();
}

// Mostrar modal de confirmación
function showConfirmModal(message, callback) {
    confirmMessage.textContent = message;
    confirmCallback = callback;
    confirmModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de confirmación
function closeConfirmModal() {
    confirmModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    confirmCallback = null;
}

// Manejar confirmación
function handleConfirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}

// Alternar estado de completado
async function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const success = await updateTask(taskId, {
        completed: !task.completed
    });

    if (success) {
        const status = !task.completed ? 'completada' : 'marcada como pendiente';
        showToast(`Tarea ${status}`, 'success');
    }
}

// Establecer filtro
function setFilter(filter) {
    currentFilter = filter;

    // Actualizar botones de filtro
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderTasks();
}

// Filtrar tareas
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Renderizar tareas
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        tasksList.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }

    tasksList.style.display = 'block';
    emptyMessage.style.display = 'none';

    tasksList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                onchange="toggleTaskComplete('${task.id}')"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${formatDate(task.createdAt)}</span>
                    ${task.updatedAt ? `<span><i class="fas fa-clock"></i> ${formatDate(task.updatedAt)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-success" onclick="openEditModal(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// Actualizar estadísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pending;
    completedTasksEl.textContent = completed;
}

// Mostrar/ocultar loading
function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    if (show) {
        tasksList.style.display = 'none';
        emptyMessage.style.display = 'none';
    }
}

// Mostrar toast
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');

    toast.className = `toast ${type}`;
    toastMessage.textContent = message;

    // Iconos según el tipo
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'toast-icon fas fa-times-circle';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'Hoy';
    } else if (diffDays === 2) {
        return 'Ayer';
    } else if (diffDays <= 7) {
        return `Hace ${diffDays - 1} días`;
    } else {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Manejar errores de red
window.addEventListener('online', () => {
    showToast('Conexión restaurada', 'success');
    loadTasks();
});

window.addEventListener('offline', () => {
    showToast('Sin conexión a internet', 'error');
});
