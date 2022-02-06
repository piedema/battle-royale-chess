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
                    Header: 'Chess.com stats?',
                    accessor: data => {

                        if(data.chessCom){

                            return (
                                <button
                                    className={styles.button}
                                    onClick={() => fetchChessComData(data.chessCom)}>
                                    View
                                </button>
                            )
                        }
                    },
                }
            ],
          }
        ],
        []
    )

    // get all players and sort by their rank
    useEffect(() => {

        (async () => {

            try {

                const players = await getAllPlayersdata()
                const rankedPlayers = [...players.data]
                const rankedPlayersSorted = sortPlayers(rankedPlayers)
                const rankedPlayersWithScore = addRank(rankedPlayersSorted)

                setPlayers(rankedPlayers)

            } catch (error) {

                setPlayers([])
                console.log('Error getting player data')

            }

        })()

    }, [])

    // sort players by their score
    function sortPlayers(array){

        return array.sort((a, b) => b.score - a.score)

    }

    // add their rank to the loaded data
    // this gives them the same number as the person above them with same score
    // and counts on with people with next score, like (1, 2, 2, 2, 5, 5, 7, 8, 9 )
    function addRank(rankedPlayersSorted){

        return rankedPlayersSorted.map((p, i, a) => {

            if(i === 0) p.rank = 1
            if(i > 0 && p.score === a[i-1].score) p.rank = a[i-1].rank
            if(i > 0 && p.score < a[i-1].score) p.rank = i + 1

            return p

        })

    }

    // fetch the needed data from chess.com to show in de detailed view
    async function fetchChessComData(username){

        Promise.all([
            getChessComProfile(username),
            getChessComStats(username)
        ]).then(values => {

            const data = {
                profile:values[0],
                stats:values[1]
            }

            setChessComUserdata(data)

        }).catch(error => {

        })

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
                                <img src={chessComUserdata.profile?.avatar} className={styles.img} />
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
                                        { chessComUserdata.profile?.username }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Real name
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile?.name || 'unknown' }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Country
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile?.country.split('/').at(-1) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Member since
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { moment(chessComUserdata.profile?.joined * 1000).format(dateFormat()) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Last online
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { moment(chessComUserdata.profile?.last_online * 1000).format(dateFormat()) }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Followers
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile?.followers }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Streamer
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        { chessComUserdata.profile?.is_streamer ? 'yes' : 'no' }
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
                                            Win: { chessComUserdata.stats?.chess_blitz?.record?.win || 0 } Draw: { chessComUserdata.stats?.chess_blitz?.record?.draw || 0 } Loss: { chessComUserdata.stats?.chess_blitz?.record?.loss || 0 }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Bullet
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats?.chess_bullet?.record?.win || 0 } Draw: { chessComUserdata.stats?.chess_bullet?.record?.draw || 0 } Loss: { chessComUserdata.stats?.chess_bullet?.record?.loss || 0 }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Daily
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats?.chess_daily?.record?.win || 0 } Draw: { chessComUserdata.stats?.chess_daily?.record?.draw || 0 } Loss: { chessComUserdata.stats?.chess_daily?.record?.loss || 0 }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Rapid
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            Win: { chessComUserdata.stats?.chess_rapid?.record?.win || 0 } Draw: { chessComUserdata.stats?.chess_rapid?.record?.draw || 0 } Loss: { chessComUserdata.stats?.chess_rapid?.record?.loss || 0 }
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
