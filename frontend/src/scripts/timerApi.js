import { fetchWithAuth } from './apiClient';

// Función auxiliar para manejar errores comunes de la API.
function getDefaultError(error) {
  console.error("Error en la API de temporizador:", error);
  return {
    success: false,
    error: error.toString(),
  };
}

/**
 * Registra una nueva sesión de Pomodoro (trabajo o descanso).
 * @param {object} sessionData - Los datos de la sesión a registrar.
 */
export async function registerSession(sessionData) {
  try {
    const response = await fetchWithAuth("/timer", {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}


//  * El siguiente script trae estadísticas de sesiones Pomodoro (work, short_break, long_break) 
//  * agrupadas por fecha. 
//  * @param {number} userId 
//  * @returns {Promise<{ success: boolean, data: Array, error: any }>}
 
export async function getTimerStats() {
  try {
    console.log("Solicitando estadísticas del temporizador...");
    const response = await fetchWithAuth(`/timer/stats`);
    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Status ${response.status} - ${msg}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener estadísticas de timer:", error);
    return { success: false, data: [], error: error.toString() };
  }
}