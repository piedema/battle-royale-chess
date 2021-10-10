import { createContext, useState, useContext } from 'react'

import axios from 'axios'

import { ServerContext } from './ServerContext'

export const UserContext = createContext({})

export default function UserContextProvider({ children }){

    const { serverAddress } = useContext(ServerContext)

    const [id, setId] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const [role, setRole] = useState('spectator')

    const contextData = {
        id:setId,
        username:username,
        role:role,
        setRole:setRole,
        getUserData:getUserData
    }

    async function getUserData(userId){

        // fetch userdata from backend
        const options = {
            url:serverAddress + '/s/userdata/' + userId,
            method:'GET'
        }

        try {

            // make api call
            const res = await axios(options)

            // put userdata in UserContext
            const { id, role, username } = res.data

            setId(id)
            setUsername(username)
            setRole(role)

        } catch (error) {

            alert(error)

        }

    }

    return (
        <UserContext.Provider value={contextData}>
            { children }
        </UserContext.Provider>
    )
}
