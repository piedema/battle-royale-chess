import { useContext, useState, useEffect } from 'react'

import { useForm } from "react-hook-form"

import { AuthenticationContext } from '../../contexts/AuthenticationContext'

import BasicContainer from '../../components/basicContainer/BasicContainer.js'

import styles from './Login.module.css'

export default function Login() {

    const { handleSubmit } = useForm()

    const [loginUsernameValue, setLoginUsernameValue] = useState("")
    const [loginPasswordValue, setLoginPasswordValue] = useState("")

    const [registerUsernameValue, setRegisterUsernameValue] = useState("")
    const [registerPasswordValue, setRegisterPasswordValue] = useState("")
    const [registerPasswordCheckValue, setRegisterPasswordCheckValue] = useState("")
    const [registerEmailValue, setRegisterEmailValue] = useState("")

    const { authenticate, register, continueAsSpectator } = useContext(AuthenticationContext)

    async function handleLogin(){
        authenticate(loginUsernameValue, loginPasswordValue)
    }

    function handleRegister(){
        register(registerUsernameValue, registerPasswordValue, registerEmailValue)
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
                        value={loginUsernameValue}
                        onChange={e => setLoginUsernameValue(e.target.value)}
                        />
                    <br />
                    <input
                        name="loginPassword"
                        type="text"
                        placeholder="password"
                        className={styles.input}
                        value={loginPasswordValue}
                        onChange={e => setLoginPasswordValue(e.target.value)}
                        />
                    <br />
                    <button className={styles.loginSubmitBtn} type="submit">Login</button><br />
                </BasicContainer>
            </form>
            <form onSubmit={handleSubmit(handleRegister)} id="register" className={styles.formContainer}>
                <BasicContainer>
                    <div className={styles.groupTitle}>
                        Register as new player
                    </div>
                    <input
                        name="registerUsername"
                        type="text"
                        placeholder="player name"
                        className={styles.input}
                        value={registerUsernameValue}
                        onChange={e => setRegisterUsernameValue(e.target.value)}
                        />
                    <br />
                    <input
                        name="registerPassword"
                        type="text"
                        placeholder="password"
                        className={styles.input}
                        value={registerPasswordValue}
                        onChange={e => setRegisterPasswordValue(e.target.value)}
                        />
                    <br />
                    <input
                        name="registerPasswordCheck"
                        type="text"
                        placeholder="password"
                        className={styles.input}
                        value={registerPasswordCheckValue}
                        onChange={e => setRegisterPasswordCheckValue(e.target.value)}
                        />
                    <br />
                    <input
                        name="registerEmail"
                        type="text"
                        placeholder="email"
                        className={styles.input}
                        value={registerEmailValue}
                        onChange={e => setRegisterEmailValue(e.target.value)}
                        />
                    <br />
                    <button className={styles.registerSubmitBtn} type="submit">Register</button><br />
                </BasicContainer>
            </form>
            <div id="spectator" className={styles.formContainer}>
                <BasicContainer>
                    <button className={styles.spectatorBtn} type="button" onClick={handleLoginAsSpectator}>Continue as Spectator</button><br />
                </BasicContainer>
            </div>
        </div>
    )

}
