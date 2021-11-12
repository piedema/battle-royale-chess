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
    const [zoomLevel, setZoomLevel] = useState(1)
    const [gametype, setGametype] = useState({})
    const [gameStartedAt, setGameStartedAt] = useState(undefined)
    const [gameEndedAt, setGameEndedAt] = useState(undefined)
    const [boardPosition, setBoardPosition] = useState({ top:'50%', left:'50%' })

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
        nextRoundAt, setNextRoundAt,
        resetGameContext,
        zoomLevel, setZoomLevel,
        gametype, setGametype,
        gameStartedAt, setGameStartedAt,
        gameEndedAt, setGameEndedAt,
        boardPosition, setBoardPosition
    }

    function resetGameContext(){

        setGameId(undefined)
        setBoard({})
        setPlayers([])
        setScores([])
        setMoves({})
        setMoveFrom(undefined)
        setMoveTo(undefined)
        setFinished(false)
        setRound(0)
        setNextRoundAt(undefined)
        setGametype({})
        setGameStartedAt(undefined)
        setGameEndedAt(undefined)
        setBoardPosition({ top:'50%', left:'50%' })

    }

    return (
        <GameContext.Provider value={contextData}>
            { children }
        </GameContext.Provider>
    )
}
