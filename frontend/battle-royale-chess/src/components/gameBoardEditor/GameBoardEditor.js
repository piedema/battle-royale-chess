import { useEffect, useState, useContext, createRef } from 'react'

import deepCopy from '../../helpers/deepCopy'

import Piece from '../../components/piece/Piece'

import styles from './GameBoardEditor.module.css'

import colors from '../../assets/js/colors'

export default function GameBoardEditor({ gameBoard, setGameBoard }){

    const [boardJSX, setBoardJSX] = useState([])
    const [selectedTile, setSelectedTile] = useState(undefined)

    const possibleTileStates = ['normal', 'inactive']

    const pieceStyle = localStorage.getItem('piecesStyle') || 'outlined'

    useEffect(() => {

        if(gameBoard !== undefined){

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            if(selectedTile !== undefined){

                const selectedTileSplitted = selectedTile.split(':')

                if(selectedTileSplitted[0] > gameBoardRows || selectedTileSplitted[1] > gameBoardCols){

                    setSelectedTile(undefined)

                }
            }

            const jsx = []

            for(let i = 1; i <= gameBoardRows; i++){

                const row = []

                for(let j = 1; j <= gameBoardCols; j++){

                    const tileKey = i + ':' + j

                    if(gameBoard[tileKey] === undefined){

                        row.push(<td key={tileKey} className={`${styles.td} ${styles.inactive} ${selectedTile === tileKey ? styles.isSelected : ''}`} onClick={evt => { setSelectedTile(tileKey) }}></td>)

                    }

                    if(gameBoard[tileKey] !== undefined && gameBoard[tileKey][0] === 'normal'){

                        const pieceOnTile = gameBoard[tileKey][2]
                        const color = colors.pieces(parseFloat(gameBoard[tileKey][1]) - 1)

                        row.push(
                            <td key={tileKey} className={`${styles.td} ${styles.active} ${selectedTile === tileKey ? styles.isSelected : ''}`} onClick={evt => { setSelectedTile(tileKey) }}>
                                { pieceOnTile !== undefined ? <Piece type={pieceOnTile} styling={pieceStyle} color={color} w={40} h={40} /> : null }
                            </td>
                        )

                    }

                }

                jsx.push(
                    <tr key={i} className={styles.tr}>
                        {row}
                    </tr>
                )

            }

            setBoardJSX(jsx)

        }

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

    function removeTiles(e, position){

        e.preventDefault()

        if(position === 'top'){

            const newGameBoard = {}

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            if(gameBoardRows < 5) return

            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 1 + ':' + i

                delete newGameBoard[newKey]

            }

            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 2 + ':' + i

                delete newGameBoard[newKey]

            }

            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = parseFloat(keySplitted[0]) + -2 + ':' + keySplitted[1]

                if(keySplitted[0] > 2) newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'right'){

            const newGameBoard = deepCopy(gameBoard)

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            if(gameBoardCols < 5) return

            for(let i = 1; i <= gameBoardRows; i++){

                for(let j = gameBoardCols - 1; j < gameBoardCols + 1; j++){

                    const key = i + ':' + j

                    delete newGameBoard[key]

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'bottom'){

            const newGameBoard = deepCopy(gameBoard)

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            if(gameBoardRows < 5) return

            for(let i = gameBoardRows - 1; i < gameBoardRows + 1; i++){

                for(let j = 1; j <= gameBoardCols; j++){

                    const key = i + ':' + j

                    delete newGameBoard[key]

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'left'){

            const newGameBoard = {}

            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])
            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])

            if(gameBoardCols < 5) return

            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 1

                delete newGameBoard[newKey]

            }

            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 2

                delete newGameBoard[newKey]

            }

            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = keySplitted[0] + ':' + (parseFloat(keySplitted[1]) + -2)

                if(keySplitted[1] > 2) newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

    }

    function addTiles(e, position){

        e.preventDefault()

        if(position === 'top'){

            const newGameBoard = {}

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])

            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 1 + ':' + i

                newGameBoard[newKey] = ['normal']

            }

            for(let i = 1; i <= gameBoardCols; i++){

                const newKey = 2 + ':' + i

                newGameBoard[newKey] = ['normal']

            }

            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = parseFloat(keySplitted[0]) + 2 + ':' + keySplitted[1]

                newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'right'){

            const newGameBoard = deepCopy(gameBoard)

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            for(let i = 1; i <= gameBoardRows; i++){

                for(let j = gameBoardCols + 1; j < gameBoardCols + 3; j++){

                    const key = i + ':' + j

                    newGameBoard[key] = ['normal']

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'bottom'){

            const newGameBoard = deepCopy(gameBoard)

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            for(let i = gameBoardRows + 1; i < gameBoardRows + 3; i++){

                for(let j = 1; j <= gameBoardCols; j++){

                    const key = i + ':' + j

                    newGameBoard[key] = ['normal']

                }

            }

            setGameBoard(newGameBoard)

        }

        if(position === 'left'){

            const newGameBoard = {}

            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 1

                newGameBoard[newKey] = ['normal']

            }

            for(let i = 1; i <= gameBoardRows; i++){

                const newKey = i + ':' + 2

                newGameBoard[newKey] = ['normal']

            }

            for(let key in gameBoard){

                const keySplitted = key.split(':')
                const newKey = keySplitted[0] + ':' + (parseFloat(keySplitted[1]) + 2)

                newGameBoard[newKey] = gameBoard[key]

            }

            setGameBoard(newGameBoard)

        }

    }

    function getCurrentTileState(tileKey){

        if(gameBoard && gameBoard[tileKey]) return gameBoard[tileKey][0]
        return 'inactive'

    }

    function changeTileState(e, key, newTileState){

        e.preventDefault()

        if(gameBoard === undefined) return

        const newGameBoard = deepCopy(gameBoard)

        if(newTileState === 'normal') newGameBoard[key] = ['normal']
        if(newTileState === 'inactive') delete newGameBoard[key]

        setGameBoard(newGameBoard)

    }

    function getCurrentTilePlayer(tileKey){

        if(gameBoard && gameBoard[tileKey] && gameBoard[tileKey][1]) return gameBoard[tileKey][1]
        return undefined

    }

    function getAvailablePlayers(){

        let nPlayersInGameBoard = 0

        for(let key in gameBoard){

            if(gameBoard[key].length > 1 && parseFloat(gameBoard[key][1]) > nPlayersInGameBoard) nPlayersInGameBoard = parseFloat(gameBoard[key][1])

        }

        const playersArray = []

        for(let i = 1; i <= nPlayersInGameBoard + 1 && i <= 8; i++){

            playersArray.push(i)

        }

        return playersArray
    }

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

    function getCurrentTilePiece(tileKey){

        if(gameBoard && gameBoard[tileKey] && gameBoard[tileKey][2]) return gameBoard[tileKey][2]
        return 'none'

    }

    function getAvailablePieces(){

        return ['King', 'Queen', 'Tower', 'Bishop', 'Knight', 'Pawn']
    }

    function setPieceOnTile(e, key, piece){

        e.preventDefault()

        if(gameBoard === undefined) return

        const newGameBoard = deepCopy(gameBoard)

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
// {
//     selectedTile !== undefined
//     ? <div className={styles.btnGroup}>
//         <div className={styles.btnGroup}>
//             Switch tilestate from {getCurrentTileState(selectedTile)} to {possibleTileStates.filter(pTS => pTS !== getCurrentTileState(selectedTile)).map(tS => { return <button key={selectedTile} onClick={e => changeTileState(e, selectedTile, tS)}>{tS}</button> })}
//             <br />
//             <br />
//             Switch tilecontent from {} to
//
//         </div>
//       </div>
//     : <div></div>
// }
