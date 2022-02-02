import { useEffect, useContext, useState } from 'react'

import { useHistory, NavLink } from 'react-router-dom'

import Piece from '../../components/piece/Piece'

import { UserContext } from '../../contexts/UserContext'
import { SettingsContext } from '../../contexts/SettingsContext.js'

import colors from '../../assets/js/colors'

import styles from './MainMenu.module.css'

export default function MainMenu({ buttons }){

    const history = useHistory()

    const { role } = useContext(UserContext)
    const { piecesStyle, boardView } = useContext(SettingsContext)

    const [tileSize, setTileSize] = useState(100)
    const [nRows, setNRows] = useState()
    const [nCols, setNCols] = useState()
    const [boardJSX, setBoardJSX] = useState([])
    const [perspective, setPerspective] = useState(boardView())

    // this eventListener sets the number of rows and cols for the menu and registeres a resize listener which does the same
    useEffect(() => {

        setRowAndColLength()

        window.addEventListener('resize', setRowAndColLength)

    }, [])

    // if role, nRows or nCols changes recreate the menu chessboard
    useEffect(() => {

        setBoardJSX(createBoard(nRows, nCols))

    }, [nRows, nCols, role])

    // calculate new number of rows and columns according to window size
    // we want minimum of 3 rows and 3 cols
    function setRowAndColLength(){

        const newHeight = Math.min(window.innerHeight - 600, 600)
        const newWidth = Math.min(window.innerWidth - 200, 1000)

        setNRows(Math.max(Math.floor(newHeight / tileSize), 3))
        setNCols(Math.max(Math.floor(newWidth / tileSize), 3))

    }

    // create the menu chess board
    function createBoard(nRows, nCols){

        if(nRows === undefined || nCols === undefined) return

        // create shuffled button array and filter buttons on user role
        const buttonsFilteredByRole = buttons.filter(b => {

            b.element = "button"

            switch (role) {
                case "SPECTATOR": return b.role === "SPECTATOR"
                case "USER": return b.role === "SPECTATOR" || b.role === "USER"
                case "ADMIN": return b
            }

        })

        // get available amount of tiles
        let nTilesAvailableForPieces = nRows * nCols

        const boardElements = {}

        // add all buttons to the boardElements object with random keys. so random row and column
        while(buttonsFilteredByRole.length !== 0){

            const randomX = Math.ceil((Math.random() * nCols))
            const randomY = Math.ceil((Math.random() * nRows))
            const key = randomY + '' + randomX

            if(boardElements[key] === undefined){

                boardElements[key] = buttonsFilteredByRole.shift()
                nTilesAvailableForPieces--                                      // remove an available tile to place pieces on

            }

        }

        // create shuffled pieces
        const numberOfPiecesWanted = Math.min(Math.ceil((nRows * nCols) / 3), nTilesAvailableForPieces)
        const piecesWanted = []

        // for each piece wanted, create a new piece blueprint and add to array
        for(let i = 0; i < numberOfPiecesWanted; i++){

            const types = ["King", "Queen", "Tower", "Bishop", "Knight", "Pawn"]
            const style = piecesStyle()
            const pieceIndex = Math.ceil(Math.random() * 5) - 1
            const colorIndex = Math.ceil(Math.random() * 8) - 1

            piecesWanted.push({
                element:"piece",
                type:types[pieceIndex],
                style:style,
                color:colors.pieces(colorIndex)
            })

        }

        // place all wanted pieces on an available tile in boardElements
        while(piecesWanted.length !== 0){

            const randomX = Math.ceil((Math.random() * nCols))
            const randomY = Math.ceil((Math.random() * nRows))
            const key = randomY + '' + randomX

            if(boardElements[key] === undefined) boardElements[key] = piecesWanted.shift()

        }

        // generate board
        const rows = []

        // loop all wanted rows
        for(let i = 1; i <= nRows; i++){

            const tiles = []

            // loop all wanted columns
            for(let j = 1; j <= nCols; j++){

                // create a key for this tile
                const key = i + '' + j

                // get the wanted element for this tile
                const el = boardElements[key]
                // if element exists style accordingly to being a button or piece
                const className = el !== undefined && el.element === "button" ? styles.tileMenuitem : styles.tile

                // if the element is a button then add a navlink to the tiles array containing button info
                if(el !== undefined && el.element === 'button'){

                    tiles.push(
                        <div
                            key={key}
                            id={key}
                            className={className}>
                                <NavLink to={el.link} className={styles.menuBtn}>
                                    {el.text}
                                </NavLink>
                        </div>
                    )
                }

                // if the element is a piece then add a peice component with the right style and color
                if(el !== undefined && el.element === 'piece'){

                    tiles.push(
                        <div key={key} className={className}>
                            <Piece type={el.type} styling={el.style} color={el.color} />
                        </div>
                    )
                }

                // if the boardElements does not hold a blueprint for this tile just add an empty tile
                if(el === undefined){

                    tiles.push(
                        <div key={key} className={className}>
                        </div>
                    )

                }
            }

            // add the row to rows array
            rows.push(
                <div key={i} className={styles.row}>
                    {tiles}
                </div>
            )

        }

        return rows
    }

    return (
        <div className={styles.container}>
            <div className={styles.menuControls}>
                <div
                    className={styles.button}
                    onClick={() => setBoardJSX(createBoard(nRows, nCols))}>
                    Shuffle Menu
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPerspective(perspective === '3d' ? '2d' : '3d')}>
                    View in {perspective === '3d' ? '2d' : '3d'}
                </div>
            </div>
            <div className={`${styles['chessboard-' + perspective]}`}>
                {boardJSX}
            </div>
        </div>
    )
}
