import { createContext, useState } from 'react'

export const GameContext = createContext({})

export default function GameContextProvider({ children }){

    const [gameId, setGameId] = useState(undefined)
    const [board, setBoard] = useState({})
    const [players, setPlayers] = useState([])
    const [scores, setScores] = useState([])
    const [moves, setMoves] = useState({})
    const [moveFrom, setMoveFrom] = useState(undefined)
    const [moveTo, setMoveTo] = useState(undefined)
    const [finished, setFinished] = useState(false)
    const [round, setRound] = useState(0)
    const [nextRoundAt, setNextRoundAt] = useState(undefined)

    console.log('test', players)

    const contextData = {
        gameId, setGameId,
        board, setBoard,
        players, setPlayers,
        scores, setScores,
        finished, setFinished,
        moves, setMoves,
        moveFrom, setMoveFrom,
        moveTo, setMoveTo,
        round, setRound,
        nextRoundAt, setNextRoundAt
    }

    return (
        <GameContext.Provider value={contextData}>
            { children }
        </GameContext.Provider>
    )
}
