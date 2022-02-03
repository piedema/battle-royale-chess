import { createContext, useState, useEffect, useContext } from 'react'

import { AuthenticationContext } from './AuthenticationContext'
import { UserContext } from './UserContext'

import { getQueue } from '../services/LobbyService'

export const QueuesContext = createContext({})

export default function QueuesContextProvider({ children }){

    // keep a global collection of the queues which are loaded from the server.
    // the view which uses them decides when to update the data by calling fetchQueues
    // the spectator role does not need queue info

    const { authState } = useContext(AuthenticationContext)
    const { role } = useContext(UserContext)

    const [queues, setQueues] = useState(undefined)

    const contextData = {
        queues,
        fetchQueues
    }

    useEffect(() => {

        if(authState !== 'success') return
        if(role === 'SPECTATOR') return

        fetchQueues()

    }, [authState])

    async function fetchQueues(){

        try {

            const result = await getQueue()
            setQueues(result.data)

        } catch (error) {

            setQueues([])

        }

    }

    return (
        <QueuesContext.Provider value={contextData}>
            { children }
        </QueuesContext.Provider>
    )
}
