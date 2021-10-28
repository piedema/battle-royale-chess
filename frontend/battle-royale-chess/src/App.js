import { useContext } from 'react'

import Login from './views/login/Login'
import Lobby from './views/lobby/Lobby'

import { AuthenticationContext } from './contexts/AuthenticationContext'
//import { UserContext } from './contexts/UserContext'

import './App.css'

export default function App() {

    const { authState } = useContext(AuthenticationContext)
    //const { loadUserdata } = useContext(UserContext)

    // const jwt = Cookies.get('jwt')
    //
    // if(isAuthenticated === false && jwt !== undefined) loadData()
    //
    // async function loadData(){
    //
    //     try {
    //
    //         await loadUserdata()
    //         setIsAuthenticated(true)
    //
    //     } catch (error) {
    //         //alert(error.response || error)
    //         //setIsAuthenticated(false)
    //     }
    //
    // }

    return (
        <div className="App">

            {
                authState === "success"
                ? <Lobby />
                : <Login />
            }

        </div>
    )
}
