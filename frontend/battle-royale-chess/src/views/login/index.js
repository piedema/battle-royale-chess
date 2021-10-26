import { useContext, useEffect } from 'react'

import { ServerContext } from '../../contexts/ServerContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { UserContext } from '../../contexts/UserContext'

import { authenticate } from '../../services/AuthenticationService'
import { register } from '../../services/UserService'

import BasicContainer from '../../components/basicContainer/BasicContainer.js'

import './index.css'

export default function Login() {

    const { serverAddress } = useContext(ServerContext)
    const { setIsAuthenticated } = useContext(AuthenticationContext)
    const { loadUserdata, email } = useContext(UserContext)

    useEffect(() => {
        console.log("email", email)
    }, [email])

    async function loginAsPlayer(){

        const username = document.querySelector('#login input#login_username').value
        const password = document.querySelector('#login input#login_password').value

        try {

            await authenticate(username, password)
            setIsAuthenticated(true)
            await loadUserdata()

        } catch (error){
            alert(error.response || error)
        }

    }

    function continueAsSpectator(){
        setIsAuthenticated(true)
    }

    async function register(){

        const username = document.querySelector('#register input#register_username').value
        const password1 = document.querySelector('#register input#register_password1').value
        const password2 = document.querySelector('#register input#register_password2').value
        const email = document.querySelector('#register input#register_email').value

        try {

            await register(username, password1, email)
            await authenticate(username, password1)
            setIsAuthenticated(true)
            loadUserdata()

        } catch (error){
            alert(error.response || error)
        }

    }

    return (
        <div className="login">
            <div id="title">Battle Royale Chess</div>
            <div id="login">
                <BasicContainer>
                    <input id="login_username" type="text" placeholder="username" /><br />
                    <input id="login_password" type="password" placeholder="password" /><br />
                    <button className="button" onClick={loginAsPlayer}>Login</button><br />
                </BasicContainer>
            </div>
            <br />
            <div id="register">
                <BasicContainer>
                    <input id="register_username" type="text" placeholder="username" /><br />
                    <input id="register_password1" type="password" placeholder="password" /><br />
                    <input id="register_password2" type="password" placeholder="repeat password" /><br />
                    <input id="register_email" type="text" placeholder="email" /><br />
                    <button className="button" onClick={register}>Register</button><br />
                </BasicContainer>
            </div>
            <br />
            <div id="spectator">
                <BasicContainer>
                    <button className="button" onClick={continueAsSpectator}>Continue as Spectator</button><br />
                </BasicContainer>
            </div>
        </div>
    )

}
