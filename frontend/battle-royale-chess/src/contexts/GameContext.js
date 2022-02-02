import { createContext, useState } from 'react'

export const GameContext = createContext({})

export default function GameContextProvider({ children }){

    // store all values used while playing the game itself

    const [gameId, setGameId] = useState(undefined)
    const [board, setBoard] = useState(undefined)
    const [players, setPlayers] = useState([])
    const [scores, setScores] = useState(undefined)
    const [moves, setMoves] = useState(undefined)
    const [moveFrom, setMoveFrom] = useState(undefined)
    const [moveTo, setMoveTo] = useState(undefined)
    const [finished, setFinished] = useState(undefined)
    const [round, setRound] = useState(undefined)
    const [nextRoundAt, setNextRoundAt] = useState(undefined)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [gametype, setGametype] = useState(undefined)
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
        setBoard(undefined)
        setPlayers([])
        setScores(undefined)
        setMoves(undefined)
        setMoveFrom(undefined)
        setMoveTo(undefined)
        setFinished(undefined)
        setRound(undefined)
        setNextRoundAt(undefined)
        setGametype(undefined)
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
