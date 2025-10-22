import { useContext, useState } from "react"
import { useParams } from "react-router"
import { MessagesContext } from "../../Context/MessagesContext"
import "./NewMessageForm.css"
import { IoSend } from "react-icons/io5"

export default function NewMessageForm() {
    const { workspace_id } = useParams()
    const { handleAddMessage } = useContext(MessagesContext)
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        const text = message.trim()
        if (!text) return

        setIsSubmitting(true)
        try {
            await handleAddMessage(workspace_id, text)
            setMessage("")
        } finally {
            setTimeout(() => setIsSubmitting(false), 100)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="message-form">
            <input
                type="text"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="message-input"
                autoComplete="off"
            />
            <button type="submit" className="btn-send" disabled={isSubmitting}>
                <IoSend />
            </button>
        </form>
    )
}
