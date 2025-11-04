import { useContext } from "react"
import { MessagesContext } from "../../Context/MessagesContext"
import Message from "../Message/Message"
import "./Chat.css"

export default function Chat() {
    const { messages, isMessagesLoading } = useContext(MessagesContext)

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
                    isMyMessage={message.isMyMessage}
                />
            ))}
        </div>
    )
}