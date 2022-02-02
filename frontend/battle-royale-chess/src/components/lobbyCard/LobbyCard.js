import { useState, useContext, useEffect } from 'react'

import stringtime from 'stringtime'                                             // my own module. used to turn milliseconds into a string with the time in seconds, minutes, hours etc

import Piece from '../piece/Piece'
import BasicContainer from '../basicContainer/BasicContainer'

import { UserContext } from '../../contexts/UserContext'

import styles from './LobbyCard.module.css'
import colors from '../../assets/js/colors'

export default function LobbyCard({ enterQueue, leaveQueue, queue, gametype }){

    const { username } = useContext(UserContext)

    // for toggling clicking behaviour of the lobby card
    const [inQueueFor, setInQueueFor] = useState(undefined)

    const { gametype: name, numberOfPlayers, initialDelay, timePerRound, circleShrinkOffset, circleShrinkAfterNRounds, board } = gametype

    // calculate the maximum shrinks of the board. done by getting the halve of the lowest rows or columns. halve because the baord shrinks on both sides
    // first make array of all rows numbers. get the highest number to get amount of rows. divide by 2. because of uneven number of rows use Math.floor to get amount of shrinks
    // do the same for the columns. then math.max those 2 results to get the highest number of shrinks.
    const maxAmountOfShrinks = Math.max(Math.floor(Math.max(...Object.keys(board).map(m => parseFloat(m.split(':')[0]))) / 2), Math.floor(Math.max(...Object.keys(board).map(m => parseFloat(m.split(':')[1]))) / 2))
    // calculate the initial delay + the amount of rounds where there will be no shrink * time per round + rounds per shrink * time per round * maximum number of shrinks. total * 1000 to get milliseconds
    const maxGameLength = stringtime.toString((initialDelay + (circleShrinkOffset * timePerRound) + (circleShrinkAfterNRounds * timePerRound * maxAmountOfShrinks)) * 1000)
    // get an array with all players in this particular queue (queue contains players for all gametypes)
    const playersInThisQueue = queue.filter((qp, i) => qp.gametype === name ).map(p => p.username )
    // color the card by number of players which are needed to play it
    const { stroke, fill } = colors.pieces(numberOfPlayers - 1)

    // combine the styles of the front card
    const frontStyle = {
        subCardStyle:styles.subCardStyle,
        front:styles.front,
        queued: inQueueFor ? styles.inQueueFront : styles.notInQueueFront,
        outer:styles.outer
    }

    // combine the styles of the back card
    const backStyle = {
        subCardStyle:styles.subCardStyle,
        back:styles.back,
        queued: inQueueFor ? styles.inQueueBack : styles.notInQueueBack
    }

    // important. this makes clicking the lobbycard a toggle to enter or leave the queue
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
