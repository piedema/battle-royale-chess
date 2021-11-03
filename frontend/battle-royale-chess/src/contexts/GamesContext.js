import { createContext, useState } from 'react'

import { getGames, getGameIdForPlayer, getGamedata } from '../services/GamesService'

export const GamesContext = createContext({})

export default function GamesContextProvider({ children }){

    const [games, setGames] = useState([])
    const [queuedForGame, setQueuedForGame] = useState(undefined)
    const [gameId, setGameId] = useState(undefined)

    const contextData = {
        games:games,
        queuedForGame:queuedForGame,
        setQueuedForGame:setQueuedForGame,
        refreshGames:refreshGames,
        getGameIdForPlayer:getGameIdForPlayer,
        setGameId:setGameId,
        getGamedata:getGamedata
    }

    async function refreshGames(){
        const response = await getGames()
        if(Array.isArray(response)) setGames(response)
    }

    return (
        <GamesContext.Provider value={contextData}>
            { children }
        </GamesContext.Provider>
    )
}
