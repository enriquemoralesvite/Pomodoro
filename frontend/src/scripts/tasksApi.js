import { fetchWithAuth } from "./apiClient";

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
      throw new Error(
        `Error al obtener las tareas: ${response.status} ${response.statusText} - ${errorText}`
      );
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
    const response = await fetchWithAuth("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
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
      throw new Error(
        `Error al obtener las estadísticas: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

/**
 * Obtiene las estadísticas de las tareas compeltadas semanales.
 */
export async function getWeeklyStatistics() {
  try {
    const response = await fetchWithAuth("/timer/statistics/weekly");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al obtener las estadísticas: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}
// En tasksApi.js - Agrega este console.log para depuración
export async function getWeeklyStatistics() {
  try {
    const response = await fetchWithAuth("/timer/statistics/weekly");
    
    // Depuración crucial
    console.log("Respuesta de weekly statistics:", {
      status: response.status,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${errorText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}