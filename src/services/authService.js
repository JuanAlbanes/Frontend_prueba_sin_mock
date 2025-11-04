import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"

export async function register(name, email, password) {
    const usuario = {
        name,
        email,
        password
    }
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/auth/register`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON
            },
            body: JSON.stringify(usuario)
        }
    )
    
    const response_data = await response_http.json()
    
    if (!response_data.ok) {
        throw new Error(response_data.message)
    }
    
    return response_data
}

export async function login(email, password) {
    const response = await fetch(
        `${ENVIRONMENT.URL_API}/api/auth/login`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
            },
            body: JSON.stringify({ email, password })
        }
    )
    
    const response_data = await response.json()
    
    if (!response_data.ok) {
        throw new Error(response_data.message)
    }
    
    // ✅ CORREGIDO: Guardar el token con el nombre correcto
    if (response_data.data && response_data.data.authorization_token) {
        localStorage.setItem('token', response_data.data.authorization_token)
    }
    
    return response_data
}

export async function resetPassword(email, newPassword) {
    const response = await fetch(
        `${ENVIRONMENT.URL_API}/api/auth/reset-password`,
        {
            method: HTTP_METHODS.PUT,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
            },
            body: JSON.stringify({ email, newPassword })
        }
    )
    
    const response_data = await response.json()
    
    if (!response_data.ok) {
        throw new Error(response_data.message)
    }
    
    return response_data
}

// Función para obtener el token del localStorage
export function getToken() {
    return localStorage.getItem('token')
}

// Función para hacer logout
export function logout() {
    localStorage.removeItem('token')
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
    return !!localStorage.getItem('token')
}