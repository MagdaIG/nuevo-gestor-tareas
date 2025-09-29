# nuevo-gestor-tareas

# Gestor de Tareas - Node.js

Una aplicación simple de gestión de tareas desarrollada con Node.js y Express, que utiliza archivos JSON para la persistencia de datos.

## Características

- Crear nuevas tareas
- Obtener todas las tareas
- Obtener una tarea específica por ID
- Modificar tareas existentes
- Eliminar tareas
- Persistencia en archivo JSON (sin base de datos)
- Interfaz web moderna y responsiva
- Filtros para tareas (todas, pendientes, completadas)
- Estadísticas en tiempo real
- Notificaciones toast
- Diseño responsive para móviles

## Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
```bash
npm install
```

## Uso

### Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3001`

### Interfaz Web

Una vez iniciado el servidor, puedes acceder a la interfaz web en:
- **Interfaz principal**: `http://localhost:3001/`
- **Información de la API**: `http://localhost:3001/api`

### Endpoints de la API

#### 1. Obtener información de la API
```
GET /
```

#### 2. Obtener todas las tareas
```
GET /tasks
```

#### 3. Obtener una tarea específica
```
GET /tasks/:id
```

#### 4. Crear una nueva tarea
```
POST /tasks
Content-Type: application/json

{
  "title": "Mi nueva tarea",
  "completed": false
}
```

#### 5. Actualizar una tarea
```
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "completed": true
}
```

#### 6. Eliminar una tarea
```
DELETE /tasks/:id
```

## Estructura del Proyecto

```
nuevo-gestor-tareas/
├── server.js          # Servidor Express principal
├── fileUtils.js       # Funciones para manejo de archivos JSON
├── tasks.json         # Archivo de persistencia de tareas
├── package.json       # Configuración del proyecto
├── README.md          # Este archivo
└── public/            # Archivos estáticos de la interfaz web
    ├── index.html     # Página principal
    ├── css/
    │   └── style.css  # Estilos de la interfaz
    └── js/
        └── app.js     # Lógica JavaScript del frontend
```

## Estructura de una Tarea

```json
{
  "id": "1703123456789",
  "title": "Título de la tarea",
  "completed": false,
  "createdAt": "2023-12-21T10:30:00.000Z",
  "updatedAt": "2023-12-21T11:00:00.000Z"
}
```

## Ejemplos de Uso

### Crear una tarea
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Completar proyecto", "completed": false}'
```

### Obtener todas las tareas
```bash
curl http://localhost:3000/tasks
```

### Actualizar una tarea
```bash
curl -X PUT http://localhost:3000/tasks/1703123456789 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Eliminar una tarea
```bash
curl -X DELETE http://localhost:3000/tasks/1703123456789
```

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **fs** - Módulo nativo de Node.js para manejo de archivos
- **JSON** - Formato de persistencia de datos

### Frontend
- **HTML5** - Estructura de la interfaz
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (ES6+)** - Lógica del frontend
- **Font Awesome** - Iconos
- **Fetch API** - Comunicación con el backend

## Características de la Interfaz Web

- **Diseño Moderno**: Interfaz elegante con gradientes y sombras
- **Paleta de Colores**: Tonos crema, naranja suave, rosa y morado
- **Responsive**: Se adapta a dispositivos móviles y tablets
- **Filtros Inteligentes**: Ver todas las tareas, solo pendientes o completadas
- **Estadísticas**: Contador en tiempo real de tareas totales, pendientes y completadas
- **Notificaciones**: Mensajes toast para confirmar acciones
- **Modal de Edición**: Interfaz intuitiva para modificar tareas
- **Modal de Confirmación**: Reemplaza las alertas del navegador
- **Animaciones**: Transiciones suaves y efectos hover
- **Footer Profesional**: Enlaces a GitHub, LinkedIn y portfolio

## Notas

- Las tareas se almacenan en el archivo `tasks.json`
- Los IDs se generan automáticamente usando timestamps
- La aplicación incluye validación de datos y manejo de errores
- Todas las respuestas siguen un formato JSON consistente
- La interfaz web se actualiza automáticamente al realizar cambios
