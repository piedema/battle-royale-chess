import { useContext, useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { GameContext } from '../../contexts/GameContext'

export default function GameMenu(){

    const history = useHistory()

    const { round, nextRoundAt, finished } = useContext(UserContext)

    const [countdown, setCountdown] = useState(0)

    useEffect(() => {

        let countdownMessage, timeUntilNextRound

        timeUntilNextRound = Math.floor((nextRoundAt - Date.now()) / 1000)

        if(timeUntilNextRound < 0) timeUntilNextRound = 0

        if(round === 0) countdownMessage = `Game will start in ${timeUntilNextRound} seconds!`
        if(round > 0 && finished === false) countdownMessage = `Round ${round} will end in ${timeUntilNextRound} seconds!`
        if(finished === true) `Game is finished. Click exit to play a new game!`

        setCountdown(timeUntilNextRound)

    }, [round, nextRoundAt])

    function exitGame(){
        history.push('/')
    }

    return (
        <div className={styles.outer}>
            <div className={styles.inner}>
                <div className={styles.countdownContainer}>

                </div>
                <div className={styles.exitButton} onClick={exitGame} >
                    Exit this game
                </div>
            </div>
        </div>
    )

}
