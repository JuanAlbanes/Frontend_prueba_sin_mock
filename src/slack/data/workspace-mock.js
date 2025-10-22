const mock_data = {
    workspaces: [
        {
            id: 1,
            name: "Desarrollo Frontend",
            description: "Equipo de desarrollo frontend",
            created_at: "10:30 AM",
            messages: [
                {
                    id: 1,
                    emisor: "Juan Albanés",
                    hora: "10:30",
                    texto: "Hola equipo! Cómo van con el nuevo proyecto?",
                    status: "visto",
                    isMyMessage: false,
                },
                {
                    id: 2,
                    emisor: "YO",
                    hora: "10:32",
                    texto: "Todo bien! Ya terminé el componente del header",
                    status: "visto",
                    isMyMessage: true,
                },
                {
                    id: 3,
                    emisor: "María García",
                    hora: "10:35",
                    texto: "Excelente! Yo estoy trabajando en los estilos",
                    status: "visto",
                    isMyMessage: false,
                },
            ],
        },
        {
            id: 2,
            name: "Marketing Digital",
            description: "Estrategias de marketing",
            created_at: "09:15 AM",
            messages: [
                {
                    id: 1,
                    emisor: "Carlos López",
                    hora: "09:15",
                    texto: "Buenos días! Tenemos que revisar la campaña de redes",
                    status: "visto",
                    isMyMessage: false,
                },
                {
                    id: 2,
                    emisor: "YO",
                    hora: "09:20",
                    texto: "Sí, ya preparé el reporte de métricas",
                    status: "visto",
                    isMyMessage: true,
                },
            ],
        },
        {
            id: 3,
            name: "Recursos Humanos",
            description: "Gestión de personal",
            created_at: "08:45 AM",
            messages: [
                {
                    id: 1,
                    emisor: "Ana Martínez",
                    hora: "08:45",
                    texto: "Recordatorio: Reunión de equipo a las 3 PM",
                    status: "visto",
                    isMyMessage: false,
                },
            ],
        },
    ],
}

export default mock_data