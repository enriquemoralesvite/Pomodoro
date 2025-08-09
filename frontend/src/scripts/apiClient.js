const API_URL = import.meta.env.PUBLIC_API_URL;

// Refresca el token de acceso usando el token de refresco almacenado.
// Si falla (ej. el token de refresco expiró), limpia el almacenamiento y redirige al login.
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        // Si no hay token de refresco, no hay nada que hacer. Redirigir a login.
        window.location.href = "/login";
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) {
            // Si el backend rechaza el token de refresco, es inválido o ha expirado.
            throw new Error("No se pudo refrescar el token.");
        }

        const { accessToken } = await response.json();
        localStorage.setItem("accessToken", accessToken); // Guardar el nuevo token
        console.log("✅ Token de acceso refrescado exitosamente."); // Log para confirmar el refresco
        return accessToken;

    } catch (error) {
        console.error("Error al refrescar el token:", error);
        // Limpiar tokens y redirigir al login para una nueva autenticación.
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
    }
}

// Realiza una petición a la API, manejando automáticamente la autenticación y el refresco de tokens.
export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");

    // Configurar las cabeceras de la petición inicial.
    options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    // Realizar la petición inicial.
    let response = await fetch(`${API_URL}${url}`, options);

    // Si la petición falla con un 401 (No Autorizado), el token de acceso puede haber expirado.
    if (response.status === 401) {
        console.log("Token de acceso expirado. Intentando refrescar...");
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            // Si el token se refrescó con éxito, reintentar la petición original con el nuevo token.
            options.headers.Authorization = `Bearer ${newAccessToken}`;
            response = await fetch(`${API_URL}${url}`, options);
        }
    }

    return response;
}

