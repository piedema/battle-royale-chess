import { useEffect, useContext, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import moment from 'moment'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { SettingsContext } from '../../contexts/SettingsContext'
import { GameContext } from '../../contexts/GameContext'
import { GamesContext } from '../../contexts/GamesContext'

import { getGames } from '../../services/GamesService'

import styles from './Games.module.css'

export default function Games() {

    const history = useHistory()

    const [finished, setFinished] = useState(true)

    const { dateFormat } = useContext(SettingsContext)
    const { gameId, setGameId, resetGameContext } = useContext(GameContext)
    const { games, fetchGames } = useContext(GamesContext)

    // the columns for the table showing the games
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
                        Header:'Players & scores',
                        accessor: data => data.players.map((p, i) => { return p + ' ' + data.scores[i] }).join(', ')
                    },
                    {
                        Header: 'Game started at',
                        accessor: data => moment(data.gameStartedAt).format(dateFormat()),
                    },
                ],
            }
        ],
        []
    )

    // refresh the games context data every 5 seconds
    useEffect(() => {

        const dataRefreshInterval = setInterval(() => {

            fetchGames()

        }, 5000)

        return () => clearInterval(dataRefreshInterval)

    }, [])

    // set game id after clicking on a game
    // this triggers the gameId useEffect to move to the game view
    function gameSelected(row){

        const gameId = row.original.gameId

        setGameId(gameId)

    }

    // clicking on a game sets the gameId to a game number
    // then move to game view so we can spectate that game
    useEffect(() => {

        if(gameId) history.push('/game')

    }, [gameId])

    return (
        <div className={styles.container}>
            <Menu
                title={'Games played on Battle Royale Chess'}
                buttons={[
                    {
                        text:'Finished Games',
                        onClick:() => setFinished(true)
                    },
                    {
                        text:'Active Games',
                        onClick:() => setFinished(false)
                    },
                ]}
            />
            <div className={styles.gamesList}>
                <BasicTable
                    columns={columns}
                    data={games !== undefined ? games.filter(g => g.finished === finished) : []}
                    getRowProps={row => ({
                        style:{
                            cursor:"pointer"
                        },
                        onClick:() => gameSelected(row)
                    })}
                />
            </div>
        </div>
    )
}
