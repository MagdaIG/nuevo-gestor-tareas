const express = require('express');
const path = require('path');
const { getAllTasks, createTask, updateTask, deleteTask, getTaskById } = require('./fileUtils');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta raíz - redirigir a la interfaz web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para información de la API
app.get('/api', (req, res) => {
    res.json({
        message: 'API de Gestión de Tareas',
        version: '1.0.0',
        endpoints: {
            'GET /tasks': 'Obtener todas las tareas',
            'POST /tasks': 'Crear una nueva tarea',
            'PUT /tasks/:id': 'Actualizar una tarea',
            'DELETE /tasks/:id': 'Eliminar una tarea',
            'GET /tasks/:id': 'Obtener una tarea específica'
        }
    });
});

// A. Obtener todas las tareas
app.get('/tasks', (req, res) => {
    try {
        const tasks = getAllTasks();
        res.json({
            success: true,
            data: tasks,
            count: tasks.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas',
            error: error.message
        });
    }
});

// Obtener una tarea específica por ID
app.get('/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const task = getTaskById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la tarea',
            error: error.message
        });
    }
});

// B. Crear una nueva tarea
app.post('/tasks', (req, res) => {
    try {
        const { title, completed } = req.body;

        // Validación básica
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El título de la tarea es requerido y debe ser una cadena no vacía'
            });
        }

        const newTask = createTask({
            title: title.trim(),
            completed: completed || false
        });

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la tarea',
            error: error.message
        });
    }
});

// C. Modificar una tarea existente
app.put('/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        // Verificar que la tarea existe
        const existingTask = getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        // Validar datos de actualización
        const updateData = {};

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El título debe ser una cadena no vacía'
                });
            }
            updateData.title = title.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'El campo completed debe ser un valor booleano'
                });
            }
            updateData.completed = completed;
        }

        // Si no hay datos para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionaron datos para actualizar'
            });
        }

        const updatedTask = updateTask(id, updateData);

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la tarea',
            error: error.message
        });
    }
});

// D. Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la tarea existe
        const existingTask = getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        const deleted = deleteTask(id);

        if (deleted) {
            res.json({
                success: true,
                message: 'Tarea eliminada exitosamente',
                data: existingTask
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la tarea'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la tarea',
            error: error.message
        });
    }
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`API de Gestión de Tareas disponible`);
    console.log(`Archivo de tareas: tasks.json`);
});

module.exports = app;
