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

    let getGameIdInterval, refreshGamesInterval, refreshQueueInterval, isAlreadyInGameInterval

    useEffect(() => {

        console.log('mounting')

        return () => {

            console.log('unmounting')

            getGameIdInterval = clearInterval(getGameIdInterval)
            refreshGamesInterval = clearInterval(refreshGamesInterval)
            refreshQueueInterval = clearInterval(refreshQueueInterval)
            isAlreadyInGameInterval = clearInterval(isAlreadyInGameInterval)

            console.log('intervals', getGameIdInterval, refreshGamesInterval, refreshQueueInterval, isAlreadyInGameInterval)

        }

    }, [])

    useEffect(() => {

        (async () => {

            // clear game context
            resetGameContext()

            // check if player is already in a game
            const result = await getGameId(username)

            if(result !== undefined) setIsAlreadyInGame(result)
            if(result === undefined) setIsAlreadyInGame(false)


            if(refreshGamesInterval === undefined){

                refreshGamesInterval = setInterval(refreshGames, 1000 * 10)

            }

        })()

        return () => refreshGamesInterval = clearInterval(refreshGamesInterval)

    }, [username])

    useEffect(() => {

        if(isAlreadyInGame){

            isAlreadyInGameInterval = setInterval(async () => {

                const result = await getGameId(username)

                if(result === undefined){

                    clearInterval(isAlreadyInGameInterval)
                    setIsAlreadyInGame(false)

                }

            }, 1000)

        }

        return () => isAlreadyInGameInterval = clearInterval(isAlreadyInGameInterval)

    }, [isAlreadyInGame])

    useEffect(() => {

        if(role === 'ADMIN' || role === 'USER'){

            if(refreshGamesInterval === undefined){

                console.log(role)

                refreshGamesInterval = setInterval(async () => {

                    const result = await getQueue()
                    setQueue(result)

                }, 1000 * 10)

            }

        }

        return () => refreshQueueInterval = clearInterval(refreshQueueInterval)

    }, [role])

    async function enterQueue(gametype){

        const result = await placeInQueue(gametype)

        if(getGameIdInterval === undefined){

            getGameIdInterval = setInterval(async () => {

                const result = await getGameId(username)

                if(result !== undefined){

                    setGameId(result)
                    getGameIdInterval = clearInterval(getGameIdInterval)
                    history.push('/game')

                }

            }, 1000)

        }

    }

    async function leaveQueue(){

        const result = await removeFromQueue()

        getGameIdInterval = clearInterval(getGameIdInterval)

    }

    useEffect(() => {

        if(gameId !== undefined){

            history.push('/game')

        }

    }, [gameId])

    return (
        <div className={styles.container}>
            <div className={styles.userContainer}>
                Welcome {username} <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </div>
            <MainMenu />
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
                                            <div className={styles.alreadyInGameContainer} onClick={() => {

                                                console.log('i am already in a game')

                                                setGameId(isAlreadyInGame)

                                            }}>
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
    )
}
