import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { GametypesContext } from '../../contexts/GametypesContext'
import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'

import { getGamedata, postNewMove, cancelMove } from '../../services/GamesService'

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
        setScores,
        setMoves,
        board, setBoard,
        players, setPlayers,
        round, setRound,
        finished, setFinished,
        nextRoundAt, setNextRoundAt,
        zoomLevel, setZoomLevel,
        moveFrom, setMoveFrom,
        moveTo, setMoveTo,
        gametype, setGametype,
        gameStartedAt, setGameStartedAt,
        gameEndedAt, setGameEndedAt,
        resetGameContext
    } = useContext(GameContext)

    let loadDataTimeout

    // get gameId
    useEffect(() => {

        // if(gameId === undefined) history.push('/')

        if(gameId !== undefined) loadGamedata()

        return () => {

            loadDataTimeout = clearTimeout(loadDataTimeout)
            resetGameContext()

        }

    }, [])

    // start gameLoop
    useEffect(() => {
        if(gameId === undefined) history.push('/')
    }, [gameId])

    useEffect(() => {

        if(Date.now() > nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, 100)
        if(Date.now() < nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, (nextRoundAt - Date.now()) + 1000)

    }, [nextRoundAt])

    useEffect(() => {

        if(moveTo !== undefined){

            ;(async () => {

                const result = await postNewMove(gameId, moveFrom, moveTo)
                console.log(result)

            })()

        }

    }, [moveTo])

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
            setGameStartedAt(gamedata.gameStartedAt)
            setGameEndedAt(gamedata.gameEndedAt)

        }

        if(gamedata === undefined) history.push('/')

    }

    function zoomGame(event){

        let scale = zoomLevel
        scale += event.deltaY * -0.001
        scale = Math.min(Math.max(.2, scale), 5)

        setZoomLevel(scale)

    }

    async function makeMove(tile){

        if(round === 0) return

        const boardState = board[tile][0]
        const indexOfPlayer = players.indexOf(username) + 1
        const playerIndexOnTile = parseFloat(board[tile][1])

        // selected full move, send move to backend
        if(moveFrom !== undefined && tile !== moveFrom && boardState === 'normal'){

            setMoveTo(tile)

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
        <div className={styles.container} onWheel={(event) => { zoomGame(event) }}>
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
