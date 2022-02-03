import { useEffect, useState, useContext, createRef } from 'react'

import Draggable from "react-draggable"

import { UserContext } from '../../contexts/UserContext.js'
import { GameContext } from '../../contexts/GameContext.js'
import { SettingsContext } from '../../contexts/SettingsContext.js'

import Piece from '../../components/piece/Piece'

import styles from './GameBoard.module.css'

import colors from '../../assets/js/colors'

// makeMove is a function that is called when the player selects a tile.
// the provided function checks if it is a first or second selected tile (move piece from or to tile)
export default function GameBoard({ makeMove }){

    // some states to be used for the gameboard
    const { username } = useContext(UserContext)
    const { board, players, moveFrom, moveTo, round, finished, boardPosition, setBoardPosition, gametype } = useContext(GameContext)
    const { piecesStyle } = useContext(SettingsContext)

    const [boardJSX, setBoardJSX] = useState([])                                // stores the gameboard in JSX to be displayed
    const [width, setWidth] = useState(0)                                       // width in pixels (tiles * tile/cell width)
    const [height, setHeight] = useState(0)                                     // height in pixels (tiles * tile/cell height)

    // this hook recreates the board JSX on every state change
    useEffect(() => {

        // exit if some of the states are not defined yet
        if(
            board === undefined
            || players === undefined
            || round === undefined
            || finished === undefined
            || boardPosition === undefined
            || gametype === undefined
        ) return

        const cellSize = 100                                                    // size of the cells of the board
        const pieceStyle = piecesStyle()                                        // style of the chesspieces

        // each tile in the board object has a number as key, for example 1:1 or 4:16. These represent row and column (row:column)
        // first get an array bwith all columns and then an array with all rows and sorted
        const colKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[1] - b.split(":")[1])
        const rowKeysSorted = Object.keys(board).sort((a, b) => a.split(":")[0] - b.split(":")[0])

        // the rows will contain all the table rows with the tiles in JSX format
        const rows = []

        const { circleShrinkAfterNRounds, circleShrinkOffset } = gametype

        // the remaining rounds it takes before the board gets smaller.
        // round = the current round the game is in
        // circleShrinkOffset = after how many rounds after game has started is the first shrink
        // circleShrinkAfterNRounds = the interval of rounds when the board shrinks
        const circleShrinkInNRounds = (
            round > circleShrinkOffset
            ? circleShrinkAfterNRounds - ((round % circleShrinkAfterNRounds) % circleShrinkAfterNRounds)
            : (circleShrinkOffset - round) + (circleShrinkAfterNRounds - (circleShrinkOffset % circleShrinkAfterNRounds))
        )

        // number of rounds which are left before the board shrinks
        // this number is indicated on the board tiles
        const roundsLeft = circleShrinkInNRounds === circleShrinkAfterNRounds && round > circleShrinkOffset ? 0 : circleShrinkInNRounds

        // proceed when there is more then 0 columns and rows
        if(colKeysSorted.length > 0 && rowKeysSorted.length > 0){

            // get the last item in column and row array and split to have the total number of columsn and rows
            const colsAmount = colKeysSorted[colKeysSorted.length - 1].split(":")[1]
            const rowsAmount = rowKeysSorted[rowKeysSorted.length - 1].split(":")[0]

            // size of the board will be columns * cellsize and rows * cellsize
            setWidth(`${colsAmount * cellSize} !important`)
            setHeight(`${rowsAmount * cellSize} !important`)

            // loop all rows to create rows of the table
            for(let i = 1; i <= rowsAmount; i++){

                const row = []

                // loop all columns to create the cells of the table
                for(let j = 1; j <= colsAmount; j++){

                    const key = i + ':' + j                                     // recreate the keycombination of row:column
                    const tile = board[key]                                     // get the data from the board (such as the state of the tile, piece and player on tile)

                    // create an empty table cell when this tile isn't represented in the board object
                    if(tile === undefined) row.push(<td key={key} className={styles.td}></td>)

                    // create a table cell when it is referenced
                    if(tile !== undefined){

                        const tileState = tile[0]                               // the state of the tile (for now only "normal")
                        const indexOfPlayerOnTile = parseFloat(tile[1]) - 1     // player number of tile or undefined when there is no player on tile
                        const pieceOnTile = tile[2]                             // pievce on tile, again undeifned when there is no piece on tile
                        // this is the middle tile (horizontal and vertical) of the board, it is the last tile of the board. it gets special styling
                        const isLastTileFading = i === Math.ceil(rowsAmount / 2) && j === Math.ceil(colsAmount / 2) ? true : false
                        const color = colors.pieces(indexOfPlayerOnTile)        // get the color styling to use for the pieces and playerInfo. referenced by player index/temporary id

                        // these are the tiles next to the currently created tile
                        // this checks if one of these tiles is faded.
                        // If so, show the rounds before this tile will fade on the tile itself (in red)
                        const topTile = board[i-1+':'+j]
                        const bottomTile = board[i+1+':'+j]
                        const leftTile = board[i+':'+(j-1)]
                        const rightTile = board[i+':'+(j+1)]

                        const tileFadesSoon = (
                            round > 0 &&                                        // tiles can only fade when the game is started
                            tileState !== 'faded' &&                            // tiles can not fade when they are faded already
                            finished !== true &&                                // tiles can not fade when game is finished
                            (
                                topTile === undefined || topTile[0] === 'faded' ||
                                bottomTile === undefined || bottomTile[0] === 'faded' ||
                                leftTile === undefined || leftTile[0] === 'faded' ||
                                rightTile === undefined || rightTile[0] === 'faded'
                            )
                            ? roundsLeft                                        // tile fades soon, show rounds left ion tile
                            : null
                        )

                        // the classList variable will hold all classes which will be applied
                        const classList = { tile:styles.tile, td:styles.td }

                        // if tile is faded apply faded style
                        if(tileState === 'faded') classList.faded = styles.faded
                        // if this is the last tile, apply last tile style
                        if(isLastTileFading) classList.lastTileFading = styles.lastTileFading
                        // when this tile is selected as a from or to tile and it is not faded and game is not finished apply selected style
                        if((moveFrom === key || moveTo === key) && tileState !== 'faded' && finished === false) classList.isSelected = styles.isSelected
                        // apply hoverable style when the player on this tile is the current player, tile is not faded and moveFrom is undefined (this happens when player wants to select his own piece to move)
                        if(indexOfPlayerOnTile === players.indexOf(username) && tileState !== 'faded' && moveFrom === undefined && round > 0 && finished === false) classList.hoverable = styles.hoverable
                        // apply hoverable style when the tile is empty or contains another player, tile is not faded and moveFrom is not equal to undefined (this means player wants to select a tile to move his piece to)
                        if(indexOfPlayerOnTile !== players.indexOf(username) && tileState !== 'faded' && round > 0 && finished === false && moveFrom !== undefined) classList.hoverable = styles.hoverable

                        // join classes to apply all styles on table cell
                        const classListJoined = Object.values(classList).join(" ")

                        // each tile has a row:number key. We want the rows to be a letter
                        let rowInChar = ''
                        let nRowChars = Math.ceil(i / 26)                       // when the number of rows exceeds 26 we want 2 letters of the same kind, ie tile BB or CC
                        let char = i % 26                                       // the position in the alphabet we want

                        for(let k = 0; k < nRowChars; k++){                     // itterate for each amount of letters

                            rowInChar += String.fromCharCode(char+64)           // add the letter by number. the alphabet starts with number 64, so a = 64, z = 90

                        }

                        // add the tile to our row
                        // if there is a piece on the tile, add it here by using the Piece component
                        // add the key/id of the tile (shown in topleft)
                        // show the number of rounds left before the tile fades in bottom right
                        row.push(
                            <td key={key} className={classListJoined} onClick={() => makeMove(key) }>
                                { pieceOnTile !== undefined ? <Piece type={pieceOnTile} styling={pieceStyle} color={color}/> : null }
                                <div className={styles.tileId}>{rowInChar + j}</div>
                                { tileFadesSoon !== null && <div className={styles.tileFadesSoon}>{tileFadesSoon}</div> }
                            </td>
                        )

                    }

                }

                // add the full row to our rows array
                rows.push(
                    <tr key={i} className={styles.tr}>
                        {row}
                    </tr>
                )

            }

            setBoardJSX(rows)

        }

    }, [board, players, moveFrom, moveTo, username, round, finished, gametype, boardPosition])

    // Dragable component makes the board dragable. Handy for larger boards on smaller screens. The board is also zoomable in the Game component
    // the width and height on the table is calculated from number of rows and columns * 100px. This is to preserve ratio of the cells
    return (
        <div className={styles.container}>
            <Draggable>
                <div>
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
