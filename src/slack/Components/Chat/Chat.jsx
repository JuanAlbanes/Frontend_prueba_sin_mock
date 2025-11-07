import { useContext, useEffect } from "react"
import { MessagesContext } from "../../Context/MessagesContext"
import { UserContext } from "../../Context/UserContext"
import Message from "../Message/Message"
import "./Chat.css"

export default function Chat() {
    const { messages, isMessagesLoading, currentChannelId, workspaceId, loadMessages } = useContext(MessagesContext)
    const { currentUser } = useContext(UserContext)

    // ✅ ACTUALIZADO: Cargar mensajes cuando cambie el canal o workspace
    useEffect(() => {
        if (workspaceId && currentChannelId) {
            loadMessages(workspaceId, currentChannelId)
        }
    }, [workspaceId, currentChannelId, loadMessages])

    // Función para determinar si el mensaje es del usuario actual
    const isMyMessage = (message) => {
        if (!currentUser) return false
        
        // Diferentes formas en que el backend puede identificar el usuario
        return  currentUser._id === message.user_id || 
                currentUser._id === message.user?._id ||
                currentUser._id === message.emisor_id ||
                currentUser.email === message.user?.email
    }

    if (isMessagesLoading) {
        return (
            <div className="container-no-messages">
                <span>Cargando mensajes...</span>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="container-no-messages">
                <span>No hay mensajes aún. ¡Envía el primero!</span>
            </div>
        )
    }

    return (
        <div className="container-messages">
            {messages.map((message) => (
                <Message
                    key={message.id || message._id}
                    id={message.id || message._id}
                    emisor={message.emisor || message.user?.name || "Usuario"}
                    hora={message.hora || new Date(message.created_at).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    texto={message.texto || message.content}
                    status={message.status}
                    isMyMessage={isMyMessage(message)} 
                />
            ))}
        </div>
    )
}