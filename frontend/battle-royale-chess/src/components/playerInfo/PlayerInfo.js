import { UserContext } from '../../contexts/UserContext'
import { GameContext } from '../../contexts/GameContext'

import colors from '../../assets/js/colors'

export default function PlayerInfo({ playerName }){

    const { username } = useContext(UserContext)
    const { board, players, scores, round, moves, moveFrom, moveTo } = useContext(UserContext)

    const [index, setIndex] = useState(undefined)
    const [stroke, setStroke] = useState(undefined)
    const [fill, setFill] = useState(undefined)
    const [pieceStyle, setPieceStyle] = useState('outlined')
    const [score, setScore] = useState(0)
    const [currentMove, setCurrentMove] = useState('-')
    const [lastMove, setLastMove] = useState('-')
    const [piecesLeft, setPiecesLeft] = useState([])
    const [color, setColor] = useState({})
    const [position, setPosition] = useState(undefined)

    useEffect(() => {

        const index = players.indexOf(playerName)
        const { stroke, fill } = colors.get('pieces', index)
        const position = getPosition(players.length, index)
        const color = colors.pieces(index)

        setIndex(index)
        setStroke(stroke)
        setFill(fill)
        setColor(color)
        setPosition(position)

    }, [players])

    useEffect(() => {

        setScore(scores[index] || 0)

    }, [scores])

    useEffect(() => {

        let move

        if(moveFrom === undefined) setCurrentMove('-')
        if(moveFrom !== undefined && moveTo === undefined) setCurrentMove(moveFrom)
        ifmoveFrom !== undefined && moveTo !== undefined) setCurrentMove(moveFrom + ' > ' + moveTo)

    }, [moveFrom, moveTo])

    useEffect(() => {

        const movesThisRound = moves[round] || []
        const move = movesThisRound[index]

        if(move !== undefined && move !== null){
            setLastMove(move.replace('>', ' > '))
        }

        if(move === undefined || move === null){
            setLastMove('-')
        }

    }, [round, moves])

    useEffect(() => {

        const allAlivePiecesOfPlayer = []

        for(let tile in board){

            const tileState = tile[0]
            const playerIndex = tile[1] - 1
            const piece = tile[2]

            if(
                tileState === 'normal' &&
                playerIndex === index &&
                piece !== undefined
            ){

                allAlivePiecesOfPlayer.push(piece)

            }

        }

        const allAlivePiecesOfPlayerSorted = allAlivePiecesOfPlayer.sort((a, b) => getPieceWorth(a) - getPieceWorth(b))

        setPiecesLeft(allAlivePiecesOfPlayerSorted)

    }, [board])

    function getPosition(numberOfPlayers, index){

        switch (numberOfPlayers) {
            case 2: return position = ['s3', 's4'][index]
            case 3: return position = ['s0', 's1', 's2'][index]
            case 4: return position = ['s0', 's1', 's2', 's5'][index]
            case 5: return position = ['s0', 's1', 's3', 's2', 's5'][index]
            case 6: return position = ['s0', 's1', 's3', 's4', 's2', 's5'][index]
            case 7: return position = ['s0', 's1', 's3', 's4', 's2', 's6', 's5'][index]
            case 8: return position = ['s0', 's1', 's3', 's4', 's2', 's7', 's8', 's5'][index]

            }

    }

    function getPieceWorth(piece){

        switch (piece){
            case "King": return 18
            case "Queen": return 9
            case "Tower": return 5
            case "Bishop": return 3
            case "Knight": return 2
            case "Pawn": return 1
        }

    }

    return (
        <div className={styles[position]}>
            <div className={styles.outer}>
                <div className={styles.inner}>
                    <div className={styles.playerName} style={color.stroke}>
                        {players[index]}
                    </div>
                    <div className={styles.subjectContainer}>
                        <div className={styles.subject}>
                            Score
                        </div>
                        <div className={styles.value}>
                            {score}
                        </div>
                    </div>
                    <div className={styles.subjectContainer}>
                        <div className={styles.subject}>
                            Current move
                        </div>
                        <div className={styles.value}>
                            {currentMove}
                        </div>
                    </div>
                    <div className={styles.subjectContainer}>
                        <div className={styles.subject}>
                            Last move
                        </div>
                        <div className={styles.value}>
                            {lastMove}
                        </div>
                    </div>
                    <div className={styles.subjectContainer}>
                        <div className={styles.value}>
                            { allAlivePiecesOfPlayerSorted.map(p => <Piece type={p} styling={pieceStyle} color={color} />) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
