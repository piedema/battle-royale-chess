import { useEffect, useContext, useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'
import moment from 'moment'

import { doCreateGametype, doUpdateGametype } from '../../services/GametypesService'

import { GametypesContext } from '../../contexts/GametypesContext'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'
import GameBoardEditor from '../../components/gameBoardEditor/GameBoardEditor'

import styles from './Gametypes.module.css'

import colors from '../../assets/js/colors'

export default function Gametypes(){

    const { gametypes, fetchGametypes } = useContext(GametypesContext)

    const [gameBoard, setGameBoard] = useState(undefined)
    const [playerDirections, setPlayerDirections] = useState([])
    const [selectedGametype, setSelectedGametype] = useState(undefined)
    const [buttons, setButtons] = useState([
        {
            text:"New gametype",
            onClick:gametypeSelected
        }
    ])
    const { register, handleSubmit, reset, formState:{ errors } } = useForm()
    const columns = useMemo(
        () => [
            {
                Header: 'Gametypes',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'gametype'
                    },
                    {
                        Header: 'Number of players',
                        accessor: data => <div className={styles.tableIcon}>{data.numberOfPlayers}</div>,
                    },
                    {
                        Header: 'Circle Shrink after N Rounds',
                        accessor: data => <div className={styles.tableIcon}>{data.circleShrinkAfterNRounds}</div>,
                    },
                    {
                        Header: 'Circle Shrink Offset',
                        accessor: data => <div className={styles.tableIcon}>{data.circleShrinkOffset}</div>,
                    },
                    {
                        Header: 'Time Per Round',
                        accessor: data => <div className={styles.tableIcon}>{data.timePerRound}</div>,
                    },
                    {
                        Header: 'Initial Delay',
                        accessor: data => <div className={styles.tableIcon}>{data.initialDelay}</div>,
                    },
                ],
            }
        ],
        []
    )

    // if board or direction changes then check if a new player is added
    // if that is the case then add a new playerDirection
    useEffect(() => {

        const allPlayersOnBoard = getAllPlayersOnBoard()

        if(playerDirections.length < allPlayersOnBoard.length){

            setPlayerDirections(playerDirections => {
                const pd = [...playerDirections]

                for(let i = pd.length; i < allPlayersOnBoard.length; i++){

                    pd.push('north')

                }

                return pd
            })

        }

    }, [gameBoard, playerDirections])

    // refresh the gametypes context data every 5 seconds
    useEffect(() => {

        const dataRefreshInterval = setInterval(() => {

            fetchGametypes()

        }, 5000)

        return () => clearInterval(dataRefreshInterval)

    }, [])

    useEffect(() => {

        // set the form and the detailed view
        if(selectedGametype === undefined){

            reset({
                nameInput:undefined,
                numberOfPlayersInput:undefined,
                circleShrinkAfterNRoundsInput:undefined,
                circleShrinkOffsetInput:undefined,
                timePerRoundInput:undefined,
                initialDelayInput:undefined
            })

            setGameBoard(undefined)
            setPlayerDirections([])

            return

        }

        if(selectedGametype.gametype){
            reset({
                nameInput:selectedGametype.gametype,
                numberOfPlayersInput:selectedGametype.numberOfPlayers,
                circleShrinkAfterNRoundsInput:selectedGametype.circleShrinkAfterNRounds,
                circleShrinkOffsetInput:selectedGametype.circleShrinkOffset,
                timePerRoundInput:selectedGametype.timePerRound,
                initialDelayInput:selectedGametype.initialDelay
            })

            setGameBoard(selectedGametype.board)
            setPlayerDirections(selectedGametype.playerDirections)

            return
        }

        if(selectedGametype === "new gametype"){
            reset({
                nameInput:'name',
                numberOfPlayersInput:'number',
                circleShrinkAfterNRoundsInput:'number',
                circleShrinkOffsetInput:'number',
                timePerRoundInput:'number',
                initialDelayInput:'number'
            })

            setPlayerDirections([])

            return
        }

    }, [selectedGametype])

    // a gametype is selected so move to the detailed view
    function gametypeSelected(gametype){

        setSelectedGametype(gametype.original || "new gametype")
        setButtons([
            {
                text:"Back to gametypes list",
                onClick:gametypeDeselected
            }
        ])

    }

    // a gametype is deselected to move to overview table view
    function gametypeDeselected(){

        setSelectedGametype(undefined)
        setButtons([
            {
                text:"New gametype",
                onClick:gametypeSelected
            }
        ])

    }

    // the submit of the form
    async function onFormSubmit(data){

        const {
            gametypeInput,
            circleShrinkAfterNRoundsInput,
            circleShrinkOffsetInput,
            timePerRoundInput,
            initialDelayInput
        } = data

        // if a gametype is selected then we want to update that gametype with only the values specified
        if(selectedGametype.gametype){

            const updatedGametype = {
                gametype:selectedGametype.gametype,
                board:gameBoard,
                numberOfPlayers:getAllPlayersOnBoard().length,
                playerDirections:playerDirections
            }

            if(circleShrinkAfterNRoundsInput) updatedGametype.circleShrinkAfterNRounds = circleShrinkAfterNRoundsInput
            if(circleShrinkOffsetInput) updatedGametype.circleShrinkOffset = circleShrinkOffsetInput
            if(timePerRoundInput) updatedGametype.timePerRound = timePerRoundInput
            if(initialDelayInput) updatedGametype.initialDelay = initialDelayInput

            try {

                await doUpdateGametype(updatedGametype)

            } catch (error) {

                console.log('Could not update gametype' + error.message)

            }

        }

        // if we want to create a new gametype then all values must be send
        if(selectedGametype === "new gametype"){

            const createdGametype = {
                gametype:gametypeInput,
                numberOfPlayers:getAllPlayersOnBoard().length,
                circleShrinkAfterNRounds:circleShrinkAfterNRoundsInput,
                circleShrinkOffset:circleShrinkOffsetInput,
                timePerRound:timePerRoundInput,
                initialDelay:initialDelayInput,
                board:gameBoard,
                playerDirections:playerDirections
            }

            try {

                await doCreateGametype(createdGametype)

            } catch (error) {

                console.log('Could not create gametype' + error.message)

            }

        }

        gametypeDeselected()

    }

    // get an array with all the players on the board and sort the result
    function getAllPlayersOnBoard(){

        const resultArray = []

        for(let key in gameBoard){

            if(gameBoard[key].length > 1 && !resultArray.includes(gameBoard[key][1])){

                resultArray.push(gameBoard[key][1])

            }

        }

        return resultArray.sort((a, b) => a - b)

    }

    // get the corresponding array for a players direction to reflect in which way the pawns may be moved
    function getCorrespondingArrow(p){

        switch(p) {
            case 'north':
                return '▲'
                break;
            case 'east':
                return '▶'
                break;
            case 'south':
                return '▼'
                break;
            case 'west':
                return '◀'
                break;
        }

    }

    // this function checks the current playing direction for a certain player (index i in the players array)
    // get the previous playing direction and set state to the next playing direction
    // clockwise ofcourse
    function switchPlayerDirection(e, i){

        e.preventDefault()

            switch(playerDirections[i]) {
                case 'north':
                    setPlayerDirections(playerDirections => {
                        const pd = [...playerDirections]
                        pd[i] = 'east'
                        return pd
                    })
                    break;
                case 'east':
                    setPlayerDirections(playerDirections => {
                        const pd = [...playerDirections]
                        pd[i] = 'south'
                        return pd
                    })
                    break;
                case 'south':
                    setPlayerDirections(playerDirections => {
                        const pd = [...playerDirections]
                        pd[i] = 'west'
                        return pd
                    })
                    break;
                case 'west':
                    setPlayerDirections(playerDirections => {
                        const pd = [...playerDirections]
                        pd[i] = 'north'
                        return pd
                    })
                    break;
            }

    }

    return (
        <div className={styles.container}>
            <Menu
                title={'Gametypes'}
                buttons={buttons}
            />
            {
                selectedGametype === undefined
                ? (
                    <div className={styles.gametypesList}>
                        <BasicTable
                            columns={columns}
                            data={gametypes !== undefined ? gametypes : []}
                            getRowProps={row => ({
                                style:{
                                    cursor:"pointer"
                                },
                                onClick:() => gametypeSelected(row)
                            })}
                            />
                    </div>
                )
                : (
                    <div>
                        <BasicContainer>
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                <div className={styles.group}>
                                    <div className={styles.title}>
                                        {
                                            selectedGametype === "new gametype"
                                            ? "Create new gametype"
                                            : "Update gametype"
                                        }
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Name
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            {
                                                selectedGametype === "new gametype"
                                                ? (
                                                    <input
                                                        type="text"
                                                        id="gametypeInput"
                                                        name="gametypeInput"
                                                        {...register("gametypeInput", {
                                                            // validate:{
                                                            //     value: (value) => value.includes('@'),
                                                            //     message: "moet een @ bevatten jaja"
                                                            // }
                                                        })}
                                                    />
                                                )
                                                : selectedGametype.gametype
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                numberOfPlayers
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            {getAllPlayersOnBoard().length}
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Circle Shrink After N Rounds
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            <input
                                                type="text"
                                                id="circleShrinkAfterNRoundsInput"
                                                name="circleShrinkAfterNRoundsInput"
                                                {...register("circleShrinkAfterNRoundsInput", {
                                                })} />
                                            { errors.name && errors.name.type === 'minLength' && <span role="alert">Value is too short</span>}
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Circle Shrink Offset
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            <input type="text" id="circleShrinkOffsetInput" name="circleShrinkOffsetInput" {...register("circleShrinkOffsetInput")} />
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Time Per Round
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            <input type="text" id="timePerRoundInput" name="timePerRoundInput" {...register("timePerRoundInput")} />
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Initial Delay
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            <input type="text" id="initialDelayInput" name="initialDelayInput" {...register("initialDelayInput")} />
                                        </div>
                                    </div>
                                    <div className={styles.pair}>
                                        <div className={styles.name}>
                                            <div>
                                                Player directions
                                            </div>
                                        </div>
                                        <div className={styles.value}>
                                            {playerDirections.map((p, i) => { return <div key={i} className={styles.playerDirectionButton} onClick={e => switchPlayerDirection(e, i)} style={{ color:colors.pieces(i).fill, display:'inline-block' }}>{getCorrespondingArrow(p)}</div> })}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button type='submit' className={`${styles.button} ${styles.applyButton}`}>
                                        Save gametype
                                    </button>
                                </div>
                                <GameBoardEditor gameBoard={gameBoard} setGameBoard={setGameBoard} />
                            </form>
                        </BasicContainer>
                    </div>
                )
            }
        </div>
    )
}
