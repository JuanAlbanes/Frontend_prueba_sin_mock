import React, { useState } from 'react'
import useForm from '../../hooks/useForm.jsx'
import { register } from '../../services/authService.js'
import useFetch from '../../hooks/useFetch.jsx'
import './RegisterScreen.css'
import { Link } from 'react-router'


export const FORM_FIELDS = {
    NAME: 'name',
    EMAIL: 'email',
    PASSWORD: 'password'
}

const initial_form_state = {
    [FORM_FIELDS.NAME]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

const RegisterScreen = () => {
    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

    const onRegister = (form_state) => {
        sendRequest(() => register(
            form_state[FORM_FIELDS.NAME],
            form_state[FORM_FIELDS.EMAIL],
            form_state[FORM_FIELDS.PASSWORD]
        ))
    }

    const {
        form_state: register_form_state,
        handleSubmit,
        handleInputChange
    } = useForm({
        initial_form_state,
        onSubmit: onRegister
    })

    return (
        <div className='register-container'>
            <div className="top-nav">
                <Link to="/login" className="login-btn">Loguearse</Link>
            </div>
            <div className='register-left'>
                <div className='logo-wrapper'>
                    <img src="logo_slack.png" alt="logo_slack" className='logo-img' />
                </div>
            </div>
            <div className='register-right'>
                <div className='register-card'>
                    <h1>Registrate</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor={FORM_FIELDS.NAME}>Nombre:</label>
                            <input
                                name={FORM_FIELDS.NAME}
                                id={FORM_FIELDS.NAME}
                                type='text'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor={FORM_FIELDS.EMAIL}>Email:</label>
                            <input
                                name={FORM_FIELDS.EMAIL}
                                id={FORM_FIELDS.EMAIL}
                                type='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor={FORM_FIELDS.PASSWORD}>Contraseña:</label>
                            <input
                                name={FORM_FIELDS.PASSWORD}
                                id={FORM_FIELDS.PASSWORD}
                                type='password'
                                onChange={handleInputChange}
                            />
                        </div>
                        {
                            !response
                                ? <button type='submit' disabled={loading}>Registrarse</button>
                                : <>
                                    <button type='submit' disabled={true}>Registrado</button>
                                    <span className='success-msg'>{response.message}</span>
                                </>
                        }
                        {error && <span className='error-msg'>{error.message}</span>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen
