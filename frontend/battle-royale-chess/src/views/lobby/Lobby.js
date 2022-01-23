import { useEffect, useContext, useState, useMemo } from 'react'
import { useHistory, NavLink } from 'react-router-dom'

import moment from 'moment'

import MainMenu from '../../components/mainMenu/MainMenu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'
import Piece from '../../components/piece/Piece'
import LobbyCard from '../../components/lobbyCard/LobbyCard'

import { UserContext } from '../../contexts/UserContext'
import { GametypesContext } from '../../contexts/GametypesContext'
import { QueuesContext } from '../../contexts/QueuesContext'
import { GamesContext } from '../../contexts/GamesContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { GameContext } from '../../contexts/GameContext'
import { SettingsContext } from '../../contexts/SettingsContext'

import { doPlaceInQueue, doRemoveFromQueue, getGameId } from '../../services/LobbyService'

import colors from '../../assets/js/colors'

import styles from './Lobby.module.css'

export default function Lobby() {

    const history = useHistory()

    const { username, role } = useContext(UserContext)
    const { gametypes } = useContext(GametypesContext)
    const { queues } = useContext(QueuesContext)
    const { games } = useContext(GamesContext)
    const { logout } = useContext(AuthenticationContext)
    const { gameId, setGameId, resetGameContext } = useContext(GameContext)
    const { dateFormat } = useContext(SettingsContext)

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
                            moment(data.gameStartedAt).format(dateFormat)

                        },
                    },
                ],
            }
        ],
        [dateFormat]
    )

    // useEffect(() => {
    //
    //     if(role === "ADMIN" || role === "USER"){
    //
    //         (async () => {
    //
    //             try {
    //
    //                 const result = await getQueue()
    //
    //                 setQueue(result.data)
    //
    //             } catch (error) {
    //
    //                 setQueue([])
    //
    //             }
    //
    //         })()
    //
    //     }
    //
    //     if(role === "SPECTATOR"){
    //
    //         (async () => {
    //
    //             const result = await getGames()
    //
    //             setGames(result.data)
    //
    //         })()
    //
    //     }
    //
    // }, [])

    useEffect(() => {

        if(username && role === 'ADMIN' || role === 'USER'){

            const refreshQueueInterval = setInterval(async () => {

                try {

                    // const result = await getQueue()
                    //
                    // setQueue(result.data)

                    const isUserInQueue = queues.find(p => p.username === username)

                    if(isUserInQueue !== undefined){

                        setIsQueued(true)

                    }

                } catch (error) {

                    // setQueue([])

                }

            }, 1000)

            if(username !== undefined){

                (async () => {

                    try {

                        const result = await getGameId(username)

                        if(typeof result.data === 'number'){

                            setIsAlreadyInGame(result.data)

                        }

                        if(typeof result.data !== 'number'){

                            setIsAlreadyInGame(false)

                        }

                    } catch (error) {

                    }

                })()

            }

            return () => clearInterval(refreshQueueInterval)

        }

        // if(username && role === "SPECTATOR"){
        //
        //     const  refreshGamesInterval = setInterval(async () => {
        //
        //         const result = await getGames()
        //
        //         setGames(result.data)
        //
        //     }, 1000)
        //
        //     return () => clearInterval(refreshGamesInterval)
        //
        // }

    }, [role, username])

    useEffect(() => {

        let getGameIdInterval

        if(isQueued === true){

            getGameIdInterval = setInterval(async () => {

                try {

                    const result = await getGameId(username)

                    if(typeof result.data === 'number'){

                        setGameId(result.data)

                    }

                } catch (error) {

                }

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

    async function enterQueue(gametype){

        try {

            await doPlaceInQueue(gametype)

            // const result = await getQueue()
            // setQueue(result.data)

        } catch (error) {

            // setQueue([])

        }

    }

    async function leaveQueue(){

        try {

            await doRemoveFromQueue()
            setIsQueued(false)

            // const result = await getQueue()
            // setQueue(result.data)

        } catch (error) {

            // setQueue([])

        }

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
                                                        queue={queues}
                                                        gametype={g}
                                                        />
                                                    )
                                            })
                                        )
                                    : isAlreadyInGame === true
                                    ? (
                                            <BasicContainer>
                                                <div className={styles.alreadyInGameContainer} onClick={() => enterGame(isAlreadyInGame)}>
                                                    You're already in a game, click here to go to that game.
                                                </div>
                                            </BasicContainer>
                                        )
                                    : ''
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
