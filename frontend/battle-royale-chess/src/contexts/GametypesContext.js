import { createContext, useState, useEffect, useContext } from 'react'

import { AuthenticationContext } from './AuthenticationContext'

import { getGametypes } from '../services/GametypesService'

export const GametypesContext = createContext({})

export default function GametypesContextProvider({ children }){

    const { authState } = useContext(AuthenticationContext)

    const [gametypes, setGametypes] = useState(undefined)

    const contextData = {
        gametypes,
        getGametypeByName,
        fetchGametypes
    }

    useEffect(() => {

        if(authState !== 'success') return

        fetchGametypes()

    }, [authState])

    function getGametypeByName(name){

        return gametypes.find(g => g.gametype === name)

    }

    async function fetchGametypes(){

        try {

            const result = await getGametypes()
            setGametypes(result.data)

        } catch (error) {

            setGametypes([])

        }

    }

    return (
        <GametypesContext.Provider value={contextData}>
            { children }
        </GametypesContext.Provider>
    )
}
