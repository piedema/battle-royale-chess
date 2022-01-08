import { createContext, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from './UserContext'

import { getUserdata, doAuthenticate, doRegister, extractRole } from '../services/UserService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const history = useHistory()

    const [authState, setAuthState] = useState("pending")
    const { setUsername, setEmail, setRole } = useContext(UserContext)

    const contextData = {
        authState:authState,
        authenticate:authenticate,
        register:register,
        continueAsSpectator:continueAsSpectator,
        logout:logout,
        refreshUser:refreshUser
    }

    useEffect(() => {

        const token = localStorage.getItem('token')

        if(!token){

            return setAuthState("failed")

        }

        if(token){

            ;(async () => {

                try {

                    const userdata = await getUserdata()

                    setUser(userdata.data.username, userdata.data.email, extractRole(userdata.data.authorities))

                } catch (error) {

                    console.log(error)

                    unsetUser()

                }

            })()

        }

    }, [])

    async function authenticate(username, password){

        try {

            const result = await doAuthenticate(username, password)

            localStorage.setItem('token', result.data.jwt)

            const userdata = await getUserdata()

            setUser(userdata.data.username, userdata.data.email, extractRole(userdata.data.authorities))

        } catch (error) {

            unsetUser()

        }
    }

    async function register(username, password, email){
        await doRegister(username, password, email)
        authenticate(username, password)
    }

    async function refreshUser(){

        try {

            const userdata = await getUserdata()

            console.log(userdata)

            setUser(userdata.data.username, userdata.data.email, extractRole(userdata.data.authorities))

        } catch (error) {

            console.log(error)

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

    function setUser(username, email, role){
        setUsername(username)
        setEmail(email)
        setRole(role)
        setAuthState("success")
    }

    function unsetUser(){
        setUsername(undefined)
        setEmail(undefined)
        setRole(undefined)
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
