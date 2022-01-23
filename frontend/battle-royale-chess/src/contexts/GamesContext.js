import { createContext, useState, useEffect } from 'react'

import { getGames } from '../services/GamesService'

export const GamesContext = createContext({})

export default function GamesContextProvider({ children }){

    const [games, setGames] = useState([])

    const contextData = {
        games:games
    }

    useEffect(() => {

        const interval = setInterval(fetchGames, 1000)

        fetchGames()

        return () => clearInterval(interval)

    }, [])

    async function fetchGames(){

        try {

            const result = await getGames()
            setGames(result.data)

        } catch (error) {

            setGames([])

        }

    }

    return (
        <GamesContext.Provider value={contextData}>
            { children }
        </GamesContext.Provider>
    )
}
