import { useEffect, useState, useMemo } from 'react'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { fetchAllPlayersdata } from '../../services/PlayerService'

import styles from './Highscores.module.css'

export default function Highscores() {

    const [players, setPlayers] = useState([])

    useEffect(() => {

        (async () => {

            const players = await fetchAllPlayersdata()
            setPlayers([...players.data])

        })()

    }, [])

    const columns = useMemo(
        () => [
          {
            Header: 'Players',
            columns: [
                {
                  Header: 'Rank',
                  accessor: 'rank',
                },
                {
                    Header: 'Name',
                    accessor: 'username',
                },
                {
                    Header: 'Score',
                    accessor: 'score',
                },
                {
                    Header: 'Games played',
                    accessor: 'gamesPlayed',
                },
            ],
          }
        ],
        []
    )

    return (
        <div className={styles.container}>
            <Menu
                title={'Highscores in Battle Royale Chess'}
            />
            <div className={styles.highscoresList}>
                <BasicTable columns={columns} data={players} />
            </div>
        </div>
    )
}
