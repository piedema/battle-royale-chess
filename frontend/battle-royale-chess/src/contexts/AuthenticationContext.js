import { createContext, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from './UserContext'

import { authenticate } from '../services/AuthenticationService'
import { getUserdata } from '../services/UserService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const history = useHistory()

    const [authState, setAuthState] = useState("pending")
    const { setUsername, setEmail, setRole } = useContext(UserContext)

    const contextData = {
        authState:authState,
        authenticate:authenticateWithCredentials,
        authenticateAsSpectator:authenticateAsSpectator,
        loadUserdata:loadUserdata,
        logout:logout
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) return setAuthState("failed")
        loadUserdata()
    }, [])

    async function loadUserdata(){
        try {
            const result = await getUserdata()
            setAuthState("success")
            setUsername(result.username)
            setEmail(result.email)

            if(result.authorities.map(a => a.authority).includes("ROLE_ADMIN")) return setRole("ADMIN")
            setRole("USER")
            console.log("loading data is succes", result)
        } catch (error){
            setAuthState("failed")
            console.log(error)
        }
    }

    async function authenticateWithCredentials(username, password){
        const result = await authenticate(username, password)
        if(result && result.jwt){
            localStorage.setItem('token', result.jwt)
            loadUserdata()
        }

    }

    function authenticateAsSpectator(){
        setUsername("Spectator")
        setRole("SPECTATOR")
        setAuthState("success")

    }

    function logout(){
        localStorage.removeItem('token')
        setAuthState("failed")
        setUsername(undefined)
        setEmail(undefined)
        setRole(undefined)
    }

    return (
        <AuthenticationContext.Provider value={contextData}>
            {
                authState === "pending"
                ? <p>Loading...</p>
                : children
            }
        </AuthenticationContext.Provider>
    )
}
