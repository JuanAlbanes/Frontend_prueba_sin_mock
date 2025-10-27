import React, { useEffect } from 'react'
import useFetch from '../../hooks/useFetch.jsx'
import useForm from '../../hooks/useForm.jsx'
import { resetPassword } from '../../services/authService.js'
import { useNavigate, Link } from 'react-router'
import './ResetPasswordScreen.css'

const FORM_FIELDS = {
    EMAIL: 'email',
    NEW_PASSWORD: 'newPassword',
    CONFIRM_PASSWORD: 'confirmPassword'
}

const initial_form_state = {
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.NEW_PASSWORD]: '',
    [FORM_FIELDS.CONFIRM_PASSWORD]: ''
}

export const ResetPasswordScreen = () => {
    const navigate = useNavigate()

    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

    const onResetPassword = (form_state) => {
        if (form_state[FORM_FIELDS.NEW_PASSWORD] !== form_state[FORM_FIELDS.CONFIRM_PASSWORD]) {
            alert('Las contraseñas no coinciden')
            return
        }

        sendRequest(() => resetPassword(
            form_state[FORM_FIELDS.EMAIL],
            form_state[FORM_FIELDS.NEW_PASSWORD]
        ))
    }

    useEffect(() => {
        if (response && response.ok) {
            alert('Contraseña reestablecida exitosamente')
            navigate('/login')
        }
    }, [response, navigate])

    const {
        form_state: reset_form_state,
        handleSubmit,
        handleInputChange
    } = useForm({
        initial_form_state,
        onSubmit: onResetPassword
    })

    return (
        <div className='global-container-reset'>
            <div className="top-nav_btn">
                <Link to="/login" className="login-btn">Iniciar Sesión</Link>
            </div>
            <div className='container-reset'>
                <h1>Reestablecer Contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <div className='container-email'>
                        <label htmlFor={FORM_FIELDS.EMAIL}>Email:</label>
                        <input
                            name={FORM_FIELDS.EMAIL}
                            id={FORM_FIELDS.EMAIL}
                            type='email'
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='container-new-password'>
                        <label htmlFor={FORM_FIELDS.NEW_PASSWORD}>Nueva Contraseña:</label>
                        <input
                            name={FORM_FIELDS.NEW_PASSWORD}
                            id={FORM_FIELDS.NEW_PASSWORD}
                            type='password'
                            onChange={handleInputChange}
                            minLength="8"
                            required
                        />
                    </div>
                    <div className='container-confirm-password'>
                        <label htmlFor={FORM_FIELDS.CONFIRM_PASSWORD}>Confirmar Contraseña:</label>
                        <input
                            name={FORM_FIELDS.CONFIRM_PASSWORD}
                            id={FORM_FIELDS.CONFIRM_PASSWORD}
                            type='password'
                            onChange={handleInputChange}
                            minLength="8"
                            required
                        />
                    </div>
                    {
                        !response
                            ?
                            <button type='submit' disabled={loading}>
                                {loading ? 'Reestableciendo...' : 'Reestablecer Contraseña'}
                            </button>
                            :
                            <>
                                <button type='submit' disabled={true}>Contraseña Reestablecida</button>
                                <span style={{ color: 'green' }}>{response.message}</span>
                            </>
                    }
                    {
                        error && <span style={{ color: 'red' }}>{error.message}</span>
                    }
                </form>
            </div>
        </div>
    )
}