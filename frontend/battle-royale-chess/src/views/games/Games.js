import { useEffect, useContext, useMemo, useState } from 'react'

import moment from 'moment'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { GamesContext } from '../../contexts/GamesContext'
import { SettingsContext } from '../../contexts/SettingsContext'

import styles from './Games.module.css'

export default function Games() {

    const { games, loadGames } = useContext(GamesContext)
    const { dateFormat } = useContext(SettingsContext)

    useEffect(() => {

        loadGames('finished')

    }, [])



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
                        Header: 'Played at',
                        accessor: data => moment(data.gameStartedAt).format(dateFormat),
                    },
                ],
            }
        ],
        []
    )

    return (
        <div className={styles.container}>
            <Menu
                title={'Games played on Battle Royale Chess'}
                buttons={[
                    {
                        text:'Finished Games',
                        onClick:() => loadGames('finished')
                    },
                    {
                        text:'Active Games',
                        onClick:() => loadGames('active')
                    },
                ]}
            />
            <div className={styles.gamesList}>
                <BasicTable columns={columns} data={games} />
            </div>
        </div>
    )
}
