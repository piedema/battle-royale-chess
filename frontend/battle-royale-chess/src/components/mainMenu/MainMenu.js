import { useEffect, useContext, useState } from 'react'

import { useHistory, NavLink } from 'react-router-dom'

import Piece from '../../components/piece/Piece'

import { UserContext } from '../../contexts/UserContext'

import colors from '../../assets/js/colors'

import styles from './MainMenu.module.css'

export default function MainMenu(){

    const history = useHistory()

    const { role } = useContext(UserContext)

    const boardView = localStorage.getItem('boardView') || '3d'
    const piecesStyle = localStorage.getItem('piecesStyle') || 'filled'

    const [tileSize, setTileSize] = useState(100)
    const [nRows, setNRows] = useState()
    const [nCols, setNCols] = useState()
    const [boardJSX, setBoardJSX] = useState([])
    const [perspective, setPerspective] = useState(boardView)

    const buttons = [
        { text:"Games", link:"/games", role:"SPECTATOR" },
        { text:"High scores", link:"/highscores", role:"SPECTATOR" },
        { text:"Set tings", link:"/settings", role:"USER" },
        { text:"Users", link:"/users", role:"ADMIN" },
        { text:"Rules", link:"/rules", role:"SPECTATOR" },
        // { text:"Shop", link:"/shop", role:"USER" },
        // { text:"About", link:"/about", role:"SPECTATOR" },
    ]

    useEffect(() => {

        setRowAndColLength()

        window.addEventListener('resize', setRowAndColLength)

    }, [])

    useEffect(() => {

        setBoardJSX(createBoard(nRows, nCols))

    }, [nRows, nCols, role])

    function setRowAndColLength(){

        const newHeight = Math.min(window.innerHeight - 600, 600)
        const newWidth = Math.min(window.innerWidth - 200, 1000)

        setNRows(Math.max(Math.floor(newHeight / tileSize), 2))
        setNCols(Math.max(Math.floor(newWidth / tileSize), 3))

    }

    function createBoard(nRows, nCols){

        if(nRows === undefined || nCols === undefined) return

        // create shuffled button
        const buttonsFilteredByRole = buttons.filter(b => {

            b.element = "button"

            switch (role) {
                case "SPECTATOR": return b.role === "SPECTATOR"
                case "USER": return b.role === "SPECTATOR" || b.role === "USER"
                case "ADMIN": return b
            }

        })

        const boardElements = {}

        while(buttonsFilteredByRole.length !== 0){

            const randomX = Math.ceil((Math.random() * nCols))
            const randomY = Math.ceil((Math.random() * nRows))
            const key = randomY + '' + randomX

            if(boardElements[key] === undefined) boardElements[key] = buttonsFilteredByRole.shift()

        }

        // create shuffled pieces
        const numberOfPiecesWanted = Math.min(Math.ceil((nRows * nCols) / 3), 8)
        const piecesWanted = []

        for(let i = 0; i < numberOfPiecesWanted; i++){

            const types = ["King", "Queen", "Tower", "Bishop", "Knight", "Pawn"]
            const style = piecesStyle
            const pieceIndex = Math.ceil(Math.random() * 5) - 1
            const colorIndex = Math.ceil(Math.random() * 8) - 1

            piecesWanted.push({
                element:"piece",
                type:types[pieceIndex],
                style:style,
                color:colors.pieces(colorIndex)
            })

        }

        while(piecesWanted.length !== 0){

            const randomX = Math.ceil((Math.random() * nCols))
            const randomY = Math.ceil((Math.random() * nRows))
            const key = randomY + '' + randomX

            if(boardElements[key] === undefined) boardElements[key] = piecesWanted.shift()

        }

        // generate board
        const rows = []

        for(let i = 1; i <= nRows; i++){

            const tiles = []

            for(let j = 1; j <= nCols; j++){

                const key = i + '' + j

                const el = boardElements[key]
                const className = el !== undefined && el.element === "button" ? styles.tileMenuitem : styles.tile

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

                if(el !== undefined && el.element === 'piece'){

                    tiles.push(
                        <div key={key} className={className}>
                            <Piece type={el.type} styling={el.style} color={el.color} />
                        </div>
                    )
                }

                if(el === undefined){

                    tiles.push(
                        <div key={key} className={className}>
                        </div>
                    )

                }
            }

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
                    onClick={setRowAndColLength}>
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
