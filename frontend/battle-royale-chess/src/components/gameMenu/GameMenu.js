import { useContext, useState, useEffect, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import { GameContext } from '../../contexts/GameContext'

import styles from './GameMenu.module.css'

export default function GameMenu(){

    const history = useHistory()

    const { round, nextRoundAt, finished } = useContext(GameContext)
    const roundRef = useRef(round)
    const nextRoundAtRef = useRef(nextRoundAt)
    const finishedRef = useRef(finished)
    
    roundRef.current = round
    nextRoundAtRef.current = nextRoundAt
    finishedRef.current = finished

    const [countdownMessage, setCountdownMessage] = useState('')

    useEffect(() => {

        const countdownInterval = setInterval(() => {

            let message

            let timeLeft = (nextRoundAtRef.current - Date.now()) / 1000

            if(timeLeft === 0) timeLeft = Math.abs(timeLeft)
            if(timeLeft < 0) timeLeft = 0

            const timeLeftFixed = timeLeft.toFixed(1)

            if(roundRef.current === 0) message = `Game will start in ${timeLeftFixed} seconds!`
            if(roundRef.current > 0 && finishedRef.current === false) message = `Round ${roundRef.current} will end in ${timeLeftFixed} seconds!`
            if(finishedRef.current === true) message = `Game is finished. Click exit to play a new game!`

            setCountdownMessage(message)

        }, 50)

        return () => clearInterval(countdownInterval)

    }, [])

    function exitGame(){
        history.push('/')
    }

    return (
        <div className={styles.container}>
            <div className={styles.outer}>
                <div className={styles.inner}>
                    <div className={styles.countdownContainer}>
                        { countdownMessage }
                    </div>
                    <div className={styles.exitButton} onClick={exitGame} >
                        Exit this game
                    </div>
                </div>
            </div>
        </div>
    )

}
