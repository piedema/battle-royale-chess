import { useEffect, useContext, useMemo, useState } from 'react'
import { useHistory, NavLink } from 'react-router-dom'

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

import { getGameIdForPlayer } from '../../services/GamesService'

import styles from './Lobby.module.css'

export default function Lobby() {

    const history = useHistory()

    const { username, role } = useContext(UserContext)
    const { games, refreshGames, queuedForGame, setQueuedForGame, getGameIdForPlayer, setGameId } = useContext(GamesContext)
    const { gametypes, refreshGametypes } = useContext(GametypesContext)
    const { queue, refreshQueue, placeInQueue, removeFromQueue } = useContext(LobbyContext)
    const { logout } = useContext(AuthenticationContext)

    const basicContainerOuterStyle = { width:"100%", height:"60px", userSelect:"none", boxSizing:"border-box" }
    const basicContainerInnerStyle = { fontSize:"20px", display:"flex", justifyContent:"center", alignItems:"center", boxSizing:"border-box" }

    const [shuffledBoard, setShuffledBoard] = useState({})

    function shuffleBoard(boardWidth, boardHeight, shuffleEvenWhenShuffledAlready){

        if(shuffleEvenWhenShuffledAlready){

            const buttons = [
                { text:"Games", link:"/games", role:"SPECTATOR" },
                { text:"High scores", link:"/highscores", role:"SPECTATOR" },
                { text:"Profile", link:"/profile", role:"USER" },
                { text:"Users", link:"/users", role:"ADMIN" },
                { text:"Rules", link:"/rules", role:"SPECTATOR" },
                { text:"Shop", link:"/shop", role:"USER" },
                { text:"About", link:"/about", role:"SPECTATOR" },
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

                const key = `${Math.ceil((Math.random() * boardHeight))}${Math.ceil((Math.random() * boardWidth))}`

                if(result[key] === undefined) result[key] = buttonsFilteredByRole.shift()

            }

            const numberOfPiecesWanted = Math.ceil(Math.random() * 6) + 2
            const piecesWanted = []

            for(let i = 0; i < numberOfPiecesWanted; i++){

                const types = ["King", "Queen", "Tower", "Bishop", "Knight", "Pawn"]
                const style = "outlined"
                const pieceIndex = Math.ceil(Math.random() * 5) - 1
                const colorIndex = Math.ceil(Math.random() * 8) - 1

                piecesWanted.push({ element:"piece", type:types[pieceIndex], style:style, color:colorIndex })

            }

            while(piecesWanted.length !== 0){

                const key = `${Math.ceil((Math.random() * boardHeight))}${Math.ceil((Math.random() * boardWidth))}`

                if(result[key] === undefined) result[key] = piecesWanted.shift()

            }

            setShuffledBoard(result)

        }

    }

    useEffect(() => {

        refreshGametypes()

        const refreshDataInterval = setInterval(() => {

            refreshGames()

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
        shuffleBoard(8, 4, true)
    }, [role])

    const columns = useMemo(
        () => [
          {
            Header: 'Currently played games',
            columns: [
              {
                Header: 'Players',
                accessor: 'players',
              },
              {
                Header: 'Gametype',
                accessor: 'gametype',
              },
            ],
          }
        ],
        []
    )

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
                            ? <Piece type={shuffledBoard[key].type} styling={shuffledBoard[key].style} playerIndex={shuffledBoard[key].color}></Piece>
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
            <div className={styles.welcomeUser}>
                Welcome {username} <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </div>
            <div className={styles.lobbyContainer}>
                <div>
                    <div className={styles.shuffleButtonContainer}>
                        <div className={styles.shuffleButton} onClick={() => shuffleBoard(8, 4, true)}>Shuffle Menu</div>
                    </div>
                    <div className={styles.menuContainer}>
                        {generateChessboard(8, 4)}
                    </div>
                </div>

                {
                    role !== 'SPECTATOR' ?
                        <div className={styles.gamesLobby}>
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
                        </div>
                        : ""
                    }
            </div>
        </div>
    )
}
