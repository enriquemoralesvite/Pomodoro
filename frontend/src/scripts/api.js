const API_URL = "http://localhost:3000/api"; // Asegúrate que esta sea la URL de tu backend

/**
 * Realiza una petición a la API.
 * Añade el token de autorización si existe en localStorage.
 * No redirige si no hay token, permitiendo peticiones anónimas.
 * @param {string} endpoint - El endpoint de la API al que llamar.
 * @param {RequestInit} options - Opciones para la petición fetch.
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function fetchApi(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // Si la respuesta no es JSON, response.json() fallará y se irá al catch.
    // Esto es común en errores 500 que devuelven HTML o texto plano.
    const data = await response.json();

    if (!response.ok) {
      console.error(`Error de API en ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        errorBody: data
      });
      return { success: false, error: data.error || response.statusText };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Error de red o de parseo en la petición a ${endpoint}:`, error);
    return { success: false, error: "Error de red o de conexión con la API." };
  }
}