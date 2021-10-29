import { createContext, useState } from 'react'

import { getGames, getGameIdForPlayer, getGamedata } from '../services/GamesService'

export const GamesContext = createContext({})

export default function GamesContextProvider({ children }){

    const [games, setGames] = useState([])
    const [isPlayerQueued, setIsPlayerQueued] = useState(false)
    const [gameId, setGameId] = useState(undefined)

    const contextData = {
        games:games,
        isPlayerQueued:isPlayerQueued,
        setIsPlayerQueued:setIsPlayerQueued,
        refreshGames:refreshGames,
        getGameIdForPlayer:getGameIdForPlayer,
        setGameId:setGameId,
        getGamedata:getGamedata
    }

    async function refreshGames(){
        const response = await getGames()
        setGames(response)
    }

    return (
        <GamesContext.Provider value={contextData}>
            { children }
        </GamesContext.Provider>
    )
}
