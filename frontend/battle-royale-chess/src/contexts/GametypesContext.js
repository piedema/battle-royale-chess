import { createContext, useState } from 'react'

import { getGametypes } from '../services/GametypesService'

export const GametypesContext = createContext({})

export default function GametypesContextProvider({ children }){

    const [gametypes, setGametypes] = useState([])

    const contextData = {
        gametypes:gametypes,
        refreshGametypes:refreshGametypes
    }

    async function refreshGametypes(){
        const response = await getGametypes()
        setGametypes(response)
    }

    return (
        <GametypesContext.Provider value={contextData}>
            { children }
        </GametypesContext.Provider>
    )
}
