import ENVIRONMENT from "../../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../../constants/http.js"
import { getToken } from "../../services/authService.js"

export async function getChannelsByWorkspace(workspace_id) {
    const token = getToken()
    
    try {
        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/channels/workspace/${workspace_id}`,
            {
                method: HTTP_METHODS.GET,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // Verificar si la respuesta es JSON válido
        const contentType = response_http.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response_http.text()
            throw new Error(`La respuesta del servidor no es JSON: ${textResponse.substring(0, 100)}`)
        }

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error ${response_http.status}: ${response_http.statusText}`)
        }

        // ✅ CORREGIDO: Validar estructura de respuesta
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la respuesta del servidor')
        }

        return response_data

    } catch (error) {
        console.error('Error en getChannelsByWorkspace:', error)
        throw error
    }
}

export async function getChannelById(workspace_id, channel_id) {
    const token = getToken()
    
    try {
        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/channels/${workspace_id}/${channel_id}`,
            {
                method: HTTP_METHODS.GET,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // Verificar si la respuesta es JSON válido
        const contentType = response_http.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response_http.text()
            throw new Error(`La respuesta del servidor no es JSON: ${textResponse.substring(0, 100)}`)
        }

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error ${response_http.status}: ${response_http.statusText}`)
        }

        // ✅ CORREGIDO: Validar estructura de respuesta
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la respuesta del servidor')
        }

        return response_data

    } catch (error) {
        console.error('Error en getChannelById:', error)
        throw error
    }
}

export async function createChannel(name, description, workspace_id, isPrivate = false) {
    const token = getToken()
    
    try {
        const channelData = {
            name: name,
            description: description,
            workspace_id: workspace_id,
            private: isPrivate
        }

        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/channels`,
            {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(channelData)
            }
        )

        // Verificar si la respuesta es JSON válido
        const contentType = response_http.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response_http.text()
            throw new Error(`La respuesta del servidor no es JSON: ${textResponse.substring(0, 100)}`)
        }

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error ${response_http.status}: ${response_http.statusText}`)
        }

        // ✅ CORREGIDO: Validar estructura de respuesta
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la respuesta del servidor')
        }

        return response_data

    } catch (error) {
        console.error('Error en createChannel:', error)
        throw error
    }
}

export async function updateChannel(workspace_id, channel_id, name, description, isPrivate) {
    const token = getToken()
    
    try {
        const channelData = {
            name: name,
            description: description,
            private: isPrivate
        }

        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/channels/${workspace_id}/${channel_id}`,
            {
                method: HTTP_METHODS.PUT,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(channelData)
            }
        )

        // Verificar si la respuesta es JSON válido
        const contentType = response_http.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response_http.text()
            throw new Error(`La respuesta del servidor no es JSON: ${textResponse.substring(0, 100)}`)
        }

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error ${response_http.status}: ${response_http.statusText}`)
        }

        // ✅ CORREGIDO: Validar estructura de respuesta
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la respuesta del servidor')
        }

        return response_data

    } catch (error) {
        console.error('Error en updateChannel:', error)
        throw error
    }
}

export async function deleteChannel(workspace_id, channel_id) {
    const token = getToken()
    
    try {
        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/channels/${workspace_id}/${channel_id}`,
            {
                method: HTTP_METHODS.DELETE,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // Verificar si la respuesta es JSON válido
        const contentType = response_http.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response_http.text()
            throw new Error(`La respuesta del servidor no es JSON: ${textResponse.substring(0, 100)}`)
        }

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error ${response_http.status}: ${response_http.statusText}`)
        }

        // ✅ CORREGIDO: Validar estructura de respuesta
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la respuesta del servidor')
        }

        return response_data

    } catch (error) {
        console.error('Error en deleteChannel:', error)
        throw error
    }
}