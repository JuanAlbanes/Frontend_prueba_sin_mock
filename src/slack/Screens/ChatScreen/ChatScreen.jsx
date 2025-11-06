import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { MessagesContext } from "../../context/MessagesContext"
import { WorkspaceContext } from "../../context/WorkspaceContext"
import ChatHeader from "../../components/ChatHeader/ChatHeader"
import Chat from "../../components/Chat/Chat"
import NewMessageForm from "../../components/NewMessageForm/NewMessageForm"
import WorkspaceList from "../../components/WorkspaceList/WorkspaceList"
import ChannelList from "../../components/ChannelList/ChannelList"
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../components/Layout/SlackLayout"
import "./ChatScreen.css"

export default function ChatScreen() {
    const { workspace_id } = useParams()
    const { loadMessages, isMessagesLoading, currentChannelId } = useContext(MessagesContext)
    const { workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('workspaces')
    const [error, setError] = useState(null)
    const [workspaceName, setWorkspaceName] = useState(null)

    // Función para encontrar el nombre del workspace
    const getWorkspaceName = (workspaceId) => {
        if (!workspaceId || workspaces.length === 0) return null;
        
        // Buscar en diferentes estructuras posibles
        const foundWorkspace = workspaces.find(ws => {
            // Caso 1: workspace directo
            if (ws._id === workspaceId) return true;
            // Caso 2: nested en propiedad workspace
            if (ws.workspace && ws.workspace._id === workspaceId) return true;
            // Caso 3: propiedad workspace_id
            if (ws.workspace_id === workspaceId) return true;
            return false;
        });

        if (foundWorkspace) {
            // Extraer el nombre de diferentes estructuras posibles
            return  foundWorkspace.name || 
                    foundWorkspace.workspace?.name || 
                    foundWorkspace.workspace_name;
        }
        
        return null;
    };

    // FUNCIÓN NUEVA MEJORADA: Encontrar el workspace completo
    const getCurrentWorkspace = () => {
        if (!workspace_id || workspaces.length === 0) return null;
        
        const foundWorkspace = workspaces.find(ws => {
            // Caso 1: workspace directo
            if (ws._id === workspace_id) return true;
            // Caso 2: nested en propiedad workspace
            if (ws.workspace && ws.workspace._id === workspace_id) return true;
            // Caso 3: propiedad workspace_id
            if (ws.workspace_id === workspace_id) return true;
            return false;
        });

        if (foundWorkspace) {
            // Si el workspace está nested, devolver la propiedad workspace
            if (foundWorkspace.workspace && foundWorkspace.workspace._id === workspace_id) {
                return foundWorkspace.workspace;
            }
            // Si es directo, devolver el workspace completo
            return foundWorkspace;
        }
        
        return null;
    };

    // Cargar workspaces si no están cargados
    useEffect(() => {
        if (workspaces.length === 0 && loadWorkspaces) {
            loadWorkspaces().catch(err => {
                console.error('Error cargando workspaces:', err)
                setError('Error al cargar los workspaces')
            })
        }
    }, [workspaces.length, loadWorkspaces])

    // Actualizar el nombre del workspace cuando cambien los parámetros
    useEffect(() => {
        if (workspace_id) {
            const name = getWorkspaceName(workspace_id);
            setWorkspaceName(name);
        } else {
            setWorkspaceName(null);
        }
    }, [workspace_id, workspaces])

    // Forzar cambio a pestaña de workspaces cuando no hay workspace_id
    useEffect(() => {
        if (!workspace_id && activeTab === 'channels') {
            setActiveTab('workspaces')
        }
    }, [workspace_id, activeTab])

    const handleWorkspaceSelect = (workspace) => {
        const workspaceId = workspace._id || workspace.workspace?._id
        if (workspaceId) {
            navigate(`/workspace/${workspaceId}`)
            setActiveTab('channels')
            setError(null)
        } else {
            console.error('Workspace sin ID:', workspace)
        }
    }

    const handleChannelSelect = (channel) => {
        setActiveTab('channels')
        setError(null)
    }

    // Obtener el workspace actual usando la nueva función
    const currentWorkspace = getCurrentWorkspace();

    const sidebarContent = (
        <div className="chat-sidebar">
            <div className="sidebar-tabs">
                <button 
                    className={`tab-button ${activeTab === 'workspaces' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('workspaces')
                        setError(null)
                    }}
                >
                    Workspaces
                </button>
                <button 
                    className={`tab-button ${activeTab === 'channels' ? 'active' : ''}`}
                    onClick={() => {
                        if (workspace_id) {
                            setActiveTab('channels')
                            setError(null)
                        }
                    }}
                    disabled={!workspace_id}
                >
                    Canales
                </button>
            </div>
            
            <div className="sidebar-content">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>Cerrar</button>
                    </div>
                )}
                
                {activeTab === 'workspaces' ? (
                    <WorkspaceList 
                        currentWorkspaceId={workspace_id} 
                        onWorkspaceSelect={handleWorkspaceSelect} 
                    />
                ) : (
                    workspace_id ? (
                        <ChannelList 
                            key={workspace_id}
                            workspaceId={workspace_id}
                            workspaceName={workspaceName} 
                            onChannelSelect={handleChannelSelect}
                            onError={setError}
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

    if (isMessagesLoading && currentChannelId) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="chat-screen">
                {/* CAMBIO CLAVE AQUÍ: Pasar el workspace usando la nueva función */}
                <ChatHeader workspace={currentWorkspace} />
                
                {currentChannelId ? (
                    <>
                        <Chat />
                        <NewMessageForm />
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <div className="no-channel-content">
                            <h3>Bienvenido a {workspaceName || 'Slack'}</h3>
                            <p>Selecciona un canal para empezar a chatear</p>
                            {!workspace_id && (
                                <p>O selecciona un workspace primero</p>
                            )}
                            {error && (
                                <div className="error-banner">
                                    <p>Error: {error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SlackLayout>
    )
}