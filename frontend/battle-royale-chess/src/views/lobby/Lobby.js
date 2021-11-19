import { useEffect, useContext, useState, useMemo } from 'react'
import { useHistory, NavLink } from 'react-router-dom'

import moment from 'moment'

import MainMenu from '../../components/mainMenu/MainMenu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'
import Piece from '../../components/piece/Piece'
import LobbyCard from '../../components/lobbyCard/LobbyCard'

import { UserContext } from '../../contexts/UserContext'
import { GamesContext } from '../../contexts/GamesContext'
import { GametypesContext } from '../../contexts/GametypesContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { GameContext } from '../../contexts/GameContext'
import { SettingsContext } from '../../contexts/SettingsContext'

import { getQueue, placeInQueue, removeFromQueue, getGameId } from '../../services/LobbyService'

import colors from '../../assets/js/colors'

import styles from './Lobby.module.css'

export default function Lobby() {

    const history = useHistory()

    const { username, role } = useContext(UserContext)
    const { games, refreshGames } = useContext(GamesContext)
    const { gametypes, refreshGametypes } = useContext(GametypesContext)
    const { logout } = useContext(AuthenticationContext)
    const { gameId, setGameId, resetGameContext } = useContext(GameContext)
    const { dateFormat } = useContext(SettingsContext)

    const [queue, setQueue] = useState([])
    const [isAlreadyInGame, setIsAlreadyInGame] = useState(undefined)
    const [isQueued, setIsQueued] = useState(false)

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
                        accessor: data => {
                            console.log(moment, data, dateFormat)
                            moment(data.gameStartedAt).format(dateFormat)

                        },
                    },
                ],
            }
        ],
        [dateFormat]
    )

    useEffect(() => {

        (async () => {

            const q = await getQueue()
            setQueue(q)

            await refreshGames()

        })()

    }, [])

    useEffect(() => {

        let refreshQueueInterval

        if(role === 'ADMIN' || role === 'USER'){

            refreshQueueInterval = setInterval(async () => {

                const result = await getQueue()
                setQueue(result)

            }, 1000)

        }

        return () => clearInterval(refreshQueueInterval)

    }, [role])


    // deze functie laat de games elke seconde
    useEffect(() => {

        let refreshGamesInterval = setInterval(async () => {

            await refreshGames()

        }, 1000)

        return () => clearInterval(refreshGamesInterval)

    }, [])

    useEffect(() => {

        let getGameIdInterval

        if(isQueued === true){

            getGameIdInterval = setInterval(async () => {

                const result = await getGameId(username)

                if(result) setGameId(result)

            }, 1000)

        }

        if(isQueued === false){

            clearInterval(getGameIdInterval)

        }

        return () => clearInterval(getGameIdInterval)

    }, [isQueued])

    useEffect(() => {

        if(gameId) history.push('/game')

    }, [gameId])

    useEffect(() => {

        if(isAlreadyInGame){

            const game = games.find(g => g.gameId === isAlreadyInGame)

            if(game && game.finished === true){

                setIsAlreadyInGame(false)

            }

        }

    }, [games])

    useEffect(() => {

        if(username){

            (async () => {

                const result = await getGameId(username)
                if(result) setIsAlreadyInGame(result)
                if(!result) setIsAlreadyInGame(false)

            })()

        }

    }, [username])

    async function enterQueue(gametype){

        const result = await placeInQueue(gametype)
        setIsQueued(true)

        const result2 = await getQueue()
        setQueue(result2)

    }

    async function leaveQueue(){

        const result = await removeFromQueue()
        setIsQueued(false)

        const result2 = await getQueue()
        setQueue(result2)

    }

    async function enterGame(isAlreadyInGame){

        setGameId(isAlreadyInGame)

    }

    return (
        <div className={styles.container}>
            <div className={styles.userContainer}>
                Welcome {username} <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </div>
            <MainMenu />
            <div className={styles.underMenuContainer}>
                {
                    role === 'ADMIN' || role === 'USER'
                    ?   (
                            <div className={styles.lobbyContainer}>
                                {
                                    isAlreadyInGame === false
                                    ?   (
                                            gametypes.map(g => {
                                                return  (
                                                    <LobbyCard
                                                        key={g.gametype}
                                                        enterQueue={enterQueue}
                                                        leaveQueue={leaveQueue}
                                                        queue={queue}
                                                        gametype={g}
                                                        />
                                                    )
                                            })
                                        )
                                    : (
                                            <BasicContainer>
                                                <div className={styles.alreadyInGameContainer} onClick={() => enterGame(isAlreadyInGame)}>
                                                    Your are already in a game, click here to go to that game.
                                                </div>
                                            </BasicContainer>
                                        )
                                }
                            </div>
                        )
                    : (
                        <div className={styles.gamesContainer}>
                            <BasicTable columns={columns} data={games} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
