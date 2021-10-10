import { createContext, useState } from 'react'

export const ServerContext = createContext({})

export default function ServerContextProvider({ children }){

    const [serverAddress, setServerAddress] = useState('http://h2886030.stratoserver.net:45458')

    const contextData = {
        serverAddress:serverAddress
    }

    return (
        <ServerContext.Provider value={contextData}>
            { children }
        </ServerContext.Provider>
    )
}
