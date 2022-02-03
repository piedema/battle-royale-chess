import { createContext, useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { getGames } from '../services/GamesService'

import { AuthenticationContext } from './AuthenticationContext'
import { UserContext } from './UserContext'

export const GamesContext = createContext({})

export default function GamesContextProvider({ children }){

    // keep a global collection of the games which are loaded from the server.
    // the view which uses them decides when to update the data by calling fetchGames

    const { authState } = useContext(AuthenticationContext)
    const { role } = useContext(UserContext)

    const [games, setGames] = useState(undefined)

    const contextData = {
        games,
        fetchGames
    }

    useEffect(() => {

        if(authState !== 'success') return

        fetchGames()

    }, [authState])

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
