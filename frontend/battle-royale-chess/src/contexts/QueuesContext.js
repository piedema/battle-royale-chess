import { createContext, useState, useEffect, useContext } from 'react'

import { AuthenticationContext } from './AuthenticationContext'
import { UserContext } from './UserContext'

import { getQueue } from '../services/LobbyService'

export const QueuesContext = createContext({})

export default function QueuesContextProvider({ children }){

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

    }, [authState, role])

    async function fetchQueues(){

        if(authState !== 'success') return
        if(role === 'SPECTATOR') return

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
