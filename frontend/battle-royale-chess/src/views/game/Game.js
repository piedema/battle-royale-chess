import { useState, useEffect, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import moment from 'moment'

import { GametypesContext } from '../../contexts/GametypesContext'
import { UserContext } from '../../contexts/UserContext'

import { getGamedata, getGameIdForPlayer, postNewMove, cancelMove } from '../../services/GamesService'

import BasicContainer from '../../components/basicContainer/BasicContainer'
import Piece from '../../components/piece/Piece'
import BasicAlert from '../../components/alert/Alert'

import styles from './Game.module.css'

export default function Game() {

    const history = useHistory()

    const { username } = useContext(UserContext)
    const { gametypes } = useContext(GametypesContext)

    const [gameId, setGameId] = useState(undefined)
    const [scores, setScores] = useState([])
    const [moves, setMoves] = useState({})
    const [board, setBoard] = useState({})
    const [players, setPlayers] = useState([])
    const [round, setRound] = useState(0)
    const [finished, setFinished] = useState(false)
    const [gametype, setGametype] = useState(undefined)
    const [nextRoundAt, setNextRoundAt] = useState(undefined)
    const [roundCountdown, setRoundCountdown] = useState(undefined)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [moveFrom, setMoveFrom] = useState(undefined)
    const [moveTo, setMoveTo] = useState(undefined)
    const [alert, setAlert] = useState(null)

    const boardRef = useRef(board)
    const playersRef = useRef(players)
    const gameIdRef = useRef(gameId)
    const movesRef = useRef(moves)
    const scoresRef = useRef(scores)
    const roundRef = useRef(round)
    const finishedRef = useRef(finished)
    const gametypeRef = useRef(gametype)
    const nextRoundAtRef = useRef(nextRoundAt)
    const moveFromRef = useRef(moveFrom)
    const moveToRef = useRef(moveTo)

    boardRef.current = board
    nextRoundAtRef.current = nextRoundAt
    finishedRef.current = finished
    moveToRef.current = moveTo
    moveFromRef.current = moveFrom

    let nextRoundAtInterval

    // get gameId
    useEffect(() => {

        (async () => {

            if(gameId === undefined && username !== undefined){
                const response = await getGameIdForPlayer(username)

                if(response !== undefined) setGameId(response)
                if(response === undefined) history.push('/') // return to lobby
            }

            if(nextRoundAtInterval === undefined){

                nextRoundAtInterval = setInterval(() => {

                    let newRoundCountdown = Math.round((nextRoundAtRef.current - Date.now()) / 1000)

                    if(newRoundCountdown < 0) newRoundCountdown = 0

                    if(finishedRef.current === false) setRoundCountdown(newRoundCountdown)
                    if(finishedRef.current === true) clearInterval(nextRoundAtInterval)

                }, 100)

            }

        })()

        return () => clearInterval(nextRoundAtInterval)

    }, [])

    // start gameLoop
    useEffect(() => {
        if(gameId !== undefined) gameLoop()
    }, [gameId])

    useEffect(() => {

        if(gameId === undefined) return
        if(moveFrom === undefined) return
        if(moveTo === undefined) return

        ;(async () => {

            const result = await postNewMove(gameId, moveFrom, moveTo)
            console.log(result)
            //setAlert(<BasicAlert message={result.message} type={result.success} timeout={5} destroy={setAlert} />);

        })()

    }, [moveTo])

    async function gameLoop(){

        const gamedata = await getGamedata(gameId)

        if(gamedata !== undefined){

            handleGamedata(gamedata)

            if(gametype === undefined) setGametype(gametypes.find(g => g.gametype === gamedata.gametype))

            // handle initialDelay of game to prevent a lot of requests before game has started
            if(gamedata.round === 0 && Date.now() < gamedata.nextRoundAt) return setTimeout(gameLoop, (gamedata.nextRoundAt - Date.now()) + 1000)

            // loaded gamedata a bit too early and game hasnt finished: server hasnt processed yet so timeout a bit
            if(gamedata.round === round && gamedata.finished === false) return setTimeout(gameLoop, 100)

            // loaded gamedata is fresh and game isnt finished: currentRoundFinishedAt = time of finishment of next round. set timeout for that round + 1sec
            if(gamedata.round > round && gamedata.finished === false) setTimeout(gameLoop, (gamedata.nextRoundAt - Date.now()) + 1000)

        }

        // return to lobby
        if(gamedata === undefined){

            history.push('/')

        }
    }

    function handleGamedata(gamedata){

        console.log(gamedata)

        setScores(gamedata.scores)
        setMoves(gamedata.moves)
        setBoard(gamedata.board)
        setPlayers(gamedata.players)
        setFinished(gamedata.finished)
        setRound(gamedata.round)
        setNextRoundAt(gamedata.nextRoundAt)

        setMoveFrom(undefined)
        setMoveTo(undefined)

    }

    function playersToJSX(){

        let positionClass = []

        if(players.length === 2) positionClass = ['middleLeft', 'middleRight']
        if(players.length === 3) positionClass = ['middleLeft', 'topMiddle', 'middleRight']
        if(players.length === 4) positionClass = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
        if(players.length === 5) positionClass = ['topLeft', 'topMiddle', 'topRight', 'bottomLeft', 'bottomRight']
        if(players.length === 6) positionClass = ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
        if(players.length === 7) positionClass = ['topLeft', 'topMiddle', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
        if(players.length === 8) positionClass = ['topLeft', 'topMiddle', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomMiddle', 'bottomRight']

        return players.map((p, i) => {
            return (
                <div key={p} className={`${styles.playerInfo} ${styles[positionClass[i]]}`}>
                    <BasicContainer>
                        player: {p}<br />
                        score: {scores[i]}
                    </BasicContainer>
                </div>
            )
        })
    }

    function boardToJSX(newBoard){

        const colKeysSorted = Object.keys(newBoard).sort((a, b) => { return a.split(":")[1] - b.split(":")[1]})
        const rowKeysSorted = Object.keys(newBoard).sort((a, b) => { return a.split(":")[0] - b.split(":")[0]})

        const rows = []
        const cols = []

        const cellSize = 100

        let colsAmount, rowsAmount, tableWidth, tableHeight

        if(colKeysSorted.length > 0 && rowKeysSorted.length > 0){

            colsAmount = colKeysSorted[colKeysSorted.length - 1].split(":")[1]
            rowsAmount = rowKeysSorted[rowKeysSorted.length - 1].split(":")[0]

            tableWidth = colsAmount * cellSize
            tableHeight = rowsAmount * cellSize

            for(let i = 1; i <= rowsAmount; i++){

                const row = []

                for(let j = 1; j <= colsAmount; j++){

                    const tile = newBoard[`${i}:${j}`]

                    if(tile === undefined){

                        row.push(
                            <td key={`${i}:${j}`} className={styles.td}></td>
                        )

                    }

                    if(tile !== undefined){

                        const piece = tile[2]
                        const playerIndex = parseFloat(tile[1]) - 1
                        const key = i + ':' + j
                        const classes = { tile:styles.tile, td:styles.td }

                        if(tile[0] === 'faded') classes.faded = styles.faded
                        if(playerIndex === players.indexOf(username) && tile[0] !== 'faded' && moveFrom === undefined && round > 0) classes.hasOwnPiece = styles.hasOwnPiece
                        if(moveFrom === key || moveTo === key) classes.isSelected = styles.isSelected
                        if(players[playerIndex] !== username && tile[0] !== 'faded' && moveFrom !== undefined) classes.hasOtherPiece = styles.hasOtherPiece
                        if(i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2)) classes.winningTile = styles.winningTile

                        row.push(
                            <td key={key} className={Object.values(classes).join(" ")} onClick={() => { scheduleMove(key) }}>
                                { piece !== undefined ? <Piece type={piece} styling="outlined" playerIndex={playerIndex}/> : null }
                            </td>
                        )

                    }

                }

                rows.push(
                    <tr key={i} className={styles.tr}>
                        {row}
                    </tr>
                )

            }

        }

        return (
            <table className={styles.table} style={{ width:`${tableWidth} !important`, height:`${tableHeight} !important`}}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )

    }

    function zoomGame(event){

        let scale = zoomLevel
        scale += event.deltaY * -0.001;
        scale = Math.min(Math.max(.2, scale), 1.8);

        setZoomLevel(scale)

    }

    function scheduleMove(tile){

        if(moveFrom !== undefined && tile !== moveFrom){

            setMoveTo(tile)

        }

        if(moveFrom === undefined && board[tile][0] === "normal" && players.indexOf(username) + 1 === parseFloat(board[tile][1])){

            setMoveFrom(tile)

        }

        // cancel planned move
        if(moveFrom === tile){

            setMoveFrom(undefined)
            setMoveTo(undefined)
            cancelMove(gameId, username)

        }

    }

    return (
        <div className="game" onWheel={(event) => { zoomGame(event) }}>
            <div className={styles.gameInfoContainer}>

            </div>
            <div className={styles.boardContainer} style={{ transform: `scale( ${zoomLevel} )` }}>
                {boardToJSX(board)}
            </div>
            <div className={styles.roundContainer}>
                Current round: {round}, next round in {roundCountdown}
            </div>
            <div className={styles.playerInfoContainer}>
                {playersToJSX(players)}
            </div>
        </div>
    )
}
