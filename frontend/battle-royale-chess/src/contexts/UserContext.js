import { createContext, useState } from 'react'

export const UserContext = createContext({})

export default function UserContextProvider({ children }){

    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [role, setRole] = useState()

    const contextData = {
        username:username,
        email:email,
        role:role,
        setUsername:setUsername,
        setEmail:setEmail,
        setRole:setRole
    }

    return (
        <UserContext.Provider value={contextData}>
            { children }
        </UserContext.Provider>
    )
}
