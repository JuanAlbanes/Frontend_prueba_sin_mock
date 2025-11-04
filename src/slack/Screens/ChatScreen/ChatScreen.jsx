import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { MessagesContext } from "../../Context/MessagesContext"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import ChatHeader from "../../Components/ChatHeader/ChatHeader"
import Chat from "../../Components/Chat/Chat"
import NewMessageForm from "../../Components/NewMessageForm/NewMessageForm"
import WorkspaceList from "../../Components/WorkspaceList/WorkspaceList"
import ChannelList from "../../Components/ChannelList/ChannelList"
import LoaderSpinner from "../../Components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../Components/Layout/SlackLayout"
import "./ChatScreen.css"

export default function ChatScreen() {
    const { workspace_id } = useParams()
    const { loadMessages, isMessagesLoading, currentChannelId } = useContext(MessagesContext)
    const { workspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('workspaces') // 'workspaces' o 'channels'

    // Encontrar el workspace actual usando _id (MongoDB) o id (mock)
    const currentWorkspace = workspaces.find((w) => 
        w._id === workspace_id || w.id === Number(workspace_id)
    )

    const handleWorkspaceSelect = (workspace) => {
        const workspaceId = workspace._id || workspace.id
        navigate(`/workspace/${workspaceId}`)
        // Al cambiar de workspace, resetear la selección de canal
        setActiveTab('channels')
    }

    const handleChannelSelect = (channel) => {
        // El channel selection ya maneja la carga de mensajes automáticamente
        setActiveTab('channels')
    }

    // Cargar mensajes cuando se selecciona un workspace (sin canal específico)
    useEffect(() => {
        if (workspace_id && !currentChannelId) {
            // Solo cargar mensajes si hay un canal seleccionado
            // Por ahora, no cargamos mensajes hasta que se seleccione un canal
        }
    }, [workspace_id, currentChannelId])

    const sidebarContent = (
        <div className="chat-sidebar">
            <div className="sidebar-tabs">
                <button 
                    className={`tab-button ${activeTab === 'workspaces' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workspaces')}
                >
                    Workspaces
                </button>
                <button 
                    className={`tab-button ${activeTab === 'channels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('channels')}
                    disabled={!workspace_id}
                >
                    Canales
                </button>
            </div>
            
            <div className="sidebar-content">
                {activeTab === 'workspaces' ? (
                    <WorkspaceList 
                        currentWorkspaceId={workspace_id} 
                        onWorkspaceSelect={handleWorkspaceSelect} 
                    />
                ) : (
                    workspace_id ? (
                        <ChannelList 
                            workspaceId={workspace_id}
                            onChannelSelect={handleChannelSelect}
                        />
                    ) : (
                        <div className="no-workspace-selected">
                            <p>Selecciona un workspace primero</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )

    // Mostrar spinner solo si estamos cargando mensajes Y tenemos un canal seleccionado
    if (isMessagesLoading && currentChannelId) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="chat-screen">
                <ChatHeader workspace={currentWorkspace} />
                {currentChannelId ? (
                    <>
                        <Chat />
                        <NewMessageForm />
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <div className="no-channel-content">
                            <h3>Bienvenido a {currentWorkspace?.name || 'Slack'}</h3>
                            <p>Selecciona un canal para empezar a chatear</p>
                            {!workspace_id && (
                                <p>O selecciona un workspace primero</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SlackLayout>
    )
}