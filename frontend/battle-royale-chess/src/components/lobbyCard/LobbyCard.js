import { useState, useContext, useEffect } from 'react'

import stringtime from 'stringtime'

import Piece from '../piece/Piece'
import BasicContainer from '../basicContainer/BasicContainer'

import { UserContext } from '../../contexts/UserContext'

import styles from './LobbyCard.module.css'
import colors from '../../assets/js/colors'

export default function LobbyCard({ enterQueue, leaveQueue, queue, gametype }){

    const { username } = useContext(UserContext)

    const [inQueueFor, setInQueueFor] = useState(undefined)

    const { gametype: name, numberOfPlayers, initialDelay, timePerRound, circleShrinkOffset, circleShrinkAfterNRounds, board } = gametype

    const maxAmountOfShrinks = Math.max(Math.floor(Math.max(...Object.keys(board).map(m => parseFloat(m.split(':')[0]))) / 2), Math.floor(Math.max(...Object.keys(board).map(m => parseFloat(m.split(':')[1]))) / 2))
    const maxGameLength = stringtime.toString((initialDelay + (circleShrinkOffset * timePerRound) + (circleShrinkAfterNRounds * timePerRound * maxAmountOfShrinks)) * 1000)
    const playersInThisQueue = queue.filter((qp, i) => qp.gametype === name ).map(p => p.username )
    const { stroke, fill } = colors.pieces(numberOfPlayers - 1)

    const frontStyle = {
        subCardStyle:styles.subCardStyle,
        front:styles.front,
        queued: inQueueFor ? styles.inQueueFront : styles.notInQueueFront,
        outer:styles.outer
    }

    const backStyle = {
        subCardStyle:styles.subCardStyle,
        back:styles.back,
        queued: inQueueFor ? styles.inQueueBack : styles.notInQueueBack
    }

    useEffect(() => {

        setInQueueFor(queue.find(qp => qp.username === username && qp.gametype === name))

    }, [queue])

    return (
        <div
            className={styles.container}
            onClick={
                () => {
                    inQueueFor
                    ? leaveQueue()
                    : enterQueue(name)
                }}>
                <div className={styles.card}>
            <div className={Object.values(frontStyle).join(" ")} style={{ background:fill }}>
                <div className={styles.inner}>
                    <div className={styles.playerName} style={{ color:stroke }}>
                        {name}
                    </div>
                    <div className={styles.subjectContainers}>
                        <div className={styles.subjectContainer}>
                            <div className={styles.subject} style={{ color:stroke }}>
                                Max game length
                            </div>
                            <div className={styles.value}>
                                {maxGameLength}
                            </div>
                        </div>
                        <div className={styles.subjectContainer}>
                            <div className={styles.subject} style={{ color:stroke }}>
                                Total players
                            </div>
                            <div className={styles.value}>
                                {numberOfPlayers}
                            </div>
                        </div>
                        <div className={styles.subjectContainer}>
                            <div className={styles.subject} style={{ color:stroke }}>
                                Players in queue
                            </div>
                            <div className={styles.value}>
                                {playersInThisQueue.length}
                            </div>
                        </div>
                        <div className={styles.subjectContainer}>
                            <div className={styles.value} style={{ textAlign: "center", width:"100%" }}>
                                { playersInThisQueue.length > 0 ? playersInThisQueue.join(', ') : '-' }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Object.values(backStyle).join(" ")}>
                {
                    inQueueFor
                    ? "Click to leave queue"
                    : "Click to join the queue and play this mode!"
                }
            </div>
            </div>
        </div>
    )

}
