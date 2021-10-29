import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { GametypesContext } from '../../contexts/GametypesContext'
import { UserContext } from '../../contexts/UserContext'

import { getGamedata, getGameIdForPlayer } from '../../services/GamesService'

import styles from './Game.module.css'

export default function Game() {

    const history = useHistory()

    const { username } = useContext(UserContext)
    const { gametypes } = useContext(GametypesContext)

    const [players, setPlayers] = useState([])
    const [board, setBoard] = useState([])
    const [scores, setScores] = useState([])
    const [moves, setMoves] = useState({})
    const [round, setRound] = useState(0)
    const [finished, setFinished] = useState(false)

    let gameId,
        currentRoundFinishedAt,
        lastRoundFetched = 0

    // gameloop
    useEffect(() => {

        (async () => {

            if(username === undefined || username === null) return history.push('/')

            gameId = await getGameIdForPlayer(username)

            if(gameId === undefined) return history.push('/')

            // get first gamedata
            const gamedata = await getGamedata(gameId)

            setBoard(gamedata.board)
            setPlayers(gamedata.players)
            setScores(gamedata.scores)
            setMoves(gamedata.moves)
            setRound(gamedata.round)
            setFinished(gamedata.finished)

            setTimeout(refreshGamedata, (gamedata.currentRoundFinishedAt - Date.now()) + 1000)

        })()

    }, [])

    async function refreshGamedata(){

        const gamedata = await getGamedata(gameId)

        setBoard(gamedata.board)
        setPlayers(gamedata.players)
        setScores(gamedata.scores)
        setMoves(gamedata.moves)
        setRound(gamedata.round)
        setFinished(gamedata.finished)

        const nextRefresh = (gamedata.currentRoundFinishedAt - Date.now()) + 1000

        // break gamedata refresh loop since game has ended
        if(finished === true) return

        if(lastRoundFetched === round) setTimeout(refreshGamedata, 100)

        if(lastRoundFetched < round){

            processGamedata()

            lastRoundFetched = round

            setTimeout(refreshGamedata, nextRefresh)

        }

    }

    function processGamedata(){

        // redraw board on screen

        // process scores etc

    }



  return (
    <div className="game">
        <div className={styles.gameContainer}>

        </div>
        <div className={styles.playerInfoContainer}>
            {
                players.map((p, i) => {

                    let positionClass = []

                    if(players.length === 2) positionClass = ['middleLeft', 'middleRight']
                    if(players.length === 3) positionClass = ['middleLeft', 'topMiddle', 'middleRight']
                    if(players.length === 4) positionClass = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
                    if(players.length === 5) positionClass = ['topLeft', 'topMiddle', 'topRight', 'bottomLeft', 'bottomRight']
                    if(players.length === 6) positionClass = ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
                    if(players.length === 7) positionClass = ['topLeft', 'topMiddle', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
                    if(players.length === 8) positionClass = ['topLeft', 'topMiddle', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomMiddle', 'bottomRight']

                    return (
                        <div key={p} className={`${styles.playerInfo} ${styles[positionClass[i]]}`}>
                            <div>
                                player {p} has score {scores[i]}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}
