import { useContext } from 'react'

import Login from './views/login'
import Lobby from './views/lobby'

import { AuthenticationContext } from './contexts/AuthenticationContext'

import './App.css'

export default function App() {

    const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    <div className="App">

        {
            isAuthenticated === false
            ? <Login />
            : <Lobby />
        }

    </div>
  )
}
