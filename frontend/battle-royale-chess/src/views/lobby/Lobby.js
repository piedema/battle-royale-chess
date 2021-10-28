import { useEffect, useContext } from 'react'

import BasicContainer from '../../components/basicContainer/BasicContainer'

import { UserContext } from '../../contexts/UserContext'

import styles from './Lobby.module.css'

export default function Lobby() {

    const { email } = useContext(UserContext)

    const basicContainerOuterStyle = { width:"260px", height:"120px", display:"inline-block", userSelect:"none", cursor:"pointer" }
    const basicContainerInnerStyle = { fontWeight:"900", fontSize:"30px", display:"flex", justifyContent:"center", alignItems:"center" }

    useEffect(() => {
        console.log("email/UserContext vanuit Lobby.js useEffect", email)
    }, [email])

    return (
        <div className="lobby">
            <div>
                <BasicContainer outerStyle={basicContainerOuterStyle} innerStyle={Object.assign({ color:"blue" }, basicContainerInnerStyle)}>
                    Players
                </BasicContainer>
                <BasicContainer outerStyle={basicContainerOuterStyle} innerStyle={Object.assign({ color:"gold" }, basicContainerInnerStyle)}>
                    Highscores
                </BasicContainer>
                <BasicContainer outerStyle={basicContainerOuterStyle} innerStyle={Object.assign({ color:"grey" }, basicContainerInnerStyle)}>
                    Settings
                </BasicContainer>
                <BasicContainer outerStyle={basicContainerOuterStyle} innerStyle={Object.assign({ color:"brown" }, basicContainerInnerStyle)}>
                    Rules
                </BasicContainer>
            </div>
        </div>
    )
}
