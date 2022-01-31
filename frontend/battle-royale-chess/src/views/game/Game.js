import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { GametypesContext } from '../../contexts/GametypesContext'
import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'
import { GamesContext } from '../../contexts/GamesContext'

import { getGamedata, doNewMove, doCancelMove } from '../../services/GamesService'

import GameBoard from '../../components/gameBoard/GameBoard'
import GameMenu from '../../components/gameMenu/GameMenu'
import PlayerInfo from '../../components/playerInfo/PlayerInfo'

import styles from './Game.module.css'

export default function Game() {

    const history = useHistory()

    const { username } = useContext(UserContext)
    const { getGametypeByName, gametypes } = useContext(GametypesContext)
    const { games } = useContext(GamesContext)
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

    // get gameId & start gameloop with loadGamedata call
    useEffect(() => {

        resetGameContext()

        if(games === undefined) return

        const game = games.find(g => g.players.includes(username) && g.finished === false)

        // an active game for this player has been found, set this games gameId
        if(game !== undefined){

            setGameId(game.gameId)

        }

        // an active game has not been found and gameId is undefined, so go back to lobby
        // this invokes going back to lobby on refresh after game has ended, but the gameId check
        // provokes automatically going back to lobby when current game has ended so players can
        // see the endscreen until the leave the game or refresh
        if(game === undefined && gameId === undefined){

            history.push('/')

        }

        return () => clearTimeout(loadDataTimeout)

    }, [games, gameId, gametypes])

    useEffect(() => {

        if(gametypes === undefined) return
        if(gameId === undefined) return
        if(finished === true) return

        loadGamedata()

    }, [gameId, gametypes])

    useEffect(() => {

        if(Date.now() > nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, 100)
        if(Date.now() < nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, (nextRoundAt - Date.now()) + 1000)

    }, [nextRoundAt])

    useEffect(() => {

        if(moveTo !== undefined){

            ;(async () => {

                try {

                    const result = await doNewMove(gameId, moveFrom, moveTo)

                } catch (error) {

                    console.log('Could not psot move to server', error)

                }

            })()

        }

    }, [moveTo])

    async function loadGamedata(){

        try {

            const result = await getGamedata(gameId)
            const gamedata = result.data

            setMoveFrom(undefined)
            setMoveTo(undefined)
            setGametype(getGametypeByName(gamedata.gametype))
            setScores(gamedata.scores)
            setMoves(gamedata.moves)
            setBoard(gamedata.board)
            setPlayers(gamedata.players)
            setFinished(gamedata.finished)
            setRound(gamedata.round)
            setNextRoundAt(gamedata.nextRoundAt)
            setGameStartedAt(gamedata.gameStartedAt)
            setGameEndedAt(gamedata.gameEndedAt)

        } catch (error) {

            history.push('/')

        }

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

            try {

                doCancelMove(gameId, username)

            } catch (error) {

                console.log('Could not cancel move at server', error)

            }

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
