import mock_data from "../data/workspace-mock"

export const getMessagesByWorkspaceId = (workspace_id) => {
    for (const workspace of mock_data.workspaces) {
        if (Number(workspace.id) === Number(workspace_id)) {
            return [...workspace.messages]
        }
    }
    return []
}

export const addMessageToWorkspace = (workspace_id, text) => {
    for (const workspace of mock_data.workspaces) {
        if (Number(workspace.id) === Number(workspace_id)) {
            const newMessage = {
                id: workspace.messages.length + 1,
                emisor: "YO",
                hora: new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                texto: text,
                status: "enviado",
                isMyMessage: true,
            }
            workspace.messages.push(newMessage)
            return { ...newMessage }
        }
    }
    return null
}

export const deleteMessage = (workspace_id, message_id) => {
    for (const workspace of mock_data.workspaces) {
        if (Number(workspace.id) === Number(workspace_id)) {
            const index = workspace.messages.findIndex(
                (m) => m.id === Number(message_id)
            )
            if (index !== -1) {
                workspace.messages.splice(index, 1)
                return true
            }
        }
    }
    return false
}
