import { useContext, useState, useEffect } from 'react'

import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'
import { SettingsContext } from '../../contexts/SettingsContext.js'

import Piece from '../piece/Piece'

import colors from '../../assets/js/colors'

import styles from './PlayerInfo.module.css'

export default function PlayerInfo({ playerName }){

    const { username } = useContext(UserContext)
    const { board, players, scores, moves, moveFrom, moveTo } = useContext(GameContext)
    const { piecesStyle } = useContext(SettingsContext)

    const [index, setIndex] = useState(undefined)                               // which number player is this in this game (1, 2, 3 etc)
    const [stroke, setStroke] = useState(undefined)
    const [fill, setFill] = useState(undefined)
    const [score, setScore] = useState(0)
    const [currentMove, setCurrentMove] = useState('-')
    const [previousMove, setPreviousMove] = useState('-')
    const [piecesLeft, setPiecesLeft] = useState([])                            // an array containing the pieces this player has left
    const [color, setColor] = useState({})
    const [position, setPosition] = useState(undefined)                         // position of this playerInfo component on the screen

    // set some states based on which player this is.
    // like color, position of the playerInfo screen
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

    // when the scores update, reflect in setting this players score
    useEffect(() => {

        setScore(scores[index] || 0)

    }, [scores, index])

    // set the current players move which hasnt been performed yet. only visible for the playerInfo of the player that plays in this instance
    useEffect(() => {

        if(moveFrom === undefined) setCurrentMove('-')
        if(moveFrom !== undefined && moveTo === undefined) setCurrentMove(moveFrom)
        if(moveFrom !== undefined && moveTo !== undefined) setCurrentMove(moveFrom + ' > ' + moveTo)

    }, [moveFrom, moveTo])

    // set the previousMove for all players to show them in the playerInfo component.
    useEffect(() => {

        // get the highest round data in the moves object
        // we only want data from the previous round
        const highestRound = Object.keys(moves).sort((a, b) => b - a)[0]

        // return if there is no round played yet
        if(moves[highestRound] === undefined) return
        // return if this person is not a player (for example a spectator)
        if(index === undefined) return

        // get all moves this round
        const movesThisRound = moves[highestRound]
        // filter this players move
        const move = movesThisRound[index]

        // set previous move if player has made a move last round
        if(move !== undefined && move !== null){
            setPreviousMove(move.replace('>', ' > '))
        }

        // otherwist clear prvious row by putting it to a dash
        if(move === undefined || move === null){
            setPreviousMove('-')
        }

    }, [moves, index])

    // get all pieces of this player which still exist
    useEffect(() => {

        const allAlivePiecesOfPlayer = []

        // so loop gameboard
        for(let tile in board){

            // get tilestate to only count pieces which are not on faded tiles
            const tileState = board[tile][0]
            // get playerIndex to only count pieces of this player
            const playerIndex = board[tile][1] - 1
            const piece = board[tile][2]

            if(
                tileState === 'normal' &&
                playerIndex === index &&
                piece !== undefined
            ){

                // add piece to array to show in playerInfo
                allAlivePiecesOfPlayer.push(piece)

            }

        }

        // sort the alive pieces array by their value
        const allAlivePiecesOfPlayerSorted = allAlivePiecesOfPlayer.sort((a, b) => getPieceWorth(b) - getPieceWorth(a))

        setPiecesLeft(allAlivePiecesOfPlayerSorted)

    }, [board, index])

    // get position of playerInfo on the screen by index and amount of players
    // this position is styled in the css
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

    // get value of a piece
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
                            { piecesLeft.map((p, i) => <div key={p+i}><Piece key={p+i} type={p} styling={piecesStyle()} color={color} w={50} h={50} /></div>) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
