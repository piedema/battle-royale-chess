import { useContext } from 'react'

import axios from 'axios'

import { ServerContext } from '../../contexts/ServerContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { UserContext } from '../../contexts/UserContext'

import './index.css'

export default function Login() {

    const { serverAddress } = useContext(ServerContext)
    const { setIsAuthenticated } = useContext(AuthenticationContext)
    const { setRole, getUserData } = useContext(UserContext)

    async function loginAsPlayer(){

        const username = document.querySelector('#usernameInput').innerHTML
        const password = document.querySelector('#passwordInput').innerHTML

        const result = await loginAtBackend(username, password)

        if(result === false) alert('Wrong username or password given')

    }

    function continueAsSpectator(){

        setIsAuthenticated(true)

    }

    async function loginAtBackend(username, password){

        // make api request to backend
        const options = {
            url:serverAddress + '/login',
            method:'POST',
            data:{
                username,
                password
            }
        }

        try {

            // make api call
            const res = await axios(options)

            // if request successfull return true, otherwise false
            return res.status === 200 ? true : false

        } catch (error) {

            alert(error)

            return false

        }

    }

    return (
        <div className="login">
            <div id="title">Battle Royale Chess</div>
            <div className="container">
                <input id="usernameInput" type="text" placeholder="username" /><br />
                <input id="passwordInput" type="password" placeholder="password" /><br />
                <button id="loginBtn" onClick={loginAsPlayer}>Login</button><br /><br />
            </div>
            <div id="orDiv">- OR -</div><br />
            <div className="container">
                <button id="spectatorBtn" onClick={continueAsSpectator}>Continue as Spectator</button><br /><br />
            </div>
        </div>
    )

}
