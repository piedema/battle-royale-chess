export default function GameBoard(){

    const colKeysSorted = Object.keys(newBoard).sort((a, b) => { return a.split(":")[1] - b.split(":")[1]})
    const rowKeysSorted = Object.keys(newBoard).sort((a, b) => { return a.split(":")[0] - b.split(":")[0]})

    const rows = []
    const cols = []

    const cellSize = 100

    let colsAmount, rowsAmount, tableWidth, tableHeight

    if(colKeysSorted.length > 0 && rowKeysSorted.length > 0){

        colsAmount = colKeysSorted[colKeysSorted.length - 1].split(":")[1]
        rowsAmount = rowKeysSorted[rowKeysSorted.length - 1].split(":")[0]

        tableWidth = colsAmount * cellSize
        tableHeight = rowsAmount * cellSize

        for(let i = 1; i <= rowsAmount; i++){

            const row = []

            for(let j = 1; j <= colsAmount; j++){

                const tile = newBoard[`${i}:${j}`]

                if(tile === undefined){

                    row.push(
                        <td key={`${i}:${j}`} className={styles.td}></td>
                    )

                }

                if(tile !== undefined){

                    const piece = tile[2]
                    const playerIndex = parseFloat(tile[1]) - 1
                    const key = i + ':' + j
                    const classes = { tile:styles.tile, td:styles.td }

                    if(tile[0] === 'faded') classes.faded = styles.faded
                    if(playerIndex === players.indexOf(username) && tile[0] !== 'faded' && moveFrom === undefined && round > 0) classes.hasOwnPiece = styles.hasOwnPiece
                    if(moveFrom === key || moveTo === key) classes.isSelected = styles.isSelected
                    if(players[playerIndex] !== username && tile[0] !== 'faded' && moveFrom !== undefined) classes.hasOtherPiece = styles.hasOtherPiece
                    if(i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2)) classes.winningTile = styles.winningTile

                    row.push(
                        <td key={key} className={Object.values(classes).join(" ")} onClick={() => { scheduleMove(key) }}>
                            { piece !== undefined ? <Piece type={piece} styling="outlined" playerIndex={playerIndex}/> : null }
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

    return (
        <div>
            <table className={styles.table} style={{ width:`${tableWidth} !important`, height:`${tableHeight} !important`}}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )

}
