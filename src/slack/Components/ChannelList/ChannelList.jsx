import { useState, useEffect, useContext } from "react"
import { MessagesContext } from "../../Context/MessagesContext.jsx"
import { getChannelsByWorkspace, createChannel } from "../../services/channelService"
import useFetch from "../../../hooks/useFetch"
import "./ChannelList.css"
import { IoAdd, IoSearchSharp, IoLockClosed } from "react-icons/io5"
import Swal from "sweetalert2"

export default function ChannelList({ workspaceId, onChannelSelect }) {
    const { currentChannelId, loadMessages } = useContext(MessagesContext)
    const [channels, setChannels] = useState([])
    const [searchChannel, setSearchChannel] = useState("")
    const { loading, error, sendRequest } = useFetch()

    // Cargar canales cuando cambie el workspaceId
    useEffect(() => {
        if (workspaceId) {
            loadChannels(workspaceId)
        } else {
            setChannels([])
        }
    }, [workspaceId])

    const loadChannels = async (workspaceId) => {
        await sendRequest(async () => {
            const response = await getChannelsByWorkspace(workspaceId)
            if (response.data && response.data.channels) {
                setChannels(response.data.channels)
            }
        })
    }

    const handleCreateChannel = () => {
        Swal.fire({
            title: "Crear nuevo canal",
            html: `
                <input id="channel-name" class="swal2-input" placeholder="Nombre del canal">
                <input id="channel-description" class="swal2-input" placeholder="Descripción (opcional)">
                <div style="text-align: left; margin: 10px 0;">
                    <label>
                        <input type="checkbox" id="channel-private" style="margin-right: 8px;">
                        Canal privado
                    </label>
                </div>
            `,
            confirmButtonText: "Crear",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            preConfirm: () => {
                const name = document.getElementById("channel-name").value
                const description = document.getElementById("channel-description").value
                const isPrivate = document.getElementById("channel-private").checked
                
                if (!name) {
                    Swal.showValidationMessage("El nombre del canal es requerido")
                }
                return { name, description, isPrivate }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await createChannel(
                            result.value.name, 
                            result.value.description, 
                            workspaceId, 
                            result.value.isPrivate
                        )
                        if (response.ok) {
                            // Recargar la lista de canales
                            await loadChannels(workspaceId)
                            Swal.fire({
                                title: "Canal creado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        }
                    })
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#611f69",
                    })
                }
            }
        })
    }

    const handleChannelClick = (channel) => {
        if (onChannelSelect) {
            onChannelSelect(channel)
        }
        // Cargar mensajes del canal seleccionado
        if (workspaceId) {
            loadMessages(workspaceId, channel._id)
        }
    }

    const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchChannel.toLowerCase())
    )

    if (loading) {
        return (
            <div className="channel-list-container">
                <div className="loading-channels">Cargando canales...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="channel-list-container">
                <div className="error-channels">Error: {error.message}</div>
            </div>
        )
    }

    return (
        <div className="channel-list-container">
            <div className="channel-list-header">
                <h3>Canales</h3>
                <button onClick={handleCreateChannel} className="create-channel-btn">
                    <IoAdd className="btn-icon" />
                </button>
            </div>

            <div className="search-bar">
                <IoSearchSharp className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar canales"
                    value={searchChannel}
                    onChange={(e) => setSearchChannel(e.target.value)}
                    className="input"
                />
            </div>

            <div className="channels-container">
                {filteredChannels.length === 0 ? (
                    <div className="no-channels">
                        <span>No hay canales en este workspace</span>
                    </div>
                ) : (
                    filteredChannels.map((channel) => (
                        <div
                            key={channel._id}
                            className={`channel-item ${currentChannelId === channel._id ? 'active' : ''}`}
                            onClick={() => handleChannelClick(channel)}
                        >
                            <span className="channel-name">
                                {channel.private && <IoLockClosed className="lock-icon" />}
                                #{channel.name}
                            </span>
                            {channel.description && (
                                <span className="channel-description">{channel.description}</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}