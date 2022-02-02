import { useEffect, useState, useMemo, useContext } from 'react'

import moment from 'moment'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { getAllPlayersdata, getChessComProfile, getChessComStats } from '../../services/PlayerService'

import { SettingsContext } from '../../contexts/SettingsContext'

import styles from './Players.module.css'

export default function Players() {

    const { dateFormat } = useContext(SettingsContext)

    const [players, setPlayers] = useState([])
    const [chessComUserdata, setChessComUserdata] = useState(undefined)
    const [buttons, setButtons] = useState([
        {
            text:"Back to player list",
            onClick:() => setChessComUserdata(undefined)
        }
    ])

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
                {
                    Header: 'Chess.com stats',
                    accessor: data => {

                        if(data.chessCom) return <button className={styles.button} onClick={() => fetchChessComData(data.chessCom)}>View</button>

                    },
                }
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

    async function fetchChessComData(username){

        Promise.all([
            getChessComProfile(username),
            getChessComStats(username)
        ]).then(values => {

            const data = {
                profile:values[0],
                stats:values[1]
            }

            console.log(data)
            setChessComUserdata(data)

        }).catch(error => {

        })

        // const profile = await getChessComProfile(username)
        // const stats = await getChessComStats(username)
        //
        //
        // console.log(profile)
        // console.log(stats)

        // setChessComUserdata(JSON.stringify(stats))

    }

    return (
        <div className={styles.container}>
            <Menu
                title={'Players of Battle Royale Chess'}
                buttons={chessComUserdata !== undefined ? buttons : []}
            />
            <div className={styles.playersList}>
                {
                    chessComUserdata === undefined
                    ? <BasicTable columns={columns} data={players} />
                    : (
                        <BasicContainer>
                            <div className={styles.group}>
                                <div className={styles.title}>
                                    Chess.com player info
                                </div>
                                <img src={chessComUserdata.profile.avatar} className={styles.img} />
                                <div className={styles.title}>
                                    Profile
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Username
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile.username }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Real name
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile.name }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Country
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile.country.split('/').at(-1) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Member since
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { moment(chessComUserdata.profile.joined * 1000).format(dateFormat()) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Last online
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { moment(chessComUserdata.profile.last_online * 1000).format(dateFormat()) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Followers
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile.followers }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Streamer
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile.is_streamer ? 'yes' : 'no' }
                                    </div>
                                </div>
                            </div>
                                <div className={styles.group}>
                                    <div className={styles.title}>
                                        Stats
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Blitz
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats.chess_blitz?.record?.win } Draw: { chessComUserdata.stats.chess_blitz?.record?.draw } Loss: { chessComUserdata.stats.chess_blitz?.record?.loss }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Bullet
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats.chess_bullet?.record?.win } Draw: { chessComUserdata.stats.chess_bullet?.record?.draw } Loss: { chessComUserdata.stats.chess_bullet?.record?.loss }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Daily
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats.chess_daily?.record?.win } Draw: { chessComUserdata.stats.chess_daily?.record?.draw } Loss: { chessComUserdata.stats.chess_daily?.record?.loss }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Rapid
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats.chess_rapid?.record?.win } Draw: { chessComUserdata.stats.chess_rapid?.record?.draw } Loss: { chessComUserdata.stats.chess_rapid?.record?.loss }
                                        </div>
                                    </div>
                                </div>
                        </BasicContainer>
                    )
                }
            </div>
        </div>
    )
}
