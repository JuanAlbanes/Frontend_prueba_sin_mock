import { createContext, useState, useRef } from "react"
import {
    getMessagesByWorkspaceId,
    addMessageToWorkspace,
    deleteMessage,
} from "../services/messagesService-slack.js"

export const MessagesContext = createContext({
    messages: [],
    isMessagesLoading: true,
    loadMessages: (workspace_id) => {},
    handleAddMessage: (workspace_id, text) => {},
    handleDeleteMessage: (workspace_id, message_id) => {},
})

const MessagesContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(true)
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null)

    const lastMessageRef = useRef(null)

    const loadMessages = (workspace_id) => {
        setIsMessagesLoading(true)
        setCurrentWorkspaceId(workspace_id)
        setTimeout(() => {
            const workspace_messages = getMessagesByWorkspaceId(workspace_id)
            setMessages(workspace_messages)
            setIsMessagesLoading(false)
        }, 900)
    }

    const handleAddMessage = (workspace_id, text) => {
        const last = lastMessageRef.current
        if (last && last.workspace_id === workspace_id && last.text === text) return

        const newMessage = addMessageToWorkspace(workspace_id, text)
        if (newMessage) {
            setMessages((prev) => [...prev, newMessage])
            lastMessageRef.current = { workspace_id, text }
        }
    }

    const handleDeleteMessage = (workspace_id, message_id) => {
        const success = deleteMessage(workspace_id, message_id)
        if (success) {
            setMessages((prev) => prev.filter((m) => m.id !== Number(message_id)))
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
                currentWorkspaceId,
            }}
        >
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesContextProvider
