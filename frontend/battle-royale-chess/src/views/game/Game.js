import { useEffect, useContext } from 'react'
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

    // loadDataTimeout is de timeout for loading gamedata from the server
    // it is calculated from the nextRoundAt value so it only requests data after every round has ended
    // to minimize data requests
    let loadDataTimeout

    // get gameId & start gameloop with loadGamedata call
    useEffect(() => {

        // clear the context
        resetGameContext()

        if(gameId === undefined){

            history.push('/')

        }

        return () => clearTimeout(loadDataTimeout)

    }, [games, gameId, gametypes])

    useEffect(() => {

        // gametypes context should load gametypes first
        if(gametypes === undefined) return
        // wait until gameId is set
        if(gameId === undefined) return
        // ofcourse don't load gamedata after game is finished
        if(finished === true) return

        loadGamedata()

    }, [gameId, gametypes])

    useEffect(() => {

        // new gamedata has not been loaded yet but the round has ended. this can happen when the previous loadGamedata call was a little bit to early and server hadn't processed finishing round yet
        if(Date.now() > nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, 100)
        // normal behaviour, load gamedata a second after round is planned to finish
        if(Date.now() < nextRoundAt && finished === false) loadDataTimeout = setTimeout(loadGamedata, (nextRoundAt - Date.now()) + 1000)

    }, [nextRoundAt])

    // check if moveTo is not undefined because we only send complete moves to the server
    // if moveTo is defined then moveFrom is certainly defined too
    // the server checks the username so the move gets appointed to the right player
    useEffect(() => {

        if(moveTo !== undefined){

            ;(async () => {

                try {

                    const result = await doNewMove(gameId, moveFrom, moveTo)

                } catch (error) {

                    console.log('Error scheduling move')

                }

            })()

        }

    }, [moveTo])

    // load gamedata and set all states
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

            console.log('Error getting gamedata from server')

        }

    }

    // zoomGame is used to zoom the gameBoard
    function zoomGame(event){

        // create var
        let scale = zoomLevel
        // adjust scale by scroll or pinch value
        scale += event.deltaY * -0.001
        // limit scale to a min and max value. we shouldnt be able to zoom indefinitely
        scale = Math.min(Math.max(.2, scale), 5)

        setZoomLevel(scale)

    }

    async function makeMove(tile){

        // we cannot make moves before game starts
        if(round === 0) return


        const boardState = board[tile][0]
        const indexOfPlayer = players.indexOf(username) + 1
        const playerIndexOnTile = parseFloat(board[tile][1])

        // selected full move, send move to backend
        if(
            moveFrom !== undefined                                              // we already selected moveFrom so this is the moveTo selection
            && tile !== moveFrom                                                // tile is different then the moveFrom tile
            && boardState === 'normal'                                          // the desired to tile is a normal tile, we can only move to normal tiles
            && playerIndexOnTile !== indexOfPlayer                              // we cannot move to and hit our own pieces
        ){

            setMoveTo(tile)

        }

        // this is the first selection of the move, so set moveFrom
        if(
            moveFrom === undefined
            && boardState === "normal"
            && indexOfPlayer === playerIndexOnTile                              // we can only select a moveFrom if we are the player on the tile
        ){

            setMoveFrom(tile)

        }

        // cancel planned move if we clicked on the moveFrom tile
        // we do not cancel a move if we made a move and click on the moveTo tile again
        //  then we simply keep the move until a new moveTo tile is selected, and we resend a new move
        // the server automatically overwrites the old scheduled move
        if(moveFrom === tile){

            setMoveFrom(undefined)
            setMoveTo(undefined)

            try {

                doCancelMove(gameId, username)

            } catch (error) {

                console.log('Error cancelling move')

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
