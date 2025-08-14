import { fetchWithAuth } from "./apiClient";

function getDefaultError(error) {
  console.error("Error en la API de tareas:", error);
  return {
    success: false,
    error: error.toString(),
  };
}

export async function getTasks() {
  try {
    const response = await fetchWithAuth(
      "https://pomodoro-backend-clan.onrender.com/api/tasks"
    );
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

export async function addTask(task) {
  try {
    const response = await fetchWithAuth(
      "https://pomodoro-backend-clan.onrender.com/api/tasks",
      {
        method: "POST",
        body: JSON.stringify(task),
      }
    );
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function editTask(id, task) {
  try {
    const response = await fetchWithAuth(
      `https://pomodoro-backend-clan.onrender.com/api/tasks/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(task),
      }
    );
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function deleteTask(id) {
  try {
    const response = await fetchWithAuth(
      `https://pomodoro-backend-clan.onrender.com/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      return { success: true };
    }
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function getStatistics() {
  try {
    const response = await fetchWithAuth(
      "https://pomodoro-backend-clan.onrender.com/api/timer/statistics"
    );
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

export async function getWeeklyStatistics() {
  try {
    const response = await fetchWithAuth(
      "https://pomodoro-backend-clan.onrender.com/api/timer/statistics/weekly"
    );
    
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