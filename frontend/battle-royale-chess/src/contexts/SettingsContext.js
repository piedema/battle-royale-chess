import { createContext, useState } from 'react'

export const SettingsContext = createContext({})

export default function SettingsContextProvider({ children }){

    const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD-MM-YYYY HH:mm')

    const contextData = {
        dateFormat:dateFormat,
    }

    return (
        <SettingsContext.Provider value={contextData}>
            { children }
        </SettingsContext.Provider>
    )
}
