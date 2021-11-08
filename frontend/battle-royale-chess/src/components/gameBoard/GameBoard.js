import { useEffect, useState } from 'react'

import { GameContext } from '../../contexts/GameContext.js'

export default function GameBoard({ makeMove }){

    const { board, players, moveFrom, moveTo } = useContext(GameContext)

    const [rows, setRows] = useState([])
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [cellSize, setCellSize] = useState(100)
    const [pieceStyle, setPieceStyle] = useState('outlined')

    useEffect(() => {

        const colKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[1] - b.split(":")[1])
        const rowKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[0] - b.split(":")[0])

        const rows = []

        if(colKeysSorted.length > 0 && rowKeysSorted.length > 0){

            const colsAmount = colKeysSorted[colKeysSorted.length - 1].split(":")[1]
            const rowsAmount = rowKeysSorted[rowKeysSorted.length - 1].split(":")[0]

            setWidth(`${colsAmount * cellSize} !important`)
            setHeight(`${rowsAmount * cellSize} !important`)

            for(let i = 1; i <= rowsAmount; i++){

                const row = []

                for(let j = 1; j <= colsAmount; j++){

                    const key = i + ':' + j
                    const tile = board[key]

                    if(tile === undefined) row.push(<td key={key}></td>)}

                    if(tile !== undefined){

                        const tileState = tile[0]
                        const indexOfPlayerOnTile = parseFloat(tile[1]) - 1
                        const pieceOnTile = tile[2]
                        const isLastTileFading = i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2) ? true : false

                        const classList = { tile:styles.tile, td:styles.td }

                        if(tileState === 'faded') classList.faded = styles.faded
                        if(isLastTileFading) classList.isLastTileFading = styles.isLastTileFading
                        if(moveFrom === key || moveTo === key && tileState !== 'faded') classList.isSelected = styles.isSelected
                        if(indexOfPlayerOnTile === players.indexOf(username) && tileState !== 'faded' && moveFrom === undefined && round > 0) classList.hoverable = styles.hoverable
                        if(indexOfPlayerOnTile !== players.indexOf(username) && tileState !== 'faded' && moveTo === key && round > 0) classList.hoverable = styles.hoverable

                        const classListJoined = Object.values(classList).join(" ")

                        row.push(
                            <td key={key} className={classListJoined} onClick={() => makeMove(key) }>
                                { piece !== undefined ? <Piece type={pieceOnTile} pieceStyle={pieceStyle} index={indexOfPlayerOnTile}/> : null }
                            </td>
                        )

                    }

                }

                rows.push(
                    <tr key={i} className={styles.tr}>
                        {row}
                    </tr>
                )

            }

        }

    }, [board, players, moveFrom, moveTo])

    return (
        <div>
            <table className={styles.table} style={{ width:width, height:`${tableHeight} !important`}}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )

}