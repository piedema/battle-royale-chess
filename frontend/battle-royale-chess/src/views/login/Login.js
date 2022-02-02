import { useContext, useState, useEffect, useRef } from 'react'

import { useForm } from "react-hook-form"

import { AuthenticationContext } from '../../contexts/AuthenticationContext'

import BasicContainer from '../../components/basicContainer/BasicContainer.js'
import Tooltip from '../../components/form/tooltip/Tooltip'

import { usernameExists, emailExists, chessComAccountExists } from '../../services/UserService'

import containsDigit from '../../helpers/containsDigit'

import styles from './Login.module.css'

export default function Login() {

    const { handleSubmit, register, formState: { errors } } = useForm()
    const { handleSubmit: handleSubmit2, register: register2, watch, formState: { errors: errors2 } } = useForm()

    const registerPassword = useRef({})
    registerPassword.current = watch('registerPassword', '')

    const { authenticate, registerUser, continueAsSpectator } = useContext(AuthenticationContext)

    const [resultStatus, setResultStatus] = useState(undefined)
    const [registerChessCom, setRegisterChessCom] = useState(false)

    async function handleLogin({ loginUsername, loginPassword }){
        const result = await authenticate(loginUsername, loginPassword)
        setResultStatus(result?.response?.status)
    }

    function handleRegister({ registerUsername, registerPassword, registerEmail, registerChessCom }){
        registerUser(registerUsername, registerPassword, registerEmail, registerChessCom)
    }

    function handleLoginAsSpectator(){
        continueAsSpectator()
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.title}>Battle Royale Chess</div>
            <form onSubmit={handleSubmit(handleLogin)} id="login" className={styles.formContainer}>
                <BasicContainer>
                    <div className={styles.groupTitle}>
                        Login
                    </div>
                    <input
                        name="loginUsername"
                        type="text"
                        placeholder="player name"
                        className={styles.input}
                        {...register('loginUsername', { required: true })}
                    />
                    {errors.loginUsername?.type === "required" && <Tooltip>Username is required</Tooltip>}
                    <input
                        name="loginPassword"
                        type="password"
                        placeholder="password"
                        className={styles.input}
                        {...register('loginPassword', {
                            required: true,
                            minLength: 8,
                            validate: containsDigit
                        })}
                    />
                    {errors.loginPassword?.type === "required" && <Tooltip>Password is required</Tooltip>}
                    {errors.loginPassword?.type === "minLength" && <Tooltip>Password needs to be at least 8 characters</Tooltip>}
                    {errors.loginPassword?.type === "validate" && <Tooltip>Password needs at least 1 digit</Tooltip>}
                    { resultStatus === 403 ? <Tooltip>Wrong username/password combination</Tooltip> : null }
                    <button className={styles.loginSubmitBtn} type="submit">Login</button>
                </BasicContainer>
            </form>
            <form onSubmit={handleSubmit2(handleRegister)} id="register" className={styles.formContainer}>
                <BasicContainer>
                    <div className={styles.groupTitle}>
                        Register as new player
                    </div>
                    <input
                        name="registerUsername"
                        type="text"
                        placeholder="player name"
                        className={styles.input}
                        {...register2('registerUsername', {
                            required: true,
                            validate: async value => {
                                const result = await usernameExists(value)
                                return !result
                            }
                        })}
                    />
                    {errors2.registerUsername?.type === "required" && <Tooltip>Username is required</Tooltip>}
                    {errors2.registerUsername?.type === "validate" && <Tooltip>Username is not available</Tooltip>}
                    <input
                        name="registerPassword"
                        type="password"
                        placeholder="password"
                        className={styles.input}
                        {...register2('registerPassword', {
                            required: true,
                            minLength: 8,
                            validate: containsDigit
                        })}
                    />
                    {errors2.registerPassword?.type === "required" && <Tooltip>Password is required</Tooltip>}
                    {errors2.registerPassword?.type === "minLength" && <Tooltip>Password needs to be at least 8 characters</Tooltip>}
                    {errors2.registerPassword?.type === "validate" && <Tooltip>Password needs at least 1 digit</Tooltip>}
                    <input
                        name="registerPasswordCheck"
                        type="password"
                        placeholder="password"
                        className={styles.input}
                        {...register2('registerPasswordCheck', {
                            validate: pw => pw === registerPassword.current
                        })}
                    />
                    {errors2.registerPasswordCheck?.type === "validate" && <Tooltip>Second password does not match first password</Tooltip>}
                    <input
                        name="registerEmail"
                        type="text"
                        placeholder="email"
                        className={styles.input}
                        {...register2('registerEmail', {
                            required: true,
                            validate: async value => {
                                const result = await emailExists(value)
                                return !result
                            }
                        })}
                    />
                    {errors2.registerEmail?.type === "required" && <Tooltip>Email is required</Tooltip>}
                    {errors2.registerEmail?.type === "validate" && <Tooltip>Email is not available</Tooltip>}
                    <div className={styles.checkbox}>
                        <input
                            id="registerChessCom"
                            type="checkbox"
                            checked={registerChessCom}
                            onChange={() => setRegisterChessCom(prev => { return !prev })}
                            className={styles.checkbox}
                        />
                        <label htmlFor="registerChessCom">Link with Chess.com account</label>
                        {
                            registerChessCom === true
                            ? (
                                <>
                                    <input
                                        name="registerChessCom"
                                        type="text"
                                        placeholder="chess.com username"
                                        className={styles.input}
                                        {...register2('registerChessCom', {
                                            validate: async value => {
                                                const result = await chessComAccountExists(value)
                                                return result
                                            }
                                        })}
                                    />
                                    {errors2.registerChessCom?.type === "validate" && <Tooltip>Chess.com username does not exist</Tooltip>}
                                </>
                            )
                            : null
                        }
                    </div>
                    <button className={styles.registerSubmitBtn} type="submit">Register</button>
                </BasicContainer>
            </form>
            <div id="spectator" className={styles.formContainer}>
                <BasicContainer>
                    <button className={styles.spectatorBtn} type="button" onClick={handleLoginAsSpectator}>Continue as Spectator</button>
                </BasicContainer>
            </div>
        </div>
    )

}
