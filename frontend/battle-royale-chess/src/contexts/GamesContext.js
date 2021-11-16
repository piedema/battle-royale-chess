import { createContext, useState } from 'react'

import { getGames } from '../services/GamesService'

export const GamesContext = createContext({})

export default function GamesContextProvider({ children }){

    const [games, setGames] = useState([])

    const contextData = {
        games:games,
        refreshGames:refreshGames
    }

    async function refreshGames(){

        const response = await getGames()
        if(Array.isArray(response)) setGames(response)
        else setGames([])

    }

    return (
        <GamesContext.Provider value={contextData}>
            { children }
        </GamesContext.Provider>
    )
}
