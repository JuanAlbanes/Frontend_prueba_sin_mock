import "./LoaderSpinner.css"

export default function LoaderSpinner() {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p className="loader-text">Cargando...</p>
        </div>
    )
} 
