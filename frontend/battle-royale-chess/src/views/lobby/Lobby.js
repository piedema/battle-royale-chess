import { useEffect, useContext, useState, useMemo } from 'react'
import { useHistory, NavLink } from 'react-router-dom'

import { moment } from 'moment'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'
import Piece from '../../components/piece/Piece'
import Card from '../../components/card/Card'

import { UserContext } from '../../contexts/UserContext'
import { GamesContext } from '../../contexts/GamesContext'
import { GametypesContext } from '../../contexts/GametypesContext'
import { LobbyContext } from '../../contexts/LobbyContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { GameContext } from '../../contexts/GameContext'

import { getGameIdForPlayer } from '../../services/GamesService'

import colors from '../../assets/js/colors'

import styles from './Lobby.module.css'

export default function Lobby() {

    const history = useHistory()

    const { username, role } = useContext(UserContext)
    const { games, loadGames, queuedForGame, setQueuedForGame, getGameIdForPlayer, setGameId } = useContext(GamesContext)
    const { gametypes, refreshGametypes } = useContext(GametypesContext)
    const { queue, refreshQueue, placeInQueue, removeFromQueue } = useContext(LobbyContext)
    const { logout } = useContext(AuthenticationContext)
    const { finished, resetGameContext } = useContext(GameContext)

    const [shuffledBoard, setShuffledBoard] = useState({})
    const [tileSize, setTileSize] = useState(100)
    const [rows, setRows] = useState(4)
    const [cols, setCols] = useState(8)
    const [perspective, setPerspective] = useState('2d')

    const dateFormat = localStorage.getItem('dateTime')

    const columns = useMemo(
        () => [
            {
                Header: 'Games',
                columns: [
                    {
                        Header: 'Game id',
                        accessor: 'gameId',
                    },
                    {
                        Header: 'Gametype',
                        accessor: 'gametype',
                    },
                    {
                        Header: 'Ending round',
                        accessor: 'round',
                    },
                    {
                        Header: 'Game finished',
                        accessor: data => data.finished === true ? 'Yes' : 'No',
                    },
                    {
                        Header:'Players & scores',
                        accessor: data => data.players.map((p, i) => { return p + ' ' + data.scores[i] }).join(', ')
                    },
                    {
                        Header: 'Played at',
                        accessor: data => moment(data.gameStartedAt).format(dateFormat),
                    },
                ],
            }
        ],
        []
    )

    function shuffleBoard(shuffleEvenWhenShuffledAlready){

        if(shuffleEvenWhenShuffledAlready){

            const buttons = [
                { text:"Games", link:"/games", role:"SPECTATOR" },
                { text:"High scores", link:"/highscores", role:"SPECTATOR" },
                { text:"Settings", link:"/settings", role:"USER" },
                { text:"Users", link:"/users", role:"ADMIN" },
                { text:"Rules", link:"/rules", role:"SPECTATOR" },
                // { text:"Shop", link:"/shop", role:"USER" },
                // { text:"About", link:"/about", role:"SPECTATOR" },
            ]

            const buttonsFilteredByRole = buttons.filter(b => {

                b.element = "button"

                switch (role) {
                    case "SPECTATOR": return b.role === "SPECTATOR"
                    case "USER": return b.role === "SPECTATOR" || b.role === "USER"
                    case "ADMIN": return b
                }

            })

            const result = {}

            while(buttonsFilteredByRole.length !== 0){

                const key = `${Math.ceil((Math.random() * rows))}${Math.ceil((Math.random() * cols))}`

                if(result[key] === undefined) result[key] = buttonsFilteredByRole.shift()

            }

            const numberOfPiecesWanted = Math.ceil(Math.random() * 6) + 2
            const piecesWanted = []

            for(let i = 0; i < numberOfPiecesWanted; i++){

                const types = ["King", "Queen", "Tower", "Bishop", "Knight", "Pawn"]
                const style = "outlined"
                const pieceIndex = Math.ceil(Math.random() * 5) - 1
                const colorIndex = Math.ceil(Math.random() * 8) - 1

                piecesWanted.push({ element:"piece", type:types[pieceIndex], style:style, color:colors.pieces(colorIndex) })

            }

            while(piecesWanted.length !== 0){

                const key = `${Math.ceil((Math.random() * rows))}${Math.ceil((Math.random() * cols))}`

                if(result[key] === undefined) result[key] = piecesWanted.shift()

            }

            setShuffledBoard(result)

        }

    }

    function setRowsCols(){

        let newHeight = Math.min(window.innerHeight - 600, 600)
        let newWidth = Math.min(window.innerWidth - 200, 1000)

        setRows(Math.floor(newHeight / tileSize))
        setCols(Math.max(Math.floor(newWidth / tileSize), 3))

    }

    useEffect(() => {

        shuffleBoard(true)

    }, [rows, cols])

    useEffect(() => {

        if(finished === true) resetGameContext()

        if(role !== 'SPECTATOR') refreshGametypes()
        setRowsCols()
        setPerspective(window.innerWidth > 1000 ? '3d' : '2d')

        window.addEventListener('resize', setRowsCols)

        const refreshDataInterval = setInterval(() => {

            loadGames()

            if(role !== "SPECTATOR"){

                refreshQueue()

            }

        }, 1000)

        return () => clearInterval(refreshDataInterval)

    }, [])

    useEffect(() => {

        (async () => {

            if(queuedForGame !== undefined && queue.find(q => q.username === username) === undefined){
                setQueuedForGame(undefined)
                history.push('/game')
            }

        })()

    }, [queue])

    useEffect(() => {
        shuffleBoard(cols, rows, true)
    }, [role])

    async function queueForGame(gametype){

        const result = await placeInQueue(gametype)
        if(result !== false) setQueuedForGame(gametype)

    }

    async function unQueueFromGame(gametype){

        const result = await removeFromQueue()
        if(result !== false) setQueuedForGame(undefined)

    }

    function generateChessboard(tiles, rows){

        const rowsJsx = []

        for(let i = 1; i <= rows; i++){

            const tilesJsx = []

            for(let j = 1; j <= tiles; j++){

                const x = (100 * j) + 'px'
                const key = `${i}${j}`

                tilesJsx.push(
                    <div
                        key={j}
                        id={key}
                        className={
                            shuffledBoard[key] !== undefined && shuffledBoard[key].element === "button"
                            ? styles.tileMenuitem
                            : styles.tile}
                        style={{ x:x }}>
                        {
                            shuffledBoard[key] !== undefined && shuffledBoard[key].element === 'button'
                            ? <NavLink to={shuffledBoard[key].link} className={styles.menuBtn}>{shuffledBoard[key].text}</NavLink>
                            : shuffledBoard[key] !== undefined && shuffledBoard[key].element === 'piece'
                            ? <Piece type={shuffledBoard[key].type} styling={shuffledBoard[key].style} color={shuffledBoard[key].color}></Piece>
                            : null
                        }
                    </div>
                )

            }

            const y = (100 * i) + 'px'

            rowsJsx.push(
                <div key={i} className={styles.row} style={{ y:y }}>
                    {tilesJsx}
                </div>
            )

        }

        return (
            <div className={styles.chessboard}>
                {rowsJsx}
            </div>
        )

    }

    return (
        <div className={styles.container}>
            <div className={styles.userContainer}>
                Welcome {username} <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </div>
            <div className={styles.lobbyContainer}>
                <div className={styles.shuffleButtonContainer}>
                    <div className={styles.shuffleButton} onClick={() => shuffleBoard(true)}>Shuffle Menu</div>
                    <div className={styles.shuffleButton} onClick={() => setPerspective(perspective === '3d' ? '2d' : '3d')}>View in {perspective === '3d' ? '2d' : '3d'}</div>
                </div>
                <div className={`${styles['chessboard-' + perspective]}`}>
                    {generateChessboard(cols, rows)}
                </div>

                {
                    role !== 'SPECTATOR' ?
                        <div className={styles.queueContainer}>
                                {
                                    gametypes.map(g => {
                                        return (
                                            <Card
                                                key={g.gametype}
                                                gametypeInfo={g}
                                                queue={queue}
                                                username={username}
                                                placeInQueue={queueForGame}
                                                removeFromQueue={unQueueFromGame}
                                            />
                                        )
                                    })
                                }
                        </div>
                    : ""
                }
                {
                    role === 'SPECTATOR' && (
                        <div className={styles.gamesList}>
                            <BasicTable columns={columns} data={games} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
