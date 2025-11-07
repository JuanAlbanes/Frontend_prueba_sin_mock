import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"
import { getToken } from "./authService.js"

export async function getMessagesByChannel(workspace_id, channelId) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages/${workspace_id}/${channelId}`,
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

export async function sendMessage(channelId, content) {
    const token = getToken()
    
    const message = {
        channel_id: channelId,
        text: content
    }

    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(message)
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function updateMessage(messageId, content) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages/${messageId}`,
        {
            method: HTTP_METHODS.PUT,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text: content })
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function deleteMessage(messageId) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages/${messageId}`,
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

export async function getMessageById(messageId) {
    const token = getToken()
    
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages/${messageId}`,
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