import { createContext, useState, useContext, useEffect } from 'react'

import Cookies from 'js-cookie'

import { UserContext } from './UserContext'

import { authenticate } from '../services/AuthenticationService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    //const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authState, setAuthState] = useState("pending")
    const { loadUserdata, setRole } = useContext(UserContext)

    const contextData = {
        authState:authState,
        authenticate:authenticateWithCredentials,
        authenticateAsSpectator:authenticateAsSpectator
    }

    useEffect(() => {

        if(Cookies.get('jwt') === undefined) return setAuthState("failed")
        fetchUserdata()

    }, [])

    async function fetchUserdata(){

        try {

            await loadUserdata()
            setAuthState("success")

        } catch (error) {
            setAuthState("failed")
            alert(error.response || error)
        }

    }

    async function authenticateWithCredentials(username, password){

        try {
            await authenticate(username, password)
            await loadUserdata()
            setAuthState("success")

        } catch (error) {
            setAuthState("failed")
            alert(error.response || error)
        }

    }

    function authenticateAsSpectator(){
        setRole("SPECTATOR")
        setAuthState("success")
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
