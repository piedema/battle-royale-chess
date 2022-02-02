import { useEffect, useState, useContext, createRef } from 'react'

import { SettingsContext } from '../../contexts/SettingsContext.js'

import deepCopy from '../../helpers/deepCopy'

import Piece from '../../components/piece/Piece'

import styles from './GameBoardEditor.module.css'

import colors from '../../assets/js/colors'

// getting gameBoard from gametypes page
export default function GameBoardEditor({ gameBoard, setGameBoard }){

    const { piecesStyle } = useContext(SettingsContext)

    const [boardJSX, setBoardJSX] = useState([])                                // stores the gameBoard in JSX to be displayed
    const [selectedTile, setSelectedTile] = useState(undefined)                 // the tile which is currently selected to be edited

    const possibleTileStates = ['normal', 'inactive']                           // currently 2 states (normal is a normal chessboard tile and inactive is an invisible tile where pices can't move to)

    // useEffect generates the JSX of the gameBoard
    useEffect(() => {

        // only continue if gameBoard is provided
        if(gameBoard !== undefined){

            // get the amount of rows and columns of the gameBoard
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // continue if the selected tile is set (the setted value is the key of the tile)
            if(selectedTile !== undefined){

                // split the key to get the place in row and column
                const selectedTileSplitted = selectedTile.split(':')

                // if the selected tile is outside the gameBoard, unset selectedTile.
                // this happens when a tile is selected and the the board is made smaller
                if(selectedTileSplitted[0] > gameBoardRows || selectedTileSplitted[1] > gameBoardCols){

                    setSelectedTile(undefined)

                }
            }

            // create jsx array to hold all the jsx
            const jsx = []

            // loop over all rows
            for(let i = 1; i <= gameBoardRows; i++){

                const row = []

                // loop over all columns
                for(let j = 1; j <= gameBoardCols; j++){

                    // create the key for the current tile
                    const tileKey = i + ':' + j

                    // if the tileKey does not exist in gameBoard then it is not a existing tile. provide an empty tile then
                    // this makes it possible to create boards which are in various shapes, with gaps etc
                    if(gameBoard[tileKey] === undefined){

                        // by clicking on an inactive tile you can give it a "normal" state
                        row.push(
                            <td
                                key={tileKey}
                                className={`${styles.td} ${styles.inactive} ${selectedTile === tileKey ? styles.isSelected : ''}`}
                                onClick={evt => { setSelectedTile(tileKey) }}>
                            </td>
                        )

                    }

                    // continue if the tile exists and is of "normal" state
                    if(gameBoard[tileKey] !== undefined && gameBoard[tileKey][0] === 'normal'){

                        // if there is a piece on the tile pieceOnTile will not be undefined
                        const pieceOnTile = gameBoard[tileKey][2]
                        // the second position in the tile array is the player number (player numbers start with 1)
                        // subtract one and you can get the corresponding player color from the colors file
                        const color = colors.pieces(parseFloat(gameBoard[tileKey][1]) - 1)

                        // push the tile to the row including a piece in the right styling and colors
                        row.push(
                            <td
                                key={tileKey}
                                className={`${styles.td} ${styles.active} ${selectedTile === tileKey ? styles.isSelected : ''}`}
                                onClick={evt => { setSelectedTile(tileKey) }}>
                                {
                                    pieceOnTile !== undefined
                                    ? (
                                        <Piece
                                        type={pieceOnTile}
                                        styling={piecesStyle()}
                                        color={color}
                                        w={40}
                                        h={40} />
                                    )
                                    : null
                                }
                            </td>
                        )

                    }

                }

                // push the entire row to the jsx array
                jsx.push(
                    <tr key={i} className={styles.tr}>
                        {row}
                    </tr>
                )

            }

            setBoardJSX(jsx)

        }

        // if gameboard is not provided, generate a default gameBoard (this happens when creating a new gametype)
        // after setting this default gameBoard the useEffect function will run again to display this default gameBoard
        if(gameBoard === undefined){

            setGameBoard({
                "1:1":['normal'],
                "1:2":['normal'],
                "1:3":['normal'],
                "2:1":['normal'],
                "2:2":['normal'],
                "2:3":['normal'],
                "3:1":['normal'],
                "3:2":['normal'],
                "3:3":['normal']
            })

        }

    }, [gameBoard, selectedTile])

    // this function removes 2 rows or 2 columns from the top, bottom, left or right
    // this way it is easy to resize the gameBoard without having to move all pieces
    function removeTiles(e, position){

        e.preventDefault()

        if(position === 'top'){

            // create new gameBoard
            const newGameBoard = {}

            // get number of columns and rows
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // skip if there are less then 5 rows, this is the minimum amount of rows
            if(gameBoardRows < 5) return

            // loop over all existing tiles in gameBoard
            for(let key in gameBoard){

                // split the key to create the new keys
                const keySplitted = key.split(':')
                // the new key exist of the old row - 2 rows (because the top 2 rows get deleted) and the old column id)
                const newKey = parseFloat(keySplitted[0]) + -2 + ':' + keySplitted[1]

                // if the old key row id was bigger than 2 then add this row to the new gameboard. this skips the old first and second row
                if(keySplitted[0] > 2) newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'right'){

            // copy existing gameBoard
            const newGameBoard = deepCopy(gameBoard)

            // get number of columns and rows
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // skip if there are less then 5 columns, this is the minimum amount of columns
            if(gameBoardCols < 5) return

            // loop over all rows
            for(let i = 1; i <= gameBoardRows; i++){

                // start looping the columns at the second last column. delete this and the last column from the new gameBoard
                for(let j = gameBoardCols - 1; j < gameBoardCols + 1; j++){

                    const key = i + ':' + j

                    delete newGameBoard[key]

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'bottom'){

            // copy existing gameBoard
            const newGameBoard = deepCopy(gameBoard)

            // get number of columns and rows
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // skip if there are less then 5 rows, this is the minimum amount of rows
            if(gameBoardRows < 5) return

            // start looping the rows at the second last row. delete this and the last row from the new gameBoard
            for(let i = gameBoardRows - 1; i < gameBoardRows + 1; i++){

                // remove all columns at these rows
                for(let j = 1; j <= gameBoardCols; j++){

                    const key = i + ':' + j

                    delete newGameBoard[key]

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'left'){

            // create new gameboard
            const newGameBoard = {}

            // get number of columns and rows
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])

            // skip if there are less then 5 columns, this is the minimum amount of columns
            if(gameBoardCols < 5) return

            // loop over all existing tiles in gameBoard
            for(let key in gameBoard){

                // split the key to create the new keys
                const keySplitted = key.split(':')
                // the new key exist of the row id and old column - 2 columns (because the left 2 columns get deleted)
                const newKey = keySplitted[0] + ':' + (parseFloat(keySplitted[1]) + -2)

                // if the old key column id was bigger than 2 then add this column to the new gameboard. this skips the old first and second column
                if(keySplitted[1] > 2) newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

    }

    function addTiles(e, position){

        e.preventDefault()

        if(position === 'top'){

            // create new gameboard
            const newGameBoard = {}

            // get number of columns
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])

            // create a new row in newGameBoard
            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 1 + ':' + i

                newGameBoard[newKey] = ['normal']

            }

            // create a second new row in gameBoard
            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 2 + ':' + i

                newGameBoard[newKey] = ['normal']

            }

            // make the keys of all other existing rows 2 higher, t accomodate for the 2 extra rows
            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = parseFloat(keySplitted[0]) + 2 + ':' + keySplitted[1]

                newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'right'){

            // copy existing gameBoard
            const newGameBoard = deepCopy(gameBoard)

            // get number of columns and rows
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // loop all rows
            for(let i = 1; i <= gameBoardRows; i++){

                // and the end of each row add 2 columns
                for(let j = gameBoardCols + 1; j < gameBoardCols + 3; j++){

                    const key = i + ':' + j

                    newGameBoard[key] = ['normal']

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'bottom'){

            // copy existing GameBoard
            const newGameBoard = deepCopy(gameBoard)

            // get number of columns and rows
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // start after last row
            for(let i = gameBoardRows + 1; i < gameBoardRows + 3; i++){

                // create a complete new row and add it to newGameboard
                for(let j = 1; j <= gameBoardCols; j++){

                    const key = i + ':' + j

                    newGameBoard[key] = ['normal']

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'left'){

            // create new gameBoard
            const newGameBoard = {}

            // get number of columns and rows
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            // for each row, create a new tile
            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 1

                newGameBoard[newKey] = ['normal']

            }

            // for each row, create a second new tile
            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 2

                newGameBoard[newKey] = ['normal']

            }

            // make the keys of all other existing columns 2 higher, to accomodate for the 2 extra columns
            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = keySplitted[0] + ':' + (parseFloat(keySplitted[1]) + 2)

                newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

    }

    // get the state of the given tileKey
    function getCurrentTileState(tileKey){

        if(gameBoard && gameBoard[tileKey]) return gameBoard[tileKey][0]        // return the tilestate if the tile exists
        return 'inactive'                                                       // otherwise return inactive

    }

    function changeTileState(e, key, newTileState){

        e.preventDefault()

        if(gameBoard === undefined) return

        const newGameBoard = deepCopy(gameBoard)

        if(newTileState === 'normal') newGameBoard[key] = ['normal']            // when a tilestate is made "normal", it didn't exist before in the gameboard so it must be added to the gameboard
        if(newTileState === 'inactive') delete newGameBoard[key]                // tile is made inactive so must be deleted from gameboard object

        setGameBoard(newGameBoard)

    }

    // get the player standing on the given tile if there is a player, otherwise return undefined
    function getCurrentTilePlayer(tileKey){

        if(gameBoard && gameBoard[tileKey] && gameBoard[tileKey][1]) return gameBoard[tileKey][1]
        return undefined

    }

    //
    function getAvailablePlayers(){

        let nPlayersInGameBoard = 0

        // loop all tiles in gameboard
        // if the tile has a player && the player of the tile > the already found players
        // then set nPlayersInGameBoard with this player number
        for(let key in gameBoard){

            if(
                gameBoard[key].length > 1
                && parseFloat(gameBoard[key][1]) > nPlayersInGameBoard
            ){
                nPlayersInGameBoard = parseFloat(gameBoard[key][1])
            }

        }

        const playersArray = []

        // fill playersArray with all players which are on the board + 1 next player number
        // this gets used later when you select a tile. You can then choose a player to place on that tile
        // making sure the next player that isnt on the board yet can also be selcted, you can chronologyadd new players
        for(let i = 1; i <= nPlayersInGameBoard + 1 && i <= 8; i++){

            playersArray.push(i)

        }

        return playersArray
    }

    // place a player on the selected tile if it is of "normal" state
    // the piece is always by default a king
    function setPlayerOnTile(e, key, playerId){

        e.preventDefault()

        if(gameBoard === undefined) return

        const newGameBoard = deepCopy(gameBoard)

        if(newGameBoard[key][0] === 'normal'){
            newGameBoard[key][1] = playerId.toString()
            newGameBoard[key][2] = 'King'
        }

        setGameBoard(newGameBoard)

    }

    // get the piece on the selected tile
    function getCurrentTilePiece(tileKey){

        if(gameBoard && gameBoard[tileKey] && gameBoard[tileKey][2]) return gameBoard[tileKey][2]
        return 'none'

    }

    // get an array with all available pieces
    function getAvailablePieces(){

        return ['King', 'Queen', 'Tower', 'Bishop', 'Knight', 'Pawn']
    }

    // set a piece on the selected tile
    function setPieceOnTile(e, key, piece){

        e.preventDefault()

        if(gameBoard === undefined) return

        const newGameBoard = deepCopy(gameBoard)

        // only if tile state = "normal" and the player is not undefined. You need a player on a tile to change the piece
        if(newGameBoard[key][0] === 'normal' && newGameBoard[key][1] !== undefined){
            newGameBoard[key][2] = piece
        }

        setGameBoard(newGameBoard)

    }

    return (
        <div className={styles.container}>
            <div></div>
            <div className={styles.btnGroup}>
                <button className={styles.removeButton} onClick={e => {removeTiles(e, 'top')}}>
                    -
                </button>
                <button className={styles.addButton} onClick={e => {addTiles(e, 'top')}}>
                    +
                </button>
            </div>
            <div></div>
            <div className={styles.btnGroup}>
                <button className={styles.removeButton} onClick={e => {removeTiles(e, 'left')}}>
                    -
                </button>
                <button className={styles.addButton} onClick={e => {addTiles(e, 'left')}}>
                    +
                </button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <tbody>
                        {boardJSX}
                    </tbody>
                </table>
            </div>
            <div className={styles.btnGroup}>
                <button className={styles.removeButton} onClick={e => {removeTiles(e, 'right')}}>
                    -
                </button>
                <button className={styles.addButton} onClick={e => {addTiles(e, 'right')}}>
                    +
                </button>
            </div>
            <div></div>
            <div className={styles.btnGroup}>
                <button className={styles.removeButton} onClick={e => {removeTiles(e, 'bottom')}}>
                    -
                </button>
                <button className={styles.addButton} onClick={e => {addTiles(e, 'bottom')}}>
                    +
                </button>
            </div>
            <div></div>
            <div></div>
            <div>
                <div className={styles.pair}>
                    <div className={styles.name}>
                        <div>
                            Current tile state
                        </div>
                    </div>
                    <div className={styles.value}>
                        {getCurrentTileState(selectedTile)}
                    </div>
                </div>
                <div className={styles.pair}>
                    <div className={styles.name}>
                        <div>
                            Set new tile state
                        </div>
                    </div>
                    <div className={styles.value}>
                        {possibleTileStates.filter(pTS => pTS !== getCurrentTileState(selectedTile)).map(tS => { return <button key={selectedTile + tS} onClick={e => changeTileState(e, selectedTile, tS)}>{tS}</button> })}
                    </div>
                </div>
                {
                    getCurrentTileState(selectedTile) === 'normal'
                    ?   <div>
                            <div className={styles.pair}>
                                <div className={styles.name}>
                                    <div>
                                        Current player
                                    </div>
                                </div>
                                <div className={styles.value}>
                                    {getCurrentTilePlayer(selectedTile) ? getCurrentTilePlayer(selectedTile) : 'none'}
                                </div>
                            </div>
                            <div className={styles.pair}>
                                <div className={styles.name}>
                                    <div>
                                        Set new player
                                    </div>
                                </div>
                                <div className={styles.value}>
                                    {
                                        getAvailablePlayers().map(p => {
                                            return <button key={p} onClick={e => setPlayerOnTile(e, selectedTile, p)}>player {p}</button>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    : ''
                }
                {
                    getCurrentTilePlayer(selectedTile) !== undefined
                    ?   <div>
                            <div className={styles.pair}>
                                <div className={styles.name}>
                                    <div>
                                        Current piece
                                    </div>
                                </div>
                                <div className={styles.value}>
                                    {getCurrentTilePiece(selectedTile)}
                                </div>
                            </div>
                            <div className={styles.pair}>
                                <div className={styles.name}>
                                    <div>
                                        Set new piece
                                    </div>
                                </div>
                                <div className={styles.value}>
                                    {
                                        getAvailablePieces().map(p => {
                                            return <button key={p} onClick={e => setPieceOnTile(e, selectedTile, p)}>{p}</button>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    : ''
                }
            </div>
            <div></div>
        </div>
    )

}
