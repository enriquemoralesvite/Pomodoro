const API_URL = import.meta.env.PUBLIC_API_URL;

// Se crea una función auxiliar para incluir el token de autenticación en las cabeceras.
// El backend requiere un token JWT para autorizar las peticiones a las rutas de tareas.
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function getTasks() {
  try {
    // Se añaden las cabeceras de autenticación a la petición.
    const response = await fetch(`${API_URL}/tasks`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      // Se mejora el manejo de errores para obtener más detalles en caso de fallo.
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
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders(), // Se añaden las cabeceras de autenticación.
      body: JSON.stringify(task), // El cuerpo de la petición debe ser un string JSON.
    });
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

// La firma de la función se ajusta para recibir el id y los datos por separado, lo que es más estándar.
export async function editTask(id, task) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT", // Se usa PUT, que es lo que el backend espera, en lugar de 'UPDATE'.
      headers: getAuthHeaders(), // Se añaden las cabeceras de autenticación.
      body: JSON.stringify(task), // El cuerpo de la petición debe ser un string JSON.
    });
    return await response.json();
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // Se añaden las cabeceras de autenticación.
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
