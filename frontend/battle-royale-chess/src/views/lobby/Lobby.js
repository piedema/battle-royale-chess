import { useEffect, useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { UserContext } from '../../contexts/UserContext'
import { GamesContext } from '../../contexts/GamesContext'
import { GametypesContext } from '../../contexts/GametypesContext'
import { LobbyContext } from '../../contexts/LobbyContext'

import { getGameIdForPlayer } from '../../services/GamesService'

import styles from './Lobby.module.css'

export default function Lobby() {

    const history = useHistory()

    const { username, role } = useContext(UserContext)
    const { games, refreshGames, isPlayerQueued, setIsPlayerQueued, getGameIdForPlayer, setGameId } = useContext(GamesContext)
    const { gametypes, refreshGametypes } = useContext(GametypesContext)
    const { queue, refreshQueue, addToQueue } = useContext(LobbyContext)

    const basicContainerOuterStyle = { width:"100%", height:"60px", userSelect:"none", boxSizing:"border-box" }
    const basicContainerInnerStyle = { fontSize:"20px", display:"flex", justifyContent:"center", alignItems:"center", boxSizing:"border-box" }

    useEffect(() => {

        const refreshDataInterval = setInterval(() => {

            refreshGames()

            if(role !== "SPECTATOR"){

                refreshGametypes()
                refreshQueue()

            }

        }, 1000)

        return () => clearInterval(refreshDataInterval)

    }, [])

    useEffect(() => {

        (async () => {

            if(isPlayerQueued === true && queue.find(q => q.username === username) === undefined){
                setIsPlayerQueued(false)
                history.push('/game')
            }

        })()

    }, [queue])

    const columns = useMemo(
        () => [
          {
            Header: 'Currently played games',
            columns: [
              {
                Header: 'Players',
                accessor: 'players',
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

    async function queueForGame(gametype){

        const result = await addToQueue(gametype)
        if(result !== false) setIsPlayerQueued(true)

    }

    return (
        <div className={styles.container}>
            Logged in as {username}
            <Menu />
            <div className={styles.gamesList}>
                <BasicContainer outerStyle={Object.assign(basicContainerOuterStyle, { height:"fit-content" })} innerStyle={basicContainerInnerStyle}>
                    <BasicTable columns={columns} data={games.filter(g => g.finished === false)} />
                </BasicContainer>
            </div>
            {
                role !== 'SPECTATOR' ?
                    <div className={styles.gamesLobby}>
                        <div style={{ display:"flex", alignItems:"row", width:"1000px" }}>
                            {
                                gametypes.map(g => {
                                    return (
                                        <BasicContainer outerStyle={{ width:"400px", display:"inline-block", margin:"20px" }} key={g.gametype}>
                                            Gametype: {g.gametype} <br />
                                            People currently in queue: {queue.filter(q => q.gametype === g.gametype).length} <br />
                                            {
                                                isPlayerQueued !== true
                                                ? <button onClick={() => queueForGame(g.gametype)} style={{ cursor:"pointer", backgroundColor:"lightgreen", padding:"10px", borderRadius:"10px", border:"0px" }}>Put in queue</button>
                                                : <button onClick={() => queueForGame(g.gametype)} style={{ cursor:"pointer", backgroundColor:"lightred", padding:"10px", borderRadius:"10px", border:"0px" }}>Cancel queue</button>
                                            }
                                        </BasicContainer>
                                    )
                                })
                            }
                        </div>
                    </div>
                    : ""
                }
        </div>
    )
}
