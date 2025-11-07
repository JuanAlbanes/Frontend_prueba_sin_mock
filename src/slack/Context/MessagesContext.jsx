import { createContext, useState, useRef } from "react"
import { getMessagesByChannel } from "../../services/messageService.js"

export const MessagesContext = createContext({
    messages: [],
    isMessagesLoading: true,
    currentWorkspaceId: null,
    currentChannelId: null,
    loadMessages: (workspace_id, channel_id) => {},
    handleAddMessage: (workspace_id, channel_id, text) => {},
    handleDeleteMessage: (workspace_id, message_id) => {},
    handleUpdateMessage: (workspace_id, message_id, newText) => {},
})

const MessagesContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(true)
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null)
    const [currentChannelId, setCurrentChannelId] = useState(null)

    const lastMessageRef = useRef(null)

    const loadMessages = async (workspace_id, channel_id) => {
        // ✅ CORREGIDO: Validar que ambos IDs existen antes de hacer la llamada
        if (!workspace_id || !channel_id) {
            console.warn('❌ Missing workspace_id or channel_id:', { workspace_id, channel_id })
            setMessages([])
            setIsMessagesLoading(false)
            return
        }

        setIsMessagesLoading(true)
        setCurrentWorkspaceId(workspace_id)
        setCurrentChannelId(channel_id)
        
        try {
            // ✅ CORREGIDO: Usar la función correcta con ambos parámetros
            const response = await getMessagesByChannel(workspace_id, channel_id)
            
            if (response && response.ok && response.data && Array.isArray(response.data.messages)) {
                // CORREGIDO: Normalizar los IDs para que todos los mensajes tengan tanto _id como id
                const normalizedMessages = response.data.messages.map(message => ({
                    ...message,
                    id: message.id || message._id, // Asegurar que siempre haya un campo `id`
                    _id: message._id || message.id  // Asegurar que siempre haya un campo `_id`
                }))
                
                setMessages(normalizedMessages)
            } else {
                console.warn('⚠️ Invalid response structure:', response)
                setMessages([])
            }
        } catch (error) {
            console.error('Error loading messages:', error)
            setMessages([])
        } finally {
            setIsMessagesLoading(false)
        }
    }

    const handleAddMessage = async (workspace_id, channel_id, text) => {
        const last = lastMessageRef.current
        if (last && last.workspace_id === workspace_id && last.channel_id === channel_id && last.text === text) return

        try {
            // ✅ NOTA: Esta función necesita ser actualizada en messagesService-slack.js
            // Por ahora mantenemos la llamada original
            const newMessage = await addMessageToWorkspace(workspace_id, channel_id, text)
            if (newMessage) {
                setMessages((prev) => [...prev, newMessage])
                lastMessageRef.current = { workspace_id, channel_id, text }
            }
        } catch (error) {
            console.error('Error adding message:', error)
            throw error
        }
    }

    const handleDeleteMessage = async (workspace_id, message_id) => {
        try {
            // ✅ NOTA: Esta función necesita ser actualizada en messagesService-slack.js
            const success = await deleteMessageFromWorkspace(workspace_id, message_id)
            if (success) {
                setMessages((prev) => prev.filter((m) => 
                    // CORREGIDO: Buscar por ambos campos _id e id
                    (m._id !== message_id && m.id !== message_id)
                ))
            }
        } catch (error) {
            console.error('Error deleting message:', error)
            throw error
        }
    }

    const handleUpdateMessage = async (workspace_id, message_id, newText) => {
        try {
            // ✅ NOTA: Esta función necesita ser actualizada en messagesService-slack.js
            const updatedMessage = await updateMessageInWorkspace(workspace_id, message_id, newText)
            if (updatedMessage) {
                setMessages((prev) => 
                    prev.map((m) => 
                        // CORREGIDO: Buscar por ambos campos _id e id
                        ((m._id === message_id || m.id === message_id) ? updatedMessage : m)
                    )
                )
            }
        } catch (error) {
            console.error('Error updating message:', error)
            throw error
        }
    }

    return (
        <MessagesContext.Provider
            value={{
                messages,
                isMessagesLoading,
                loadMessages,
                handleAddMessage,
                handleDeleteMessage,
                handleUpdateMessage,
                currentWorkspaceId,
                currentChannelId,
            }}
        >
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesContextProvider