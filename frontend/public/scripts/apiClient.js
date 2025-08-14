const API_URL = "https://pomodoro-backend-clan.onrender.com";

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        window.location.href = "/login";
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al refrescar token: ${response.status} - ${errorText}`);
        }

        const { accessToken } = await response.json();
        localStorage.setItem("accessToken", accessToken);
        console.log("✅ Token de acceso refrescado exitosamente.");
        return accessToken;

    } catch (error) {
        console.error("Error al refrescar el token:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
    }
}

export async function fetchWithAuth(url, options = {}) {
    // Determinar si la URL es absoluta o relativa
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
    
    // Configurar headers iniciales
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    
    // Agregar token de acceso si existe
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    // Primera llamada a la API
    let response = await fetch(fullUrl, {
        ...options,
        headers
    });

    // Manejar token expirado (401 Unauthorized)
    if (response.status === 401) {
        console.log("Token de acceso expirado. Intentando refrescar...");
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
            // Reintentar la petición con el nuevo token
            headers.Authorization = `Bearer ${newAccessToken}`;
            response = await fetch(fullUrl, {
                ...options,
                headers
            });
        }
    }

    return response;
}