const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

/**
 * Lee todas las tareas del archivo JSON
 * @returns {Array} Array de tareas
 */
function readTasks() {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o hay error, retorna array vacío
        return [];
    }
}

/**
 * Escribe las tareas al archivo JSON
 * @param {Array} tasks - Array de tareas a escribir
 */
function writeTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error) {
        throw new Error(`Error al escribir el archivo: ${error.message}`);
    }
}

/**
 * Obtiene todas las tareas
 * @returns {Array} Array de todas las tareas
 */
function getAllTasks() {
    return readTasks();
}

/**
 * Crea una nueva tarea
 * @param {Object} taskData - Datos de la nueva tarea
 * @returns {Object} La tarea creada con su ID
 */
function createTask(taskData) {
    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(), // ID único basado en timestamp
        title: taskData.title,
        completed: taskData.completed || false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    return newTask;
}

/**
 * Actualiza una tarea existente
 * @param {string} id - ID de la tarea a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object|null} La tarea actualizada o null si no se encuentra
 */
function updateTask(id, updateData) {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return null;
    }

    // Actualiza solo los campos proporcionados
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
    };

    writeTasks(tasks);
    return tasks[taskIndex];
}

/**
 * Elimina una tarea
 * @param {string} id - ID de la tarea a eliminar
 * @returns {boolean} true si se eliminó, false si no se encontró
 */
function deleteTask(id) {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return false;
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    return true;
}

/**
 * Obtiene una tarea por su ID
 * @param {string} id - ID de la tarea
 * @returns {Object|null} La tarea encontrada o null
 */
function getTaskById(id) {
    const tasks = readTasks();
    return tasks.find(task => task.id === id) || null;
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
};
