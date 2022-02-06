import { createContext, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'

import { UserContext } from './UserContext'

import { getUserdata, doAuthenticate, doRegister, extractRole } from '../services/UserService'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const history = useHistory()
    // const alert = useAlert()

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

    // check if a token is present. if so try to fetch userdata
    // otherwise set auth state to return to login
    useEffect(() => {

        const token = localStorage.getItem('token')

        if(!token){

            return setAuthState("failed")

        }

        if(token){

            refreshUser()

        }

    }, [])

    // function gets called to authenticate on login attempt
    // set token when it is retrieved and retrieve userdata
    async function authenticate(username, password){

        try {

            const result = await doAuthenticate(username, password)

            localStorage.setItem('token', result.data.jwt)

            refreshUser()

        } catch (error) {

            console.log('Could not log in with provided username and password')

            unsetUser()

        }
    }

    // registers and then authenticates/login user
    async function register(username, password, email, chessCom){
        await doRegister(username, password, email, chessCom)
        authenticate(username, password)
    }

    // refreshUser retrieves userdata and sets it in the context
    // if failed delete user context data and they are automatically redirected to login
    async function refreshUser(){

        try {

            const userdata = await getUserdata()

            setUser(userdata.data.username, userdata.data.email, extractRole(userdata.data.authorities), userdata.data.chessCom)

        } catch (error) {

            unsetUser()

        }

    }

    // for logging in as spectator. userdata retrieval is not neccessary
    function continueAsSpectator(){
        setUser("Spectator", undefined, "SPECTATOR")
    }

    // log out a user and remove token to enforce relogin
    function logout(){
        localStorage.removeItem('token')
        unsetUser()
    }

    // setting values to this context
    function setUser(username, email, role, chessCom){
        setUsername(username)
        setEmail(email)
        setRole(role)
        setChessCom(chessCom)
        setAuthState("success")
    }

    // remove all values from this context
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
