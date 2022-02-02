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
    const { gametypes, fetchGametypes } = useContext(GametypesContext)
    const { queues, fetchQueues } = useContext(QueuesContext)
    const { games, fetchGames } = useContext(GamesContext)
    const { logout } = useContext(AuthenticationContext)
    const { gameId, setGameId, resetGameContext } = useContext(GameContext)
    const { dateFormat } = useContext(SettingsContext)

    const [isInGame, setIsInGame] = useState(undefined)

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
                            return moment(data.gameStartedAt).format(dateFormat())
                        },
                    },
                ],
            }
        ],
        [dateFormat]
    )

    useEffect(() => {

        const dataRefreshInterval = setInterval(() => {

            fetchGames()
            fetchGametypes()
            fetchQueues()

        }, 1000)

        return () => clearInterval(dataRefreshInterval)

    }, [])

    useEffect(() => {

        if(games === undefined) return

        const game = games.find(g => g.players.includes(username) && g.finished === false)

        // if user is a game and isInGame === false then user jsut entered game and should move to game screen
        if(game !== undefined && isInGame === false){

            setIsInGame(true)
            history.push('/game')

        }

        // user refreshed page and is in game, show the return to game element
        if(game !== undefined && isInGame === undefined){

            setIsInGame(true)

        }

        // user recently was in game which has finished. show lobby queue by setting isInGame to false
        if(game === undefined && isInGame === true){

            setIsInGame(false)

        }

        // user is not in a game and refreshed page. set isInGame to false to load lobby queue
        if(game === undefined && isInGame === undefined){

            setIsInGame(false)

        }

    }, [games, username, isInGame])

    async function enterQueue(gametype){

        try {

            await doPlaceInQueue(gametype)

        } catch (error) {

        }

    }

    async function leaveQueue(){

        try {

            await doRemoveFromQueue()

        } catch (error) {

        }

    }

    async function enterGame(isAlreadyInGame){

        setIsInGame(false)

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
                                    isInGame === false && gametypes !== undefined && queues !== undefined
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
                                    : isInGame
                                    ? (
                                            <BasicContainer>
                                                <div className={styles.alreadyInGameContainer} onClick={() => enterGame()}>
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
