// src/slack/services/memberService.js
import ENVIRONMENT from "../../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../../constants/http.js"
import { getToken } from "../../services/authService.js"

export async function inviteMemberToWorkspace(workspaceId, email) {
    const token = getToken()
    
    if (!token) {
        throw new Error('No autenticado')
    }
    
    try {
        const inviteData = {
            invited_email: email
        }

        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/workspaces/${workspaceId}/invite`,
            {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(inviteData)
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
    } catch (error) {
        console.error('Error in inviteMemberToWorkspace:', error)
        throw error
    }
}