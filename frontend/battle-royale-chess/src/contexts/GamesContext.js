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
        loadGames:loadGames,
        getGameIdForPlayer:getGameIdForPlayer,
        setGameId:setGameId,
        getGamedata:getGamedata
    }

    async function loadGames(type = 'finished'){
        const response = await getGames()
        if(Array.isArray(response)){
            setGames(
                response.filter(g => (type === 'finished' && g.finished === true) || (type === 'active' && g.finished === false))
            )
        }
    }

    return (
        <GamesContext.Provider value={contextData}>
            { children }
        </GamesContext.Provider>
    )
}
