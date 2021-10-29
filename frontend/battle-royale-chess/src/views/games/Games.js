import { useEffect, useContext, useMemo } from 'react'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { GamesContext } from '../../contexts/GamesContext'

import styles from './Games.module.css'

export default function Games() {

    const { games, refreshGames } = useContext(GamesContext)

    const basicContainerOuterStyle = { width:"100%", height:"60px", userSelect:"none", boxSizing:"border-box" }
    const basicContainerInnerStyle = { fontSize:"20px", display:"flex", justifyContent:"center", alignItems:"center", boxSizing:"border-box" }

    useEffect(() => {

        const refreshDataInterval = setInterval(() => {

            refreshGames()

        }, 1000)

        return () => clearInterval(refreshDataInterval)

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
                Header: 'Finished',
                accessor: data => data.finished ? "true" : "false",
              },
              {
                Header: 'Gametype',
                accessor: 'gametype',
              },
            ],
          }
        ],
        []
    )

    return (
        <div className={styles.container}>
            <Menu />
            <div className={styles.gamesList}>
                <BasicContainer outerStyle={Object.assign(basicContainerOuterStyle, { height:"fit-content" })} innerStyle={basicContainerInnerStyle}>
                    <BasicTable columns={columns} data={games} />
                </BasicContainer>
            </div>
        </div>
    )
}
