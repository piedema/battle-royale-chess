import { useState } from 'react'

import Piece from '../piece/Piece'

import styles from './Card.module.css'
import colors from '../../assets/js/colors'

export default function Card({ gametypeInfo, queue, username, placeInQueue, removeFromQueue }){

    const [pieceColors] = useState(colors.pieces(0))

    if(gametypeInfo === undefined || queue === undefined || username === undefined) return (<></>)

    const name = gametypeInfo.gametype
    const numberOfPlayers = gametypeInfo.numberOfPlayers

    let amIInQueue = queue.filter(q => q.gametype === name).find(q => q.username === username)
    let playersInThisQueue = queue.filter(q => q.gametype === name).map(p => p.username)

    const cardStyle = { card:styles.card }

    const frontStyle = {
        subCardStyle:styles.subCardStyle,
        front:styles.front,
        queued: amIInQueue ? styles.inQueueFront : styles.notInQueueFront
    }

    const backStyle = {
        subCardStyle:styles.subCardStyle,
        back:styles.back,
        queued: amIInQueue ? styles.inQueueBack : styles.notInQueueBack
    }


    return (
        <div
            className={styles.container}
            onClick={
                () => {
                    amIInQueue
                    ? removeFromQueue()
                    : placeInQueue(name)
                }
            }>
            <div className={Object.values(cardStyle).join(" ")}>
                <div className={Object.values(frontStyle).join(" ")}>
                    <div className={styles.outerContainer}>
                        <div className={styles.innerContainer}>
                            <div className={`${styles.title} ${styles.contentContainer}`}>
                                {name}
                            </div>
                            <div className={`${styles.content} ${styles.contentContainer}`}>
                                Number of players: {numberOfPlayers} <br />
                                Players in this queue: {playersInThisQueue.join(", ")} <br />
                                Players needed: {numberOfPlayers - playersInThisQueue.length} <br />
                            </div>
                            {
                                amIInQueue
                                ? <div className={`${styles.amIInQueue} ${styles.contentContainer}`}>You are queued for this game</div>
                                : null
                            }
                            <div className={styles.decoration}>
                                <Piece type="King" styling="outlined" color={pieceColors} w={240} h={300} vB={"3 5 20 20"} />
                                <Piece type="Tower" styling="outlined" color={pieceColors} w={240} h={300} vB={"207 20 40 40"} />
                                <Piece type="Pawn" styling="outlined" color={pieceColors} w={240} h={300} vB={"197 30 80 80"} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Object.values(backStyle).join(" ")}>
                    {
                        amIInQueue
                        ? "Click to leave queue"
                        : "Click to join the queue and play this mode!"
                    }
                </div>
            </div>
        </div>
    )
}
