import { getMessagesByChannel, sendMessage, updateMessage, deleteMessage } from "../../services/messageService.js"

export const getMessagesByWorkspaceId = async (workspace_id, channel_id) => {
    try {
        const response = await getMessagesByChannel(channel_id)
        return response.data.messages || []
    } catch (error) {
        console.error('Error getting messages:', error)
        return []
    }
}

export const addMessageToWorkspace = async (workspace_id, channel_id, text) => {
    try {
        const response = await sendMessage(channel_id, text)
        
        // Formatear la respuesta para que coincida con la estructura esperada
        const newMessage = {
            id: response.data.message._id,
            emisor: response.data.message.user?.name || "Usuario",
            hora: new Date(response.data.message.created_at).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            texto: response.data.message.content,
            status: "enviado",
            isMyMessage: true,
            created_at: response.data.message.created_at
        }
        
        return newMessage
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

export const deleteMessageFromWorkspace = async (workspace_id, message_id) => {
    try {
        const response = await deleteMessage(message_id)
        return true
    } catch (error) {
        console.error('Error deleting message:', error)
        return false
    }
}

export const updateMessageInWorkspace = async (workspace_id, message_id, newText) => {
    try {
        const response = await updateMessage(message_id, newText)
        
        const updatedMessage = {
            id: response.data.message._id,
            emisor: response.data.message.user?.name || "Usuario",
            hora: new Date(response.data.message.created_at).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            texto: response.data.message.content,
            status: "editado",
            isMyMessage: true,
            created_at: response.data.message.created_at
        }
        
        return updatedMessage
    } catch (error) {
        console.error('Error updating message:', error)
        throw error
    }
}