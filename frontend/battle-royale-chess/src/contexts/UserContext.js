import { createContext, useState, useContext } from 'react'

import { getUserdata } from '../services/UserService'

export const UserContext = createContext({})

export default function UserContextProvider({ children }){

    const [username, setUsername] = useState(undefined)
    const [email, setEmail] = useState(undefined)
    const [role, setRole] = useState("SPECTATOR")

    const contextData = {
        username:username,
        email:email,
        role:role,
        setRole:setRole,
        loadUserdata:loadUserdata
    }

    async function loadUserdata(){

        const response = await getUserdata()

        setUsername(response.username)
        setEmail(response.email)
        setRole(response.role)

    }

    return (
        <UserContext.Provider value={contextData}>
            { children }
        </UserContext.Provider>
    )
}
