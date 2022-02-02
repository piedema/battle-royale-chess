import { useContext, useState, useEffect, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import { GameContext } from '../../contexts/GameContext'

import styles from './GameMenu.module.css'

export default function GameMenu(){

    const history = useHistory()

    const { round, nextRoundAt, finished } = useContext(GameContext)

    const [countdown, setCountdown] = useState('')

    // this useEffect is the timer which shows the time left before the game starts or the board shrinks
    useEffect(() => {

        let countdownInterval

        countdownInterval = setInterval(() => {

            let timeLeft = (nextRoundAt - Date.now()) / 1000                    // get the time left until the next round

            if(timeLeft === 0) timeLeft = Math.abs(timeLeft)                    // after calculating time left the 0 value can be -0, so always transform to positive 0
            if(timeLeft < 0) timeLeft = 0                                       // the timeLeft can be a little bit lower than 0 because of the gamedata api call taking some time. In that case make timeLeft 0 again

            const timeLeftFixed = timeLeft.toFixed(1)                           // we only want 1 decimal and make it a string to split later
            setCountdown(timeLeftFixed)

            if(finished === true) clearInterval(countdownInterval)              // stop the interval when the game is finished

        }, 100)

        return () => clearInterval(countdownInterval)

    }, [round, nextRoundAt, finished])

    function exitGame(){
        history.push('/')                                                       // exit the game. triggered by exit game button
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
                                            <div className={styles.timeBig} style={{ color:`${countdown <= 10 ? 'red' : 'black'}`}}>
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
                                    <div>
                                        <div className={styles.test}>
                                            Round
                                        </div>
                                        <div className={styles.round}>
                                            {round}
                                        </div>
                                    </div>
                                    <div className={styles.countdown}>
                                        <div className={styles.timeBig} style={{ color:`${countdown <= 10 ? 'red' : 'black'}`}}>
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
                </div>
            </div>
            <div className={styles.outer}>
                <div className={styles.inner}>
                    <div className={styles.exitButton} onClick={exitGame} >
                        Leave game
                    </div>
                </div>
            </div>
        </div>
    )

}
