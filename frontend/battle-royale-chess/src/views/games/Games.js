import { useEffect, useContext, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import moment from 'moment'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { SettingsContext } from '../../contexts/SettingsContext'
import { GameContext } from '../../contexts/GameContext'

import { getGames } from '../../services/GamesService'

import styles from './Games.module.css'

export default function Games() {

    const history = useHistory()

    const [finished, setFinished] = useState(true)
    const [games, setGames] = useState([])

    const { dateFormat } = useContext(SettingsContext)
    const { gameId, setGameId, resetGameContext } = useContext(GameContext)

    useEffect(() => {

        ;(async () => {

            const result = await getGames()

            setGames(result.data)

        })()

    }, [])

    useEffect(() => {

        if(gameId) history.push('/game')

    }, [gameId])

    const columns = useMemo(
        () => [
            {
                Header: finished ? 'Finished Games' : 'Active Games',
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
                        Header: 'Played at',
                        accessor: data => moment(data.gameStartedAt).format(dateFormat),
                    },
                ],
            }
        ],
        []
    )

    function gameSelected(row){

        const gameId = row.original.gameId

        setGameId(gameId)

    }

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
                    data={games.filter(g => g.finished === finished)}
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
