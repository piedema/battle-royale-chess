import { useContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from './views/login/Login'
import Lobby from './views/lobby/Lobby'
import Games from './views/games/Games'
import Settings from './views/settings/Settings'
import Rules from './views/rules/Rules'
import Game from './views/game/Game'
import Users from './views/users/Users'
import Gametypes from './views/gametypes/Gametypes'
import Players from './views/players/Players'

import { AuthenticationContext } from './contexts/AuthenticationContext'

import styles from './App.module.css'

export default function App() {

    const { authState } = useContext(AuthenticationContext)

    return (
        <div className={styles.app}>
            {
                authState === "success"
                ?   <Router>
                        <Switch>
                            <Route exact path="/">
                                <Lobby />
                            </Route>
                            <Route path="/games">
                                <Games />
                            </Route>
                            <Route path="/settings">
                                <Settings />
                            </Route>
                            <Route path="/rules">
                                <Rules />
                            </Route>
                            <Route path="/game">
                                <Game />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/gametypes">
                                <Gametypes />
                            </Route>
                            <Route path="/players">
                                <Players />
                            </Route>
                        </Switch>
                    </Router>
                : <Login />
            }
        </div>
    )
}
