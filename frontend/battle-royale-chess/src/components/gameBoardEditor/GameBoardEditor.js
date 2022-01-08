import { useEffect, useState, useContext, createRef } from 'react'

import Piece from '../../components/piece/Piece'

import styles from './GameBoardEditor.module.css'

import colors from '../../assets/js/colors'

export default function GameBoardEditor({ gameBoard, setGameBoard }){

    const [boardJSX, setBoardJSX] = useState([])

    useEffect(() => {

        let adjustedGameBoard = {}

        if(gameBoard !== undefined){

            // set cols and rows to match gameBoard
            const nCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const nRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            for(let i = 1; i <= nRows; i++){

                for(let j = 1; j <= nCols; j++){

                    const key = i + ':' + j

                    if(gameBoard[key] !== undefined) adjustedGameBoard[key] = gameBoard[key]
                    if(gameBoard[key] === undefined) adjustedGameBoard[key] = ['inactive']

                }

            }

        }

        if(gameBoard === undefined){

            adjustedGameBoard = {
                "1:1":['normal'],
                "1:2":['normal'],
                "1:3":['normal'],
                "2:1":['normal'],
                "2:2":['normal'],
                "2:3":['normal'],
                "3:1":['normal'],
                "3:2":['normal'],
                "3:3":['normal']
            }

        }

        setGameBoard(adjustedGameBoard)

    }, [])

    useEffect(() => {

        if(gameBoard !== undefined){

            const gameBoardCols = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[1] }).sort((a, b) => { return b - a })[0])
            const gameBoardRows = parseFloat(Object.keys(gameBoard).map(k => { return k.split(':')[0] }).sort((a, b) => { return b - a })[0])

            const jsx = []

            for(let i = 1; i <= gameBoardRows; i++){

                const row = []

                for(let j = 1; j <= gameBoardCols; j++){

                    const tileKey = i + ':' + j

                    if(gameBoard[tileKey] !== undefined && gameBoard[tileKey][0] === 'normal'){

                        row.push(<td key={j} className={`${styles.td} ${styles.tile}`}></td>)

                    }

                    if(gameBoard[tileKey] !== undefined && gameBoard[tileKey][0] === 'inactive'){

                        row.push(<td key={j} className={`${styles.td} ${styles.inactive}`}></td>)

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

        console.log(gameBoard)

    }, [gameBoard])

    function removeTiles(e, position){

        e.preventDefault()

        console.log('remove from', position)

    }

    function addTiles(e, position){

        e.preventDefault()

        const adjustedBoard = {}

        if(position === 'top'){

        }

        //setBoardJSON(adjustedBoard)

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
            <table className={styles.table}>
                <tbody>
                    {boardJSX}
                </tbody>
            </table>
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
        </div>
    )

}
