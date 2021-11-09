import { useState, useEffect, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { GametypesContext } from '../../contexts/GametypesContext'
import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'

import { getGamedata, getGameIdForPlayer, postNewMove, cancelMove } from '../../services/GamesService'

import Piece from '../../components/piece/Piece'
import GameBoard from '../../components/gameBoard/GameBoard'
import GameMenu from '../../components/gameMenu/GameMenu'
import PlayerInfo from '../../components/playerInfo/PlayerInfo'

import styles from './Game.module.css'

export default function Game() {

    const history = useHistory()

    const { username } = useContext(UserContext)
    const { gametypes } = useContext(GametypesContext)
    const {
        gameId, setGameId,
        gamedata, setGamedata,
        scores, setScores,
        moves, setMoves,
        board, setBoard,
        players, setPlayers,
        round, setRound,
        finished, setFinished,
        nextRoundAt, setNextRoundAt,
        zoomLevel, setZoomLevel,
        moveFrom, setMoveFrom,
        moveTo, setMoveTo,
        alert, setAlert
    } = useContext(GameContext)

    const [gametype, setGametype] = useState({})

    let nextRoundAtInterval

    // get gameId
    useEffect(() => {

        setMoveFrom(undefined)
        setMoveTo(undefined)
        setScores([])
        setMoves({})
        setBoard({})
        setPlayers([])
        setFinished(false)
        setRound(0)
        setNextRoundAt(undefined)
        setGametype(undefined)

        ;(async () => {

            if(gameId === undefined){
                const response = await getGameIdForPlayer(username)

                if(response !== undefined){

                    setGameId(response)

                }

                if(response === undefined) history.push('/') // return to lobby
            }

        })()

    }, [])

    // start gameLoop
    useEffect(() => {
        if(gameId !== undefined) loadGamedata()
    }, [gameId])

    useEffect(() => {

        if(Date.now() > nextRoundAt && finished === false) setTimeout(loadGamedata, 100)
        if(Date.now() < nextRoundAt && finished === false) setTimeout(loadGamedata, (nextRoundAt - Date.now()) + 1000)

    }, [nextRoundAt])

    async function loadGamedata(){

        const gamedata = await getGamedata(gameId)

        if(gamedata !== undefined){

            setMoveFrom(undefined)
            setMoveTo(undefined)
            setGametype(gametypes.find(g => g.gametype === gamedata.gametype))
            setScores(gamedata.scores)
            setMoves(gamedata.moves)
            setBoard(gamedata.board)
            setPlayers(gamedata.players)
            setFinished(gamedata.finished)
            setRound(gamedata.round)
            setNextRoundAt(gamedata.nextRoundAt)

        }

        if(gamedata === undefined) history.push('/')

    }

    function zoomGame(event){

        let scale = zoomLevel
        scale += event.deltaY * -0.001
        scale = Math.min(Math.max(.2, scale), 1.8)

        setZoomLevel(scale)

    }

    async function makeMove(tile){

        const boardState = board[tile][0]
        const indexOfPlayer = players.indexOf(username) + 1
        const playerIndexOnTile = parseFloat(board[tile][1])

        // selected full move, send move to backend
        if(moveFrom !== undefined && tile !== moveFrom && boardState === 'normal'){

            setMoveTo(tile)
            const result = await postNewMove(gameId, moveFrom, moveTo)
            console.log(result)

        }

        if(moveFrom === undefined && boardState === "normal" && indexOfPlayer === playerIndexOnTile) setMoveFrom(tile)

        // cancel planned move
        if(moveFrom === tile){

            setMoveFrom(undefined)
            setMoveTo(undefined)
            cancelMove(gameId, username)

        }

    }

    return (
        <div className="game" onWheel={(event) => { zoomGame(event) }}>
            <div className={styles.gameMenuContainer}>
                <GameMenu />
            </div>
            <div className={styles.boardContainer} style={{ transform: `scale( ${zoomLevel} )` }}>
                <GameBoard makeMove={makeMove} />
            </div>
            <div className={styles.playerInfoContainer}>
                {players.map(p => <PlayerInfo key={p} playerName={p} />)}
            </div>
        </div>
    )
}
