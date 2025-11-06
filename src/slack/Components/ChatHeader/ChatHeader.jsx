import { Link, useParams } from "react-router"
import "./ChatHeader.css"
import { FaArrowLeft } from "react-icons/fa6"
import { IoChatbubbleEllipses } from "react-icons/io5"
import { useContext, useState, useEffect } from "react"
import { MessagesContext } from "../../context/MessagesContext"
import { getChannelById } from "../../services/channelService"

export default function ChatHeader({ workspace }) {
    const { workspace_id } = useParams()
    const { currentChannelId } = useContext(MessagesContext)
    const [currentChannel, setCurrentChannel] = useState(null)
    const [loadingChannel, setLoadingChannel] = useState(false)

    // Cargar información del canal cuando cambie currentChannelId
    useEffect(() => {
        if (currentChannelId) {
            loadChannelInfo(currentChannelId)
        } else {
            setCurrentChannel(null)
        }
    }, [currentChannelId])

    const loadChannelInfo = async (channelId) => {
        setLoadingChannel(true)
        try {
            const response = await getChannelById(channelId)
            if (response.data && response.data.channel) {
                setCurrentChannel(response.data.channel)
            }
        } catch (error) {
            console.error('Error loading channel info:', error)
            setCurrentChannel(null)
        } finally {
            setLoadingChannel(false)
        }
    }

    if (!workspace) {
        return (
            <div className="chat-header">
                <Link to="/home" className="btn-back">
                    <FaArrowLeft />
                </Link>
                <div className="workspace-header-info">
                    <h2 className="workspace-header-name">Selecciona un workspace</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="chat-header">
            <Link to="/home" className="btn-back">
                <FaArrowLeft />
            </Link>
            <div className="workspace-header-icon">
                <IoChatbubbleEllipses />
            </div>
            <div className="workspace-header-info">
                <h2 className="workspace-header-name">
                    {currentChannel && `  #${currentChannel.name}`}
                </h2>
                <p className="workspace-header-description">
                    {currentChannel 
                        ? (currentChannel.description || `Canal ${currentChannel.name}`)
                        : (workspace.description || `Workspace ${workspace.name}` ) 
                    } 
                    {loadingChannel && " (cargando...)"}
                </p>
            </div>
        </div>
    )
}