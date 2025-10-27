import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"



export async function register(name,email,password) {
    const usuario = {
        email,
        username: name,
        password
    }
    /* Ordena al navegador hacer una consulta HTTP  */
    /* Nosotros queremos consumir nuestra API */
    /* fetch() recibe 2 parametros :
    1- La URL a la que vamos a consultar
    2- Un objeto de configuracion de la consulta */
    const response_http = await fetch(
    `${ENVIRONMENT.URL_API}/api/auth/register`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE] : CONTENT_TYPE_VALUES.JSON
            },
            body: JSON.stringify(usuario)
        }
    )
    const response_data = await response_http.json()
    if(!response_data.ok){
        throw new Error(response_data.message)
    }
    return response_data
}

export async function login(email,password) {
    const response = await fetch(
        `${ENVIRONMENT.URL_API}/api/auth/login`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE] : CONTENT_TYPE_VALUES.JSON,
            },
            body: JSON.stringify({ email, password })
        })
        const response_data = await response.json()
    
        if (!response.ok) {
            throw new Error(response_data.message)
        }
        return response_data
    }

export async function resetPassword(email, newPassword) {
    const response = await fetch(
        `${ENVIRONMENT.URL_API}/api/auth/reset-password`,
        {
            method: HTTP_METHODS.PUT,
            headers: {
                [HEADERS.CONTENT_TYPE] : CONTENT_TYPE_VALUES.JSON,
            },
            body: JSON.stringify({ email, newPassword })
        })
    const response_data = await response.json()
    
    if (!response.ok) {
        throw new Error(response_data.message)
    }
    return response_data
}