const API_URL = import.meta.env.PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function getDefaultError(error) {
  console.error("Error en la API:", error);
  return {
    success: false,
    error: error.toString(),
  };
}

export async function registerSession(sessionData) {
  try {
    const response = await fetch(`${API_URL}/timer`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}
