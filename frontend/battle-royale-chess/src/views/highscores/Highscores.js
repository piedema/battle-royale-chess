import { useEffect, useState, useMemo } from 'react'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { getAllPlayersdata } from '../../services/PlayerService'

import styles from './Highscores.module.css'

export default function Highscores() {

    const [players, setPlayers] = useState([])

    useEffect(() => {

        (async () => {

            const players = await getAllPlayersdata()
            const rankedPlayers = [...players.data]
            const rankedPlayersSorted = sortPlayers(rankedPlayers)
            const rankedPlayersWithScore = addRank(rankedPlayersSorted)

            setPlayers(rankedPlayers)

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

    function sortPlayers(array){

        return array.sort((a, b) => b.score - a.score)

    }

    function addRank(rankedPlayersSorted){

        return rankedPlayersSorted.map((p, i, a) => {

            if(i === 0) p.rank = 1
            if(i > 0 && p.score === a[i-1].score) p.rank = a[i-1].rank
            if(i > 0 && p.score < a[i-1].score) p.rank = i + 1

            return p

        })

    }

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
