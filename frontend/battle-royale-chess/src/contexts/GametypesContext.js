import { createContext, useState, useEffect, useContext } from 'react'

import { AuthenticationContext } from './AuthenticationContext'

import { getGametypes } from '../services/GametypesService'

export const GametypesContext = createContext({})

export default function GametypesContextProvider({ children }){

    // keep a global collection of the gametypes which are loaded from the server.
    // the view which uses them decides when to update the data by calling fetchGametypes

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

    async function fetchGametypes(){

        try {

            const result = await getGametypes()
            setGametypes(result.data)

        } catch (error) {

            setGametypes([])

        }

    }

    // get a certain gametype from the collection of gametypes
    function getGametypeByName(name){

        return gametypes.find(g => g.gametype === name)

    }

    return (
        <GametypesContext.Provider value={contextData}>
            { children }
        </GametypesContext.Provider>
    )
}
