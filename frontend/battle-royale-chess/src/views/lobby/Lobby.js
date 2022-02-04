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

    const mainMenuButtons = [
        { text:"Games", link:"/games", role:"SPECTATOR" },
        { text:"Set tings", link:"/settings", role:"USER" },
        { text:"Users", link:"/users", role:"ADMIN" },
        { text:"Rules", link:"/rules", role:"SPECTATOR" },
        { text:"Game types", link:"/gametypes", role:"ADMIN" },
        // { text:"Shop", link:"/shop", role:"USER" },
        { text:"Players", link:"/players", role:"SPECTATOR" }
    ]

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
                        Header: 'Game started at',
                        accessor: data => {
                            return moment(data.gameStartedAt).format(dateFormat())
                        },
                    },
                ],
            }
        ],
        [dateFormat]
    )

    // set interval to refresh all neccessary data
    useEffect(() => {

        const dataRefreshInterval = setInterval(() => {

            fetchGames()
            fetchGametypes()
            fetchQueues()

        }, 1000)

        return () => clearInterval(dataRefreshInterval)

    }, [])

    // useEffect switches between showing the "isalreadyIngame" thing and the lobby cards to queue for a game
    useEffect(() => {

        if(games === undefined) return

        // if a game is found then user is in a game
        const game = games.find(g => g.players.includes(username) && g.finished === false)

        // if user is in a game and isInGame === false then user jsut entered game and should move to game screen
        if(game !== undefined && isInGame === false){

            setIsInGame(true)
            setGameId(game.gameId)
            history.push('/game')

        }

        // user refreshed page and is in game, show the return to game element
        if(game !== undefined && isInGame === undefined){

            setIsInGame(true)
            setGameId(game.gameId)

        }

        // user recently was in game which has finished. show lobby queue by setting isInGame to false
        if(game === undefined && isInGame === true){

            setIsInGame(false)
            setGameId(undefined)

        }

        // user is not in a game and refreshed page. set isInGame to false to load lobby queue
        if(game === undefined && isInGame === undefined){

            setIsInGame(false)
            setGameId(undefined)

        }

    }, [games, username, isInGame])

    // clicking on a lobby card places user in queue
    async function enterQueue(gametype){

        try {

            await doPlaceInQueue(gametype)

        } catch (error) {

        }

    }

    // clicking on a lobby card for which you are in queue then remove queue
    async function leaveQueue(){

        try {

            await doRemoveFromQueue()

        } catch (error) {

        }

    }

    // setting isInGame to false triggers the useEffect on line 104
    // this sees you are in a game and not in the game view so it switches you to that
    async function enterGame(){

        setIsInGame(false)

    }

    // if a game row is selected (when you are a spectator) then load this gameview and gameview data bij gameId
    function gameSelected(row){

        const gameId = row.original.gameId

        setGameId(gameId)
        history.push('/game')

    }

    return (
        <div className={styles.container}>
            <div className={styles.userContainer}>
                Welcome {username} <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </div>
            <MainMenu buttons={mainMenuButtons} />
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
                            <BasicTable
                            columns={columns}
                            data={games !== undefined ? games : []}
                            getRowProps={row => ({
                                style:{
                                    cursor:"pointer"
                                },
                                onClick:() => gameSelected(row)
                            })}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
