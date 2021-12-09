import { createContext, useState, useEffect } from 'react'

import { getGametypes } from '../services/GametypesService'

export const GametypesContext = createContext({})

export default function GametypesContextProvider({ children }){

    const [gametypes, setGametypes] = useState([])

    const contextData = {
        gametypes:gametypes,
        getGametypeByName:getGametypeByName
    }

    useEffect(async () => {

        try {

            const result = await getGametypes()
            setGametypes(result.data)

        } catch (error) {

            setGametypes([])

        }

    }, [])

    function getGametypeByName(name){

        return gametypes.find(g => g.gametype === name)

    }

    return (
        <GametypesContext.Provider value={contextData}>
            { children }
        </GametypesContext.Provider>
    )
}
