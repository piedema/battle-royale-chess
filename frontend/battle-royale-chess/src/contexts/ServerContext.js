import { createContext, useState } from 'react'

export const ServerContext = createContext({})

export default function ServerContextProvider({ children }){

    const [serverAddress, setServerAddress] = useState('http://localhost:8080')

    const contextData = {
        serverAddress:serverAddress
    }

    return (
        <ServerContext.Provider value={contextData}>
            { children }
        </ServerContext.Provider>
    )
}
