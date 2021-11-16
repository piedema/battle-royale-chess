import { useContext, useState, useEffect, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import { GameContext } from '../../contexts/GameContext'

import styles from './GameMenu.module.css'

export default function GameMenu(){

    const history = useHistory()

    const { round, nextRoundAt, finished } = useContext(GameContext)

    const [countdown, setCountdown] = useState('')

    useEffect(() => {

        let countdownInterval

        countdownInterval = setInterval(() => {

            let timeLeft = (nextRoundAt - Date.now()) / 1000

            if(timeLeft === 0) timeLeft = Math.abs(timeLeft)
            if(timeLeft < 0) timeLeft = 0

            const timeLeftFixed = timeLeft.toFixed(1)
            setCountdown(timeLeftFixed)

            if(finished === true) clearInterval(countdownInterval)

        }, 100)

        return () => clearInterval(countdownInterval)

    }, [round, nextRoundAt, finished])

    function exitGame(){
        history.push('/')
    }

    return (
        <div className={styles.container}>
            <div className={styles.outer}>
                <div className={styles.inner}>
                    <div className={styles.countdownContainer}>
                        {
                            finished === false && round === 0
                            ? (
                                <div>
                                    Game will start in
                                        <div className={styles.countdown}>
                                            <div className={styles.timeBig}>
                                                {countdown.split('.')[0]}
                                            </div>
                                            <div className={styles.timeSmall}>
                                                {countdown.split('.')[1]}
                                            </div>
                                        </div>
                                        seconds!
                                </div>
                            )
                            : finished === false && round > 0
                            ? (
                                <div>
                                    Round
                                    <div className={styles.round}>
                                        {round}
                                    </div>
                                    will end in
                                    <div className={styles.countdown}>
                                        <div className={styles.timeBig}>
                                            {countdown.split('.')[0]}
                                        </div>
                                        <div className={styles.timeSmall}>
                                            {countdown.split('.')[1]}
                                        </div>
                                    </div>
                                    seconds!
                                </div>
                            )
                            : (
                                <div>
                                    Game is finished. Click exit to play a new game!
                                </div>
                            )
                        }
                    </div>
                    <div className={styles.exitButton} onClick={exitGame} >
                        Leave game
                    </div>
                </div>
            </div>
        </div>
    )

}
