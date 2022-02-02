import { createContext, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from './UserContext'

import { getUserdata, doAuthenticate, doRegister, extractRole } from '../services/UserService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const history = useHistory()

    const [authState, setAuthState] = useState("pending")
    const { setUsername, setEmail, setRole, setChessCom } = useContext(UserContext)

    const contextData = {
        authState,
        authenticate,
        registerUser:register,
        continueAsSpectator,
        logout,
        refreshUser
    }

    useEffect(() => {

        const token = localStorage.getItem('token')

        if(!token){

            return setAuthState("failed")

        }

        if(token){

            refreshUser()

        }

    }, [])

    async function authenticate(username, password){

        try {

            const result = await doAuthenticate(username, password)

            localStorage.setItem('token', result.data.jwt)

            refreshUser()

        } catch (error) {

            return error

            unsetUser()

        }
    }

    async function register(username, password, email, chessCom){
        await doRegister(username, password, email, chessCom)
        authenticate(username, password)
    }

    async function refreshUser(){

        try {

            const userdata = await getUserdata()

            setUser(userdata.data.username, userdata.data.email, extractRole(userdata.data.authorities), userdata.data.chessCom)

        } catch (error) {

            unsetUser()

        }

    }

    function continueAsSpectator(){
        setUser("Spectator", undefined, "SPECTATOR")
    }

    function logout(){
        localStorage.removeItem('token')
        unsetUser()
    }

    function setUser(username, email, role, chessCom){
        setUsername(username)
        setEmail(email)
        setRole(role)
        setChessCom(chessCom)
        setAuthState("success")
    }

    function unsetUser(){
        setUsername(undefined)
        setEmail(undefined)
        setRole(undefined)
        setChessCom(undefined)
        setAuthState("failed")
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
