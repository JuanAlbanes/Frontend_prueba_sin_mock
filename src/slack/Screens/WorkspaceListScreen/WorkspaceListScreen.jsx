import { useContext, useEffect } from "react"
import { useNavigate } from "react-router"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import WorkspaceList from "../../Components/WorkspaceList/WorkspaceList"
import LoaderSpinner from "../../Components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../Components/Layout/SlackLayout"
import "./WorkspaceListScreen.css"

export default function WorkspaceListScreen() {
    const { isLoadingWorkspaces, workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()

    // ✅ Asegurar que se carguen los workspaces al montar el componente
    useEffect(() => {
        if (!workspaces || workspaces.length === 0) {
            loadWorkspaces()
        }
    }, [])

    const handleWorkspaceSelect = (workspace) => {
        // ✅ CORREGIDO: Usar _id en lugar de id (Mongoose usa _id)
        navigate(`/workspace/${workspace._id}`)
    }

    const sidebarContent = (
        <div className="workspace-sidebar">
            <div className="sidebar-header">
                <h3>Tus Workspaces</h3>
            </div>
            <div className="sidebar-workspace-list">
                <WorkspaceList 
                    onWorkspaceSelect={handleWorkspaceSelect} 
                    currentWorkspaceId={null} // No hay workspace seleccionado en esta pantalla
                />
            </div>
        </div>
    )

    if (isLoadingWorkspaces) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="workspace-welcome">
                <h1>Selecciona un workspace para comenzar</h1>
                <p>Elige uno de la sidebar o crea uno nuevo</p>
                
                {/* ✅ Mensaje adicional si no hay workspaces */}
                {workspaces && workspaces.length === 0 && (
                    <div className="no-workspaces-message">
                        <p>No tienes workspaces aún. ¡Crea uno nuevo usando el botón "+" en la sidebar!</p>
                    </div>
                )}
            </div>
        </SlackLayout>
    )
}