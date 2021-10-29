import { createContext, useState } from 'react'

import { getQueue, addToQueue } from '../services/LobbyService'

export const LobbyContext = createContext({})

export default function LobbyContextProvider({ children }){

    const [queue, setQueue] = useState([])

    const contextData = {
        queue:queue,
        refreshQueue:refreshQueue,
        addToQueue:add
    }

    async function refreshQueue(){
        const response = await getQueue()
        setQueue([...response])
    }

    async function add(gametype){
        await addToQueue(gametype)
    }

    return (
        <LobbyContext.Provider value={contextData}>
            { children }
        </LobbyContext.Provider>
    )
}
