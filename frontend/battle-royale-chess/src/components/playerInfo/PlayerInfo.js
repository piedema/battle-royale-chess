import { useContext, useState, useEffect } from 'react'

import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'

import Piece from '../piece/Piece'

import colors from '../../assets/js/colors'

import styles from './PlayerInfo.module.css'

export default function PlayerInfo({ playerName }){

    const { username } = useContext(UserContext)
    const { board, players, scores, moves, moveFrom, moveTo } = useContext(GameContext)

    const [index, setIndex] = useState(undefined)
    const [stroke, setStroke] = useState(undefined)
    const [fill, setFill] = useState(undefined)
    const [score, setScore] = useState(0)
    const [currentMove, setCurrentMove] = useState('-')
    const [previousMove, setPreviousMove] = useState('-')
    const [piecesLeft, setPiecesLeft] = useState([])
    const [color, setColor] = useState({})
    const [position, setPosition] = useState(undefined)

    const piecesStyle = localStorage.getItem('piecesStyle') || 'outlined'

    useEffect(() => {

        const index = players.indexOf(playerName)
        const { stroke, fill } = colors.pieces(index)
        const position = getPosition(players.length, index)
        const color = colors.pieces(index)

        setIndex(index)
        setStroke(stroke)
        setFill(fill)
        setColor(color)
        setPosition(position)

    }, [players, playerName])

    useEffect(() => {

        setScore(scores[index] || 0)

    }, [scores, index])

    useEffect(() => {

        if(moveFrom === undefined) setCurrentMove('-')
        if(moveFrom !== undefined && moveTo === undefined) setCurrentMove(moveFrom)
        if(moveFrom !== undefined && moveTo !== undefined) setCurrentMove(moveFrom + ' > ' + moveTo)

    }, [moveFrom, moveTo])

    useEffect(() => {

        const highestRound = Object.keys(moves).sort((a, b) => b - a)[0]

        if(moves[highestRound] === undefined) return
        if(index === undefined) return

        const movesThisRound = moves[highestRound]
        const move = movesThisRound[index]

        if(move !== undefined && move !== null){
            setPreviousMove(move.replace('>', ' > '))
        }

        if(move === undefined || move === null){
            setPreviousMove('-')
        }

    }, [moves, index])

    useEffect(() => {

        const allAlivePiecesOfPlayer = []

        for(let tile in board){

            const tileState = board[tile][0]
            const playerIndex = board[tile][1] - 1
            const piece = board[tile][2]

            if(
                tileState === 'normal' &&
                playerIndex === index &&
                piece !== undefined
            ){

                allAlivePiecesOfPlayer.push(piece)

            }

        }

        const allAlivePiecesOfPlayerSorted = allAlivePiecesOfPlayer.sort((a, b) => getPieceWorth(b) - getPieceWorth(a))

        setPiecesLeft(allAlivePiecesOfPlayerSorted)

    }, [board, index])

    function getPosition(numberOfPlayers, index){

        switch (numberOfPlayers) {
            case 2: return ['s3', 's4'][index]
            case 3: return ['s0', 's1', 's2'][index]
            case 4: return ['s0', 's1', 's2', 's5'][index]
            case 5: return ['s0', 's1', 's3', 's2', 's5'][index]
            case 6: return ['s0', 's1', 's3', 's4', 's2', 's5'][index]
            case 7: return ['s0', 's1', 's3', 's4', 's2', 's6', 's5'][index]
            case 8: return ['s0', 's1', 's3', 's4', 's2', 's7', 's8', 's5'][index]
            default: return undefined
            }

    }

    function getPieceWorth(piece){

        switch (piece){
            case "King": return 18
            case "Queen": return 9
            case "Tower": return 5
            case "Bishop": return 3
            case "Knight": return 2
            case "Pawn": return 1
            default: return 0
        }

    }

    return (
        <div className={styles[position]}>
            <div className={styles.outer} style={{ background:fill }}>
                <div className={styles.inner}>
                    <div className={styles.playerName} style={{ color:stroke }}>
                        {playerName}
                    </div>
                    <div className={styles.subjectContainer}>
                        <div className={styles.subject} style={{ color:stroke }}>
                            Score
                        </div>
                        <div className={styles.value}>
                            {score}
                        </div>
                    </div>
                    {
                        playerName === username
                        ? (<div className={styles.subjectContainer}>
                                <div className={styles.subject} style={{ color:stroke }}>
                                    Current move
                                </div>
                                <div className={styles.value}>
                                    {currentMove}
                                </div>
                            </div>)
                        : null
                    }
                    <div className={styles.subjectContainer}>
                        <div className={styles.subject} style={{ color:stroke }}>
                            Previous move
                        </div>
                        <div className={styles.value}>
                            {previousMove}
                        </div>
                    </div>
                    <div className={styles.subjectContainer} style={{ display:"flex", justifyContent:"center"}}>
                        <div className={styles.piecesContainer}>
                            { piecesLeft.map((p, i) => <div key={p+i}><Piece key={p+i} type={p} styling={piecesStyle} color={color} w={50} h={50} /></div>) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
