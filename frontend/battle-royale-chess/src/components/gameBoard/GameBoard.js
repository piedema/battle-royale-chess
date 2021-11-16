import { useEffect, useState, useContext, useRef } from 'react'

import Draggable from "react-draggable"

import { UserContext } from '../../contexts/UserContext.js'
import { GameContext } from '../../contexts/GameContext.js'

import Piece from '../../components/piece/Piece'

import styles from './GameBoard.module.css'

import colors from '../../assets/js/colors'

export default function GameBoard({ makeMove }){

    const dragRef = useRef()

    const { username } = useContext(UserContext)
    const { board, players, moveFrom, moveTo, round, finished, gametype, boardPosition, setBoardPosition } = useContext(GameContext)

    const [boardJSX, setBoardJSX] = useState([])
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    console.log(gametype)

    useEffect(() => {

        const cellSize = 100
        const pieceStyle = localStorage.getItem('piecesStyle') || 'outlined'

        const colKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[1] - b.split(":")[1])
        const rowKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[0] - b.split(":")[0])

        const rows = []

        const { circleShrinkAfterNRounds, circleShrinkOffset } = gametype

        const circleShrinkInNRounds = (
            round > circleShrinkOffset
            ? circleShrinkAfterNRounds - ((round % circleShrinkAfterNRounds) % circleShrinkAfterNRounds)
            // : (circleShrinkAfterNRounds - ((round % circleShrinkAfterNRounds) % circleShrinkAfterNRounds)) + circleShrinkOffset
            : (circleShrinkOffset - round) + (circleShrinkAfterNRounds - (circleShrinkOffset % circleShrinkAfterNRounds))
        )

        const roundsLeft = circleShrinkInNRounds === circleShrinkAfterNRounds && round > circleShrinkOffset ? 0 : circleShrinkInNRounds

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

                    if(tile === undefined) row.push(<td key={key} className={styles.td}></td>)

                    if(tile !== undefined){

                        const tileState = tile[0]
                        const indexOfPlayerOnTile = parseFloat(tile[1]) - 1
                        const pieceOnTile = tile[2]
                        const isLastTileFading = i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2) ? true : false
                        const color = colors.pieces(indexOfPlayerOnTile)

                        const topTile = board[i-1+':'+j]
                        const bottomTile = board[i+1+':'+j]
                        const leftTile = board[i+':'+(j-1)]
                        const rightTile = board[i+':'+(j+1)]

                        const tileFadesSoon = (
                            round > 0 &&
                            tileState !== 'faded' &&
                            finished !== true &&
                            (
                                topTile === undefined || topTile[0] === 'faded' ||
                                bottomTile === undefined || bottomTile[0] === 'faded' ||
                                leftTile === undefined || leftTile[0] === 'faded' ||
                                rightTile === undefined || rightTile[0] === 'faded'
                            )
                            ? roundsLeft
                            : null
                        )

                        const classList = { tile:styles.tile, td:styles.td }

                        if(tileState === 'faded') classList.faded = styles.faded
                        if(isLastTileFading) classList.lastTileFading = styles.lastTileFading
                        if((moveFrom === key || moveTo === key) && tileState !== 'faded' && finished === false) classList.isSelected = styles.isSelected
                        if(indexOfPlayerOnTile === players.indexOf(username) && tileState !== 'faded' && moveFrom === undefined && round > 0 && finished === false) classList.hoverable = styles.hoverable
                        if(indexOfPlayerOnTile !== players.indexOf(username) && tileState !== 'faded' && round > 0 && finished === false && moveFrom !== undefined) classList.hoverable = styles.hoverable

                        const classListJoined = Object.values(classList).join(" ")

                        row.push(
                            <td key={key} className={classListJoined} onClick={() => makeMove(key) }>
                                { pieceOnTile !== undefined ? <Piece type={pieceOnTile} styling={pieceStyle} color={color}/> : null }
                                <div className={styles.tileId}>{i + ' ' + j}</div>
                                { tileFadesSoon !== null && <div className={styles.tileFadesSoon}>{tileFadesSoon}</div> }
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

            setBoardJSX(rows)

        }

    }, [board, players, moveFrom, moveTo, username, round, finished])

    return (
        <div className={styles.container}>
            <Draggable dragRef={dragRef}>
                <div ref={dragRef}>
                    <table className={styles.table} style={{ width:width, height:height}}>
                        <tbody>
                            {boardJSX}
                        </tbody>
                    </table>
                </div>
            </Draggable>
        </div>
    )

}
