import React, { useState, useEffect } from 'react'
import { getWorkspaceList, createWorkspace } from '../../services/workspaceService'
import useFetch from '../../../hooks/useFetch'
import './WorkspaceList.css'
import { IoAdd, IoBusiness } from "react-icons/io5"
import Swal from 'sweetalert2'

export default function WorkspaceList({ onWorkspaceSelect, currentWorkspaceId }) {
    const [workspaces, setWorkspaces] = useState([])
    const [searchWorkspace, setSearchWorkspace] = useState("")
    const { loading, error, sendRequest } = useFetch()

    // Cargar workspaces al montar el componente
    useEffect(() => {
        loadWorkspaces()
    }, [])

    const loadWorkspaces = async () => {
        await sendRequest(async () => {
            const response = await getWorkspaceList()
            if (response.data && response.data.workspaces) {
                setWorkspaces(response.data.workspaces)
            }
        })
    }

    const handleCreateWorkspace = () => {
        Swal.fire({
            title: "Crear nuevo workspace",
            html: `
                <input id="workspace-name" class="swal2-input" placeholder="Nombre del workspace">
                <input id="workspace-image" class="swal2-input" placeholder="URL de imagen (opcional)">
            `,
            confirmButtonText: "Crear",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            preConfirm: () => {
                const name = document.getElementById("workspace-name").value
                const url_image = document.getElementById("workspace-image").value
                
                if (!name) {
                    Swal.showValidationMessage("El nombre del workspace es requerido")
                }
                return { name, url_image }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await createWorkspace(
                            result.value.name, 
                            result.value.url_image
                        )
                        if (response.ok) {
                            // Recargar la lista de workspaces
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace creado!",
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

    const handleWorkspaceClick = (workspace) => {
        if (onWorkspaceSelect) {
            // La estructura real es workspace.workspace (por el join en el backend)
            const workspaceData = workspace.workspace || workspace
            onWorkspaceSelect(workspaceData)
        }
    }

    const filteredWorkspaces = workspaces.filter((workspace) => {
        const workspaceName = workspace.workspace ? workspace.workspace.name : workspace.name
        return workspaceName.toLowerCase().includes(searchWorkspace.toLowerCase())
    })

    if (loading) {
        return (
            <div className="workspace-list-container">
                <div className="loading-workspaces">Cargando workspaces...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="workspace-list-container">
                <div className="error-workspaces">Error: {error.message}</div>
            </div>
        )
    }

    return (
        <div className="workspace-list-container">
            <div className="workspace-list-header">
                <h3>Workspaces</h3>
                <button onClick={handleCreateWorkspace} className="create-workspace-btn">
                    <IoAdd className="btn-icon" />
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar workspaces"
                    value={searchWorkspace}
                    onChange={(e) => setSearchWorkspace(e.target.value)}
                    className="input"
                />
            </div>

            <div className="workspaces-container">
                {filteredWorkspaces.length === 0 ? (
                    <div className="no-workspaces">
                        <span>No hay workspaces</span>
                    </div>
                ) : (
                    filteredWorkspaces.map((workspaceItem) => {
                        const workspace = workspaceItem.workspace || workspaceItem
                        const isActive = currentWorkspaceId === workspace._id
                        
                        return (
                            <div
                                key={workspace._id}
                                className={`workspace-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleWorkspaceClick(workspaceItem)}
                            >
                                <IoBusiness className="workspace-icon" />
                                <div className="workspace-info">
                                    <span className="workspace-name">{workspace.name}</span>
                                    <span className="workspace-role">{workspaceItem.role}</span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}