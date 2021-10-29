import { useEffect, useState, useMemo } from 'react'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { fetchAllPlayersdata } from '../../services/PlayerService'

import styles from './Highscores.module.css'

export default function Highscores() {

    const [players, setPlayers] = useState([])

    const basicContainerOuterStyle = { width:"100%", height:"60px", userSelect:"none", boxSizing:"border-box" }
    const basicContainerInnerStyle = { fontSize:"20px", display:"flex", justifyContent:"center", alignItems:"center", boxSizing:"border-box" }

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
                Header: 'Player name',
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
            <Menu />
            <div className={styles.highscoresList}>
                <BasicContainer outerStyle={Object.assign(basicContainerOuterStyle, { height:"fit-content" })} innerStyle={basicContainerInnerStyle}>
                    <BasicTable columns={columns} data={players} />
                </BasicContainer>
            </div>
        </div>
    )
}
