import { fetchWithAuth } from './apiClient.js';

function getDefaultError(error) {
  console.error("Error en la API de temporizador:", error);
  return {
    success: false,
    error: error.toString(),
  };
}

export async function registerSession(sessionData) {
  try {
    const response = await fetchWithAuth(
      "https://pomodoro-backend-clan.onrender.com/api/timer",
      {
        method: "POST",
        body: JSON.stringify(sessionData),
      }
    );
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}