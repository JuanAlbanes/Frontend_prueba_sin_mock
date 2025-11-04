import { useContext, useState } from "react"
import { useParams } from "react-router"
import { MessagesContext } from "../../Context/MessagesContext"
import "./NewMessageForm.css"
import { IoSend } from "react-icons/io5"

export default function NewMessageForm() {
    const { workspace_id } = useParams()
    const { handleAddMessage, currentChannelId } = useContext(MessagesContext)
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        const text = message.trim()
        if (!text) return

        // Verificar que tenemos un canal seleccionado
        if (!currentChannelId) {
            alert("Por favor, selecciona un canal primero")
            return
        }

        setIsSubmitting(true)
        try {
            await handleAddMessage(workspace_id, currentChannelId, text)
            setMessage("")
        } catch (error) {
            console.error('Error sending message:', error)
            alert("Error al enviar el mensaje: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="message-form">
            <input
                type="text"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={currentChannelId ? "Escribe un mensaje..." : "Selecciona un canal para enviar mensajes"}
                className="message-input"
                autoComplete="off"
                disabled={!currentChannelId}
            />
            <button 
                type="submit" 
                className="btn-send" 
                disabled={isSubmitting || !currentChannelId || !message.trim()}
            >
                <IoSend className="send-icon" />
            </button>
        </form>
    )
}