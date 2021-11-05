import { createContext, useState } from 'react'

import { getQueue, placeInQueue, removeFromQueue } from '../services/LobbyService'

export const LobbyContext = createContext({})

export default function LobbyContextProvider({ children }){

    const [queue, setQueue] = useState([])

    const contextData = {
        queue:queue,
        refreshQueue:refreshQueue,
        placeInQueue:add,
        removeFromQueue:remove
    }

    async function refreshQueue(){
        const response = await getQueue()
        if(Array.isArray(response)) setQueue([...response])
    }

    async function add(gametype){
        await placeInQueue(gametype)
    }

    async function remove(){
        await removeFromQueue()
    }

    return (
        <LobbyContext.Provider value={contextData}>
            { children }
        </LobbyContext.Provider>
    )
}
