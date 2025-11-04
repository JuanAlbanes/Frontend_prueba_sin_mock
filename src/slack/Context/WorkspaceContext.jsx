import { createContext, useState, useEffect } from "react"
import { getWorkspaceList, createWorkspace, deleteWorkspace } from "../services/workspaceService"

export const WorkspaceContext = createContext({
    workspaces: [],
    isLoadingWorkspaces: true,
    loadWorkspaces: async () => {}, // ✅ AÑADIDO: Esta función faltaba
    handleAddWorkspace: async (name, description) => { },
    handleDeleteWorkspace: async (workspace_id) => { },
    handleSetWorkspaces: (workspaces) => { },
})

const WorkspaceContextProvider = ({ children }) => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)

    // Cargar workspaces al montar el contexto
    useEffect(() => {
        loadWorkspaces()
    }, [])

    const loadWorkspaces = async () => {
        try {
            setIsLoadingWorkspaces(true)
            const response = await getWorkspaceList()
            if (response.data && response.data.workspaces) {
                setWorkspaces(response.data.workspaces)
            }
        } catch (error) {
            console.error('Error loading workspaces:', error)
        } finally {
            setIsLoadingWorkspaces(false)
        }
    }

    const handleAddWorkspace = async (name, url_image = "") => {
        try {
            const response = await createWorkspace(name, url_image)
            if (response.ok) {
                // Recargar la lista completa para incluir el nuevo workspace
                await loadWorkspaces()
                return true
            }
            return false
        } catch (error) {
            console.error('Error creating workspace:', error)
            throw error
        }
    }

    const handleDeleteWorkspace = async (workspace_id) => {
        try {
            const response = await deleteWorkspace(workspace_id)
            if (response.ok) {
                // Actualizar la lista localmente
                const updatedWorkspaces = workspaces.filter((w) => w._id !== workspace_id)
                setWorkspaces(updatedWorkspaces)
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting workspace:', error)
            throw error
        }
    }

    const handleSetWorkspaces = (newWorkspaces) => {
        setWorkspaces(newWorkspaces)
    }

    return (
        <WorkspaceContext.Provider
            value={{
                workspaces,
                isLoadingWorkspaces,
                loadWorkspaces, // ✅ AÑADIDO: Exportar la función
                handleAddWorkspace,
                handleDeleteWorkspace,
                handleSetWorkspaces,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceContextProvider