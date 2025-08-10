import { fetchWithAuth } from './apiClient';

// Función auxiliar para manejar errores comunes de la API.
function getDefaultError(error) {
  console.error("Error en la API de tareas:", error);
  return {
    success: false,
    error: error.toString(),
  };
}

/**
 * Obtiene todas las tareas del usuario.
 * Utiliza fetchWithAuth para asegurar que la petición está autenticada.
 */
export async function getTasks() {
  try {
    const response = await fetchWithAuth("/tasks");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener las tareas: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

/**
 * Agrega una nueva tarea.
 * @param {object} task - El objeto de la tarea a agregar.
 */
export async function addTask(task) {
  try {
    console.log('Enviando tarea al servidor:', task);
    const accessToken = localStorage.getItem("accessToken");
    console.log('Token de autenticación:', accessToken ? accessToken.substring(0, 10) + '...' : 'no token');
    
    if (!accessToken) {
      console.error('No hay token de acceso disponible. Redirigiendo a login...');
      window.location.href = "/login";
      return { success: false, error: "No hay token de acceso" };
    }
    
    console.log('API_URL:', API_URL);
    console.log('URL completa:', `${API_URL}/tasks`);
    
    const response = await fetchWithAuth("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Texto de error:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.error('Datos de error:', errorData);
        return { success: false, error: errorData.message || 'Error desconocido' };
      } catch (e) {
        return { success: false, error: errorText || 'Error desconocido' };
      }
    }
    
    const responseData = await response.json();
    console.log('Datos de respuesta:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error completo al agregar tarea:', error);
    return getDefaultError(error);
  }
}

/**
 * Edita una tarea existente.
 * @param {number} id - El ID de la tarea a editar.
 * @param {object} task - Los datos actualizados de la tarea.
 */
export async function editTask(id, task) {
  try {
    const response = await fetchWithAuth(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

/**
 * Elimina una tarea.
 * @param {number} id - El ID de la tarea a eliminar.
 */
export async function deleteTask(id) {
  try {
    const response = await fetchWithAuth(`/tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return { success: true };
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

/**
 * Obtiene las estadísticas de las tareas.
 */
export async function getStatistics() {
  try {
    const response = await fetchWithAuth("/timer/statistics");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener las estadísticas: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}
