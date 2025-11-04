import ENVIRONMENT from "../../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../../constants/http.js"
import { getToken } from "../../services/authService.js"

export async function getChannelsByWorkspace(workspace_id) {
    const token = getToken()
    
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

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function getChannelById(channel_id) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/channels/${channel_id}`,
        {
            method: HTTP_METHODS.GET,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function createChannel(name, description, workspace_id, isPrivate = false) {
    const token = getToken()
    
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

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function updateChannel(channel_id, name, description, isPrivate) {
    const token = getToken()
    
    const channelData = {
        name: name,
        description: description,
        private: isPrivate
    }

    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/channels/${channel_id}`,
        {
            method: HTTP_METHODS.PUT,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(channelData)
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function deleteChannel(channel_id) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/channels/${channel_id}`,
        {
            method: HTTP_METHODS.DELETE,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}