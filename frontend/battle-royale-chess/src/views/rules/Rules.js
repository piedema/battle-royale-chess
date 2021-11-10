import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Piece from '../../components/piece/Piece'
import Menu from '../../components/menu/Menu'

import colors from '../../assets/js/colors'

import styles from './Rules.module.css'

export default function Rules() {

    const history = useHistory()

    const [sameColor, setSameColor] = useState(undefined)
    const [pieceColors, setPieceColors] = useState(Array(6).fill().map(a => colors.pieces(Math.floor(Math.random() * 8))))
    const [category, setCategory] = useState('gameplay')

    return (
        <div className={styles.container}>
            <Menu
                title={'Games played on Battle Royale Chess'}
                buttons={[
                    {
                        text:'Gameplay',
                        onClick:() => setCategory('gameplay')
                    },
                    {
                        text:'Pieces',
                        onClick:() => setCategory('pieces')
                    },
                ]}
            />
            {
                category === 'gameplay'
                ? ( <div className={styles.gameplay}>
                    <div className={styles.ruleContainer}>
                            <div className={styles.textfieldOuter}>
                                <div className={styles.textfieldInner}>
                                    <div className={styles.title} style={{ textAlign:"center" }}>
                                        Differences with normal Chess
                                    </div>
                                    Battle Royale Chess differs from normal chess in multiple ways. This way games will be more dynamic and interesting to play.
                                        <ul>
                                            <li>
                                                All moves happen simultaniously.
                                            </li>
                                            <li>
                                                You can only lose by losing your King. Check or Checkmate don't count.
                                            </li>
                                            <li>
                                                Promotion of a Pawn by reaching the other side of the board does not exist in Battle Royale Chess.
                                            </li>
                                            <li>
                                                Pawns can always only move 1 tile, not 2 at the start as usual.
                                            </li>
                                            <li>
                                                Castling is not allowed.
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    <div className={styles.ruleContainer}>
                            <div className={styles.textfieldOuter}>
                                <div className={styles.textfieldInner}>
                                    <div className={styles.title} style={{ textAlign:"center" }}>
                                        Winning
                                    </div>
                                    The obvious goal of the game is winning. This can be achieved by being the last King alive and in the following two ways.
                                        <ul>
                                            <li>
                                                By capturing others players Kings. This way you are the player with last surviving King.
                                            </li>
                                            <li>
                                                By standing on the golden center tile when the board shrinks to this last tile. This way you are also the only remaining player.
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ruleContainer}>
                            <div className={styles.textfieldOuter}>
                                <div className={styles.textfieldInner}>
                                    <div className={styles.title} style={{ textAlign:"center" }}>
                                        Moving pieces
                                    </div>
                                    Normally in chess players make a move one after another. In Battle Royale Chess we play a bit differently.
                                    You first select a piece by clicking on a tile which contains one of your pieces. Then select the tile where you want the piece to move to.
                                    Only legal moves are allowed and illegal moves are discarded.
                                    When the timer above the board reaches zero, all moves will be performed simultaniously.

                                    Moving pieces follow certain rules:
                                    <ul>
                                        <li>
                                            When a piece moves away from a tile where another player moves to it is lucky and won't be captured.
                                        </li>
                                        <li>
                                            When a piece moves to a tile holding another players piece, it captures that piece regardless of both pieces's value.
                                        </li>
                                        <li>
                                            When multiple pieces move to the same tile only the strongest piece survives. When they are of equal value they will both be captured.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ruleContainer}>
                            <div className={styles.textfieldOuter}>
                                <div className={styles.textfieldInner}>
                                    <div className={styles.title} style={{ textAlign:"center" }}>
                                        Calculating scores
                                    </div>
                                    When capturing pieces you gain points. When losing pieces you lose points. Highscores are calculated by an average of last 50 games.
                                    This makes it possible for everybody to reach a top position on the list, regardless of how many games are played.

                                    The following points will be rewarded for each accomplishment.
                                    <ul>
                                        <li>
                                            Winning a game yields 50 points.
                                        </li>
                                        <li>
                                            Taking a King yields 36 points.
                                        </li>
                                        <li>
                                            Taking a Queen yields 18 points.
                                        </li>
                                        <li>
                                            Taking a Tower yields 10 points.
                                        </li>
                                        <li>
                                            Taking a Bishop yields 6 points.
                                        </li>
                                        <li>
                                            Taking a Knight yields 4 points.
                                        </li>
                                        <li>
                                            Taking a Pawn yields 2 points.
                                        </li>
                                        <li>
                                            Losing a King costs 18 points.
                                        </li>
                                        <li>
                                            Losing a Queen costs 9 points.
                                        </li>
                                        <li>
                                            Losing a Tower costs 5 points.
                                        </li>
                                        <li>
                                            Losing a Bishop costs 3 points.
                                        </li>
                                        <li>
                                            Losing a Knight costs 2 points.
                                        </li>
                                        <li>
                                            Losing a Pawn costs 1 points.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>)
                : ( <div className={styles.moves}>
                    <div className={styles.mainMoves}>
                        <div className={styles.pieces}>
                            <div onMouseEnter={() => setSameColor(pieceColors[0])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="King" styling="outlined" color={pieceColors[0]} />
                            </div>
                            <div onMouseEnter={() => setSameColor(pieceColors[1])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="Queen" styling="outlined" color={pieceColors[1]} />
                            </div>
                            <div onMouseEnter={() => setSameColor(pieceColors[2])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="Tower" styling="outlined" color={pieceColors[2]} />
                            </div>
                            <div onMouseEnter={() => setSameColor(pieceColors[3])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="Bishop" styling="outlined" color={pieceColors[3]} />
                            </div>
                            <div onMouseEnter={() => setSameColor(pieceColors[4])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="Knight" styling="outlined" color={pieceColors[4]} />
                            </div>
                            <div onMouseEnter={() => setSameColor(pieceColors[5])} onMouseLeave={() => setSameColor(undefined)}>
                                <Piece type="Pawn" styling="outlined" color={pieceColors[5]} />
                            </div>
                        </div>
                        <div className={styles.textUnderneath}>
                            <div className={styles.textfieldInner}>
                                All pieces can not go to a new tile which is occupied by a tile of the same player and cross empty space (spaces which are not a tile).
                            </div>
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.piece}>
                            <Piece type="King" styling="outlined" color={sameColor || pieceColors[0]} />
                        </div>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title}>
                                    King
                                </div>
                                A king can move in any direction but take no more than one step.
                                A King is worth 18 points.
                            </div>
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title} style={{ textAlign:"right" }}>
                                    Queen
                                </div>
                                A queen can move horizontaly, verticaly or diagonaly for how far she wants to go. She can not move over another players pieces aswell as your own.
                                A queen is worth 9 points.
                            </div>
                        </div>
                        <div className={styles.piece}>
                            <Piece type="Queen" styling="outlined" color={sameColor || pieceColors[1]} />
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.piece}>
                            <Piece type="Tower" styling="outlined" color={sameColor || pieceColors[2]} />
                        </div>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title}>
                                    Tower
                                </div>
                                A Tower can move horizontaly or verticaly for how far it wants to go. It can not move over another players pieces aswell as your own.
                                A Tower is worth 5 points.
                            </div>
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title} style={{ textAlign:"right" }}>
                                    Bishop
                                </div>
                                A Bishop can move diagonaly for how far it wants to go. It can not move over another players pieces aswell as your own.
                                A Bishop is worth 3 points.
                            </div>
                        </div>
                        <div className={styles.piece}>
                            <Piece type="Bishop" styling="outlined" color={sameColor || pieceColors[3]} />
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.piece}>
                            <Piece type="Knight" styling="outlined" color={sameColor || pieceColors[4]} />
                        </div>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title}>
                                    Knight
                                </div>
                                A Knight is a special piece regarding its movement. It can move 3 tiles, of which 2 straight and one to the left or right or vice versa, in all directions.
                                For the knight it does not matter if pieces are in the way whether it is from his own team or the other team(s), however it can only move to an empty or enemy tile.
                                A Knight is worth 2 points.
                            </div>
                        </div>
                    </div>
                    <div className={styles.ruleContainer}>
                        <div className={styles.textfieldOuter}>
                            <div className={styles.textfieldInner}>
                                <div className={styles.title} style={{ textAlign:"right" }}>
                                    Pawn
                                </div>
                                A pawn can only move in one direction. Normally the pawn can move 2 tiles on its first move, but here it can only move one. The pawn can only capture enemy pieces diagonaly in its moving direction.
                                A pawn is worth 1 point.
                            </div>
                        </div>
                        <div className={styles.piece}>
                            <Piece type="Pawn" styling="outlined" color={sameColor || pieceColors[5]} />
                        </div>
                    </div>
                </div>)
            }
            <div className={styles.marginBottomFix}></div>
        </div>
    )
}
