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
