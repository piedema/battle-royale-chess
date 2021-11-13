import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import GamesContextProvider from './contexts/GamesContext'
import GametypesContextProvider from './contexts/GametypesContext'
import AuthenticationContextProvider from './contexts/AuthenticationContext'
import UserContextProvider from './contexts/UserContext'
import GameContextProvider from './contexts/GameContext'
import SettingsContextProvider from './contexts/SettingsContext'

import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
            <AuthenticationContextProvider>
                <SettingsContextProvider>
                    <GamesContextProvider>
                        <GametypesContextProvider>
                            <GameContextProvider>
                                <App />
                            </GameContextProvider>
                        </GametypesContextProvider>
                    </GamesContextProvider>
                </SettingsContextProvider>
            </AuthenticationContextProvider>
        </UserContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
