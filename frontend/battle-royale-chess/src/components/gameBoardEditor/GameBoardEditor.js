import { useEffect, useState, useContext, createRef } from 'react'

import Piece from '../../components/piece/Piece'

import styles from './GameBoardEditor.module.css'

import colors from '../../assets/js/colors'

export default function GameBoardEditor({ gameBoard }){

    const [boardJSX, setBoardJSX] = useState([])
    const [cols, setCols] = useState(15)
    const [rows, setRows] = useState(15)

    // useEffect(() => {
    //
    //     const cellSize = 100
    //     const pieceStyle = localStorage.getItem('piecesStyle') || 'outlined'
    //
    //     // const colKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[1] - b.split(":")[1])
    //     // const rowKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[0] - b.split(":")[0])
    //
    //     const rows = []
    //
    //     // const { circleShrinkAfterNRounds, circleShrinkOffset } = gametype
    //     //
    //     // const circleShrinkInNRounds = (
    //     //     round > circleShrinkOffset
    //     //     ? circleShrinkAfterNRounds - ((round % circleShrinkAfterNRounds) % circleShrinkAfterNRounds)
    //     //     // : (circleShrinkAfterNRounds - ((round % circleShrinkAfterNRounds) % circleShrinkAfterNRounds)) + circleShrinkOffset
    //     //     : (circleShrinkOffset - round) + (circleShrinkAfterNRounds - (circleShrinkOffset % circleShrinkAfterNRounds))
    //     // )
    //     //
    //     // const roundsLeft = circleShrinkInNRounds === circleShrinkAfterNRounds && round > circleShrinkOffset ? 0 : circleShrinkInNRounds
    //     //
    //     // if(colKeysSorted.length > 0 && rowKeysSorted.length > 0){
    //     //
    //     //     const colsAmount = colKeysSorted[colKeysSorted.length - 1].split(":")[1]
    //     //     const rowsAmount = rowKeysSorted[rowKeysSorted.length - 1].split(":")[0]
    //     //
    //     //     setWidth(`${colsAmount * cellSize} !important`)
    //     //     setHeight(`${rowsAmount * cellSize} !important`)
    //     //
    //     //     for(let i = 1; i <= rowsAmount; i++){
    //     //
    //     //         const row = []
    //     //
    //     //         for(let j = 1; j <= colsAmount; j++){
    //     //
    //     //             const key = i + ':' + j
    //     //             const tile = board[key]
    //     //
    //     //             if(tile === undefined) row.push(<td key={key} className={styles.td}></td>)
    //     //
    //     //             if(tile !== undefined){
    //     //
    //     //                 const tileState = tile[0]
    //     //                 const indexOfPlayerOnTile = parseFloat(tile[1]) - 1
    //     //                 const pieceOnTile = tile[2]
    //     //                 const isLastTileFading = i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2) ? true : false
    //     //                 const color = colors.pieces(indexOfPlayerOnTile)
    //     //
    //     //                 const topTile = board[i-1+':'+j]
    //     //                 const bottomTile = board[i+1+':'+j]
    //     //                 const leftTile = board[i+':'+(j-1)]
    //     //                 const rightTile = board[i+':'+(j+1)]
    //     //
    //     //                 const tileFadesSoon = (
    //     //                     round > 0 &&
    //     //                     tileState !== 'faded' &&
    //     //                     finished !== true &&
    //     //                     (
    //     //                         topTile === undefined || topTile[0] === 'faded' ||
    //     //                         bottomTile === undefined || bottomTile[0] === 'faded' ||
    //     //                         leftTile === undefined || leftTile[0] === 'faded' ||
    //     //                         rightTile === undefined || rightTile[0] === 'faded'
    //     //                     )
    //     //                     ? roundsLeft
    //     //                     : null
    //     //                 )
    //     //
    //     //                 const classList = { tile:styles.tile, td:styles.td }
    //     //
    //     //                 if(tileState === 'faded') classList.faded = styles.faded
    //     //                 if(isLastTileFading) classList.lastTileFading = styles.lastTileFading
    //     //                 if((moveFrom === key || moveTo === key) && tileState !== 'faded' && finished === false) classList.isSelected = styles.isSelected
    //     //                 if(indexOfPlayerOnTile === players.indexOf(username) && tileState !== 'faded' && moveFrom === undefined && round > 0 && finished === false) classList.hoverable = styles.hoverable
    //     //                 if(indexOfPlayerOnTile !== players.indexOf(username) && tileState !== 'faded' && round > 0 && finished === false && moveFrom !== undefined) classList.hoverable = styles.hoverable
    //     //
    //     //                 const classListJoined = Object.values(classList).join(" ")
    //     //
    //     //                 row.push(
    //     //                     <td key={key} className={classListJoined} onClick={() => makeMove(key) }>
    //     //                         { pieceOnTile !== undefined ? <Piece type={pieceOnTile} styling={pieceStyle} color={color}/> : null }
    //     //                         <div className={styles.tileId}>{i + ' ' + j}</div>
    //     //                         { tileFadesSoon !== null && <div className={styles.tileFadesSoon}>{tileFadesSoon}</div> }
    //     //                     </td>
    //     //                 )
    //     //
    //     //             }
    //     //
    //     //         }
    //     //
    //     //         rows.push(
    //     //             <tr key={i} className={styles.tr}>
    //     //                 {row}
    //     //             </tr>
    //     //         )
    //     //
    //     //     }
    //     //
    //     //     setBoardJSX(rows)
    //     //
    //     // }
    //
    // }, [])

    useEffect(() => {

        let wantedCols, wantedRows

        if(gameBoard !== undefined){

            // set cols and rows to match gameBoard
            wantedCols = Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0]
            wantedRows = Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0]

        }

        if(gameBoard === undefined){

            wantedCols = cols
            wantedRows = rows

        }

        const adjustedGameBoard = {}

        for(let i = 0; i < wantedRows; i++){

            for(let j = 0; j < wantedCols; j++){

                const key = j + ':' + i

                if(gameBoard !== undefined && gameBoard[key] !== undefined) adjustedGameBoard[key] = gameBoard[key]
                if(gameBoard === undefined || gameBoard[key] === undefined) adjustedGameBoard[key] = ['normal']

            }

        }

        generateBoardJSX(adjustedGameBoard)

    }, [gameBoard, cols, rows])

    function handleColsInputChange(c){

        if(c % 2 === 0){

            return alert('cannot generate due to even columns')

        }

        setCols(c)

    }

    function handleRowsInputChange(r){

        if(r % 2 === 0){

            return alert('cannot generate due to even rows')

        }

        setRows(r)

    }

    function generateBoardJSX(adjustedGameBoard){

        console.log(adjustedGameBoard)

        const gameBoardCols = Object.keys(adjustedGameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0]
        const gameBoardRows = Object.keys(adjustedGameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0]

        const jsx = []

        for(let i = 0; i <= gameBoardRows; i++){

            const row = []

            for(let j = 0; j <= gameBoardCols; j++){

                row.push(<td key={j} className={`${styles.td} ${styles.tile}`}></td>)

            }

            jsx.push(
                <tr key={i} className={styles.tr}>
                    {row}
                </tr>
            )

        }

        setBoardJSX(jsx)

    }

    return (
        <div className={styles.container}>
            <div className={styles.pair}>
                <div className={styles.name}>
                    <div>
                        Number of horizontal tiles
                    </div>
                </div>
                <div className={styles.value}>
                    <input type="number" name="colsInput" value={cols} onChange={event => handleColsInputChange(event.target.value)} />
                </div>
            </div>
            <div className={styles.pair}>
                <div className={styles.name}>
                    <div>
                        Number of vertical tiles
                    </div>
                </div>
                <div className={styles.value}>
                    <input type="number" name="rowsInput" value={rows} onChange={event => handleRowsInputChange(event.target.value)} />
                </div>
            </div>
            <table className={styles.table}>
                <tbody>
                    {boardJSX}
                </tbody>
            </table>
        </div>
    )

}
