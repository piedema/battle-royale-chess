import { useContext } from 'react'

import { NavLink } from 'react-router-dom'

import BasicContainer from '../basicContainer/BasicContainer'

import { AuthenticationContext } from '../../contexts/AuthenticationContext'

import styles from './Menu.module.css'

export default function Menu(){

    const { logout } = useContext(AuthenticationContext)

    const basicContainerOuterStyle = { width:"100%", height:"60px", userSelect:"none", boxSizing:"border-box" }
    const basicContainerInnerStyle = { fontSize:"20px", display:"flex", justifyContent:"center", alignItems:"center", boxSizing:"border-box" }
    const buttonStyle = { padding:"12px 30px", margin:"0px 10px 0px 10px", outline:"none", border:"0px", borderRadius:"4px", backgroundColor:"lightblue", cursor:"pointer" }

    return (
        <div className={styles.menu}>
            <BasicContainer outerStyle={basicContainerOuterStyle} innerStyle={Object.assign({ color:"blue" }, basicContainerInnerStyle)}>
                <NavLink to="/" style={buttonStyle}>Lobby</NavLink>
                <NavLink to="/games" style={buttonStyle}>Games</NavLink>
                <NavLink to="/highscores" style={buttonStyle}>Highscores</NavLink>
                <NavLink to="/settings" style={buttonStyle}>Settings</NavLink>
                <NavLink to="/rules" style={buttonStyle}>Rules</NavLink>
                <button onClick={logout} style={Object.assign({ backgroundColor:"red" }, buttonStyle)}>Logout</button>
            </BasicContainer>
        </div>
    )
}
