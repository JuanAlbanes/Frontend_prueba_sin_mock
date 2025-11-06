/* import React, { useState, useEffect, useContext } from 'react'
import { getWorkspaceList, createWorkspace, updateWorkspace, deleteWorkspace } from '../../services/workspaceService'
import { inviteMemberToWorkspace } from '../../services/memberService'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import useFetch from '../../../hooks/useFetch'
import './WorkspaceList.css'

import { IoAdd, IoBusiness } from "react-icons/io5"

import Swal from 'sweetalert2'

export default function WorkspaceList({ onWorkspaceSelect, currentWorkspaceId }) {
    const { workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const [searchWorkspace, setSearchWorkspace] = useState("")
    const { loading, error, sendRequest } = useFetch()

    useEffect(() => {
        if (workspaces.length === 0) {
            loadWorkspaces()
        }
    }, [workspaces.length, loadWorkspaces])

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
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace creado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al crear workspace')
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

    const handleEditWorkspace = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "Editar workspace",
            html: `
                <input id="workspace-name" class="swal2-input" placeholder="Nombre del workspace" value="${workspace.name}">
                <input id="workspace-image" class="swal2-input" placeholder="URL de imagen (opcional)" value="${workspace.url_image || ''}">
            `,
            confirmButtonText: "Guardar",
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
                        const response = await updateWorkspace(
                            workspace._id,
                            result.value.name, 
                            result.value.url_image
                        )
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace actualizado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al actualizar workspace')
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

    const handleDeleteWorkspace = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "¿Eliminar workspace?",
            text: `¿Estás seguro de que quieres eliminar "${workspace.name}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#ffffff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await deleteWorkspace(workspace._id)
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace eliminado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al eliminar workspace')
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

    const handleInviteMember = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "Invitar miembro",
            html: `
                <div class="invite-modal-content">
                    <p class="invite-description">Invitar a alguien a <strong>${workspace.name}</strong></p>
                    <input 
                        id="member-email" 
                        class="swal2-input" 
                        placeholder="Email del invitado" 
                        type="email"
                        style="margin-top: 15px;"
                    >
                    <p class="invite-note">Se enviará una invitación por email con un enlace para unirse</p>
                </div>
            `,
            confirmButtonText: "Enviar invitación",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            width: "500px",
            preConfirm: () => {
                const email = document.getElementById("member-email").value
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                
                if (!email) {
                    Swal.showValidationMessage("El email es requerido")
                    return false
                }
                
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage("Por favor ingresa un email válido")
                    return false
                }
                
                return { email }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await inviteMemberToWorkspace(
                            workspace._id,
                            result.value.email
                        )
                        
                        if (response && response.ok) {
                            Swal.fire({
                                title: "¡Invitación enviada!",
                                text: `Se ha enviado una invitación a ${result.value.email}. El usuario recibirá un email con el enlace para unirse.`,
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 3000,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al enviar la invitación')
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
            const workspaceData = workspace.workspace || workspace
            onWorkspaceSelect(workspaceData)
        }
    }

    const filteredWorkspaces = workspaces.filter((workspaceItem) => {
        const workspace = workspaceItem.workspace || workspaceItem
        const workspaceName = workspace.name || ''
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
                        const isAdmin = workspaceItem.role === 'admin'
                        
                        return (
                            <div
                                key={workspace._id}
                                className={`workspace-list-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleWorkspaceClick(workspaceItem)}
                            >
                                <IoBusiness className="workspace-list-icon" />
                                <div className="workspace-list-info">
                                    <span className="workspace-list-name">{workspace.name}</span>
                                    <span className="workspace-list-role">{workspaceItem.role}</span>
                                </div>
                                
                                {isAdmin && (
                                    <div className="workspace-list-actions">
                                        <button 
                                            className="workspace-list-action-btn invite-btn"
                                            onClick={(e) => handleInviteMember(workspaceItem, e)}
                                            title="Invitar miembro"
                                        >
                                            Invitar
                                        </button>
                                        <button 
                                            className="workspace-list-action-btn edit-btn"
                                            onClick={(e) => handleEditWorkspace(workspaceItem, e)}
                                            title="Editar workspace"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="workspace-list-action-btn delete-btn"
                                            onClick={(e) => handleDeleteWorkspace(workspaceItem, e)}
                                            title="Eliminar workspace"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
} */
import React, { useState, useEffect, useContext } from 'react'
import { getWorkspaceList, createWorkspace, updateWorkspace, deleteWorkspace } from '../../services/workspaceService'
import { inviteMemberToWorkspace } from '../../services/memberService'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import useFetch from '../../../hooks/useFetch'
import './WorkspaceList.css'

// ✅ ICONOS
import { IoAdd, IoBusiness, IoSettings, IoTrash, IoPersonAdd } from "react-icons/io5"

import Swal from 'sweetalert2'

export default function WorkspaceList({ onWorkspaceSelect, currentWorkspaceId }) {
    const { workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const [searchWorkspace, setSearchWorkspace] = useState("")
    const { loading, error, sendRequest } = useFetch()

    useEffect(() => {
        if (workspaces.length === 0) {
            loadWorkspaces()
        }
    }, [workspaces.length, loadWorkspaces])

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
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace creado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al crear workspace')
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

    const handleEditWorkspace = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "Editar workspace",
            html: `
                <input id="workspace-name" class="swal2-input" placeholder="Nombre del workspace" value="${workspace.name}">
                <input id="workspace-image" class="swal2-input" placeholder="URL de imagen (opcional)" value="${workspace.url_image || ''}">
            `,
            confirmButtonText: "Guardar",
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
                        const response = await updateWorkspace(
                            workspace._id,
                            result.value.name, 
                            result.value.url_image
                        )
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace actualizado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al actualizar workspace')
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

    const handleDeleteWorkspace = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "¿Eliminar workspace?",
            text: `¿Estás seguro de que quieres eliminar "${workspace.name}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#ffffff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await deleteWorkspace(workspace._id)
                        if (response && response.ok) {
                            await loadWorkspaces()
                            Swal.fire({
                                title: "Workspace eliminado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al eliminar workspace')
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

    const handleInviteMember = (workspaceItem, event) => {
        event.stopPropagation()
        
        const workspace = workspaceItem.workspace || workspaceItem
        
        Swal.fire({
            title: "Invitar miembro",
            html: `
                <div class="invite-modal-content">
                    <p class="invite-description">Invitar a alguien a <strong>${workspace.name}</strong></p>
                    <input 
                        id="member-email" 
                        class="swal2-input" 
                        placeholder="Email del invitado" 
                        type="email"
                        style="margin-top: 15px;"
                    >
                    <p class="invite-note">Se enviará una invitación por email con un enlace para unirse</p>
                </div>
            `,
            confirmButtonText: "Enviar invitación",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            width: "500px",
            preConfirm: () => {
                const email = document.getElementById("member-email").value
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                
                if (!email) {
                    Swal.showValidationMessage("El email es requerido")
                    return false
                }
                
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage("Por favor ingresa un email válido")
                    return false
                }
                
                return { email }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await inviteMemberToWorkspace(
                            workspace._id,
                            result.value.email
                        )
                        
                        if (response && response.ok) {
                            Swal.fire({
                                title: "¡Invitación enviada!",
                                text: `Se ha enviado una invitación a ${result.value.email}. El usuario recibirá un email con el enlace para unirse.`,
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 3000,
                            })
                        } else {
                            throw new Error(response?.message || 'Error al enviar la invitación')
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
            const workspaceData = workspace.workspace || workspace
            onWorkspaceSelect(workspaceData)
        }
    }

    const filteredWorkspaces = workspaces.filter((workspaceItem) => {
        const workspace = workspaceItem.workspace || workspaceItem
        const workspaceName = workspace.name || ''
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
                        const isAdmin = workspaceItem.role === 'admin'
                        
                        return (
                            <div
                                key={workspace._id}
                                className={`workspace-list-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleWorkspaceClick(workspaceItem)}
                            >
                                <IoBusiness className="workspace-list-icon" />
                                <div className="workspace-list-info">
                                    <span className="workspace-list-name">{workspace.name}</span>
                                    <span className="workspace-list-role">{workspaceItem.role}</span>
                                </div>
                                
                                {isAdmin && (
                                    <div className="workspace-list-actions">
                                        <button 
                                            className="workspace-list-action-btn invite-btn"
                                            onClick={(e) => handleInviteMember(workspaceItem, e)}
                                            title="Invitar miembro"
                                        >
                                            <IoPersonAdd className="action-icon" />
                                        </button>
                                        <button 
                                            className="workspace-list-action-btn edit-btn"
                                            onClick={(e) => handleEditWorkspace(workspaceItem, e)}
                                            title="Editar workspace"
                                        >
                                            <IoSettings className="action-icon" />
                                        </button>
                                        <button 
                                            className="workspace-list-action-btn delete-btn"
                                            onClick={(e) => handleDeleteWorkspace(workspaceItem, e)}
                                            title="Eliminar workspace"
                                        >
                                            <IoTrash className="action-icon" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}