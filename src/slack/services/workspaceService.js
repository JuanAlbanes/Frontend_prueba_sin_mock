import ENVIRONMENT from "../../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../../constants/http.js"
import { getToken } from "../../services/authService.js"

export async function getWorkspaceList() {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces`,
        {
            method: HTTP_METHODS.GET,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}

export async function getWorkspaceById(workspace_id) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`,
        {
            method: HTTP_METHODS.GET,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}

export async function createWorkspace(name, url_image = "") {
    const token = getToken()
    
    // ✅ CORREGIDO: Usar url_image en lugar de url_img
    const workspaceData = {
        name: name,
        url_image: url_image
    }

    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(workspaceData)
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}

export async function updateWorkspace(workspace_id, name, url_image) {
    const token = getToken()
    
    const workspaceData = {
        name: name,
        url_image: url_image
    }

    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`,
        {
            method: HTTP_METHODS.PUT,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(workspaceData)
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}

export async function deleteWorkspace(workspace_id) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`,
        {
            method: HTTP_METHODS.DELETE,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}

export async function getAllWorkspaces() {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/workspaces/all`,
        {
            method: HTTP_METHODS.GET,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_http.ok) {
        throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
    }

    if (response_data.ok === false) {
        throw new Error(response_data.message || 'Error del servidor')
    }

    return response_data
}