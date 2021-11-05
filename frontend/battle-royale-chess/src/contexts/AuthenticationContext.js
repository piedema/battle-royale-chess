import { createContext, useState, useContext, useEffect } from 'react'

import Cookies from 'js-cookie'

import { UserContext } from './UserContext'

import { authenticate } from '../services/AuthenticationService'
import { getUserdata } from '../services/UserService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const [authState, setAuthState] = useState("pending")
    const { setUsername, setEmail, setRole, username, email, role } = useContext(UserContext)

    const contextData = {
        authState:authState,
        authenticate:authenticateWithCredentials,
        authenticateAsSpectator:authenticateAsSpectator,
        logout:logout
    }

    useEffect(() => {
        if(Cookies.get('jwt') === undefined) return setAuthState("failed")
        loadUserdata()
    }, [])

    useEffect(() => {
        console.log(username, email, role)
    }, [role])

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
        await authenticate(username, password)
        loadUserdata()

    }

    function authenticateAsSpectator(){
        setUsername("Spectator")
        setRole("SPECTATOR")
        setAuthState("success")

    }

    function logout(){
        Cookies.remove('jwt')
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
