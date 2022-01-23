import { createContext, useState, useEffect } from 'react'

import { getQueue } from '../services/LobbyService'

export const QueuesContext = createContext({})

export default function QueuesContextProvider({ children }){

    const [queues, setQueues] = useState([])

    const contextData = {
        queues:queues
    }

    useEffect(() => {

        const interval = setInterval(fetchQueues, 1000)

        fetchQueues()

        return () => clearInterval(interval)

    }, [])

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
