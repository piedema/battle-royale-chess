import { createContext, useState } from 'react'

export const AuthenticationContext = createContext({})

export default function AuthenticationContextProvider({ children }){

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const contextData = {
        isAuthenticated:isAuthenticated,
        setIsAuthenticated:setIsAuthenticated
    }

    return (
        <AuthenticationContext.Provider value={contextData}>
            { children }
        </AuthenticationContext.Provider>
    )
}
