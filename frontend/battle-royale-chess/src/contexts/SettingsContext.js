import { createContext, useState } from 'react'

export const SettingsContext = createContext({})

export default function SettingsContextProvider({ children }){

    const [language, setLanguage] = useState(localStorage.getItem('language') || 'EN')
    const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD-MM-YYYY HH:mm')
    const [boardView, setBoardView] = useState(localStorage.getItem('boardView') || '3d')
    const [piecesStyle, setPiecesStyle] = useState(localStorage.getItem('piecesStyle') || 'outlined')

    const contextData = {
        language,
        dateFormat,
        boardView,
        piecesStyle
    }

    return (
        <SettingsContext.Provider value={contextData}>
            { children }
        </SettingsContext.Provider>
    )
}
