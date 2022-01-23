import { createContext, useState } from 'react'

export const SettingsContext = createContext({})

export default function SettingsContextProvider({ children }){

    if(!getLanguage()) setLanguage('EN')
    if(!getDateFormat()) setDateFormat('DD-MM-YYYY HH:mm')
    if(!getBoardView()) setBoardView('3d')
    if(!getPiecesStyle()) setPiecesStyle('filled')

    const contextData = {
        language:getLanguage,
        setLanguage,
        dateFormat:getDateFormat,
        setDateFormat,
        boardView:getBoardView,
        setBoardView,
        piecesStyle:getPiecesStyle,
        setPiecesStyle
    }

    function getLanguage(){

        return localStorage.getItem('language')

    }

    function setLanguage(value){

        localStorage.setItem('language', value)

    }

    function getDateFormat(){

        return localStorage.getItem('dateFormat')

    }

    function setDateFormat(value){

        localStorage.setItem('dateFormat', value)

    }

    function getBoardView(){

        return localStorage.getItem('boardView')

    }

    function setBoardView(value){

        localStorage.setItem('boardView', value)

    }

    function getPiecesStyle(){

        return localStorage.getItem('piecesStyle')

    }

    function setPiecesStyle(value){

        return localStorage.setItem('piecesStyle', value)

    }

    return (
        <SettingsContext.Provider value={contextData}>
            { children }
        </SettingsContext.Provider>
    )
}
