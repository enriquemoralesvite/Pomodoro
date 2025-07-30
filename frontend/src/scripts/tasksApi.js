// FIX: Se establece la URL del backend directamente.
// La variable de entorno import.meta.env.PUBLIC_API_URL no estaba definida y causaba que la URL fuera 'undefined'.
const API_URL = 'http://localhost:3001/api';

// FIX: Se crea una función auxiliar para incluir el token de autenticación en las cabeceras.
// El backend requiere un token JWT para autorizar las peticiones a las rutas de tareas.
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

export async function getTasks() {
    try {
        // FIX: Se añaden las cabeceras de autenticación a la petición.
        const response = await fetch(`${API_URL}/tasks`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            // FIX: Se mejora el manejo de errores para obtener más detalles en caso de fallo.
            const errorText = await response.text();
            throw new Error(`Error al obtener las tareas: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        return getDefaultError(error);
    }
}

export async function addTask(task) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(), // FIX: Se añaden las cabeceras de autenticación.
            body: JSON.stringify(task) // FIX: El cuerpo de la petición debe ser un string JSON.
        });
        return await response.json();
    } catch (error) {
        return getDefaultError(error);
    }
}

// FIX: La firma de la función se ajusta para recibir el id y los datos por separado, lo que es más estándar.
export async function editTask(id, task) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT', // FIX: Se usa PUT, que es lo que el backend espera, en lugar de 'UPDATE'.
            headers: getAuthHeaders(), // FIX: Se añaden las cabeceras de autenticación.
            body: JSON.stringify(task) // FIX: El cuerpo de la petición debe ser un string JSON.
        });
        return await response.json();
    } catch (error) {
        return getDefaultError(error);
    }
}

export async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders() // FIX: Se añaden las cabeceras de autenticación.
        });
        if (response.ok) {
            return { success: true };
        }
        return await response.json();
    } catch (error) {
        return getDefaultError(error);
    }
}

function getDefaultError(error) {
    console.error("Error en la API:", error);
    return {
        success: false,
        error: error.toString(),
    };
}