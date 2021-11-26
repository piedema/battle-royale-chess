import { useEffect, useContext, useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'
import moment from 'moment'

import handleError from '../../helpers/errorHandler'
import apiCaller from '../../helpers/apiCaller'

import { createUser, updateUser } from '../../services/UserService'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'

import { GamesContext } from '../../contexts/GamesContext'
import { SettingsContext } from '../../contexts/SettingsContext'

import styles from './Users.module.css'

export default function Gametypes() {

    const [gametypes, setGametypes] = useState([])
    const [selectedGametype, setSelectedGametype] = useState(undefined)
    const [buttons, setButtons] = useState([
        {
            text:"New gametype",
            onClick:gametypeSelected
        }
    ])

    const { register, handleSubmit, reset, formState:{ errors } } = useForm()

    useEffect(() => {

        (async () => {

            const options = {
                url:'/admin/gametypes',
                method:'GET',
                headers: {
                    Authorization:'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            }

            const result = await apiCaller(options)
            setGametype(result)
        })()

    }, [])

    useEffect(() => {

        if(selectedGametype === undefined) return

        if(selectedGametype.username && selectedGametype.email){
            reset({
                gametypeInput:selectedGametype.gametype,
                numberOfPlayersSelect:selectedGametype.numberOfPlayers,
                circleShrinkAfterNRoundsInput:selectedGametype.circleShrinkAfterNRounds,
                circleShrinkOffsetInput:selectedGametype.circleShrinkOffset,
                timePerRoundInput:selectedGametype.timePerRound,
                initialDelayInput:selectedGametype.initialDelay,
                boardInput:selectedGametype.board,
                playerDirectionsInput:selectedGametype.playerDirections,
            })
        }

        if(selectedGametype === "new gametype"){
            reset({
                gametypeInput:'',
                numberOfPlayersSelect:2,
                circleShrinkAfterNRoundsInput:'-',
                circleShrinkOffsetInput:'-',
                timePerRoundInput:'-',
                initialDelayInput:'-',
                boardInput:{},
                playerDirectionsInput:[],
            })
        }

    }, [selectedGametype])



    const columns = useMemo(
        () => [
            {
                Header: 'Gametypes',
                columns: [
                    {
                        Header: 'Gametype',
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

    function gametypeSelected(gametype){

        setSelectedGametype(gametype.original || "new gametype")
        setButtons([
            {
                text:"Back to gametypelist",
                onClick:gametypeDeselected
            }
        ])

    }

    function gametypeDeselected(){

        setSelectedGametype(undefined)
        setButtons([
            {
                text:"New gametype",
                onClick:gametypeSelected
            }
        ])

    }

    async function onFormSubmit(data){

        const {
            gametypeInput,
            numberOfPlayersSelect,
            circleShrinkAfterNRoundsInput,
            circleShrinkOffsetInput,
            timePerRoundInput,
            initialDelayInput
        } = data

        if(selectedGametype.gametype){

            const updatedGametype = {
                gametype:selectedGametype.gametype
            }

            if(numberOfPlayersSelect) updatedGametype.numberOfPlayers = numberOfPlayersSelect
            if(circleShrinkAfterNRoundsInput) updatedGametype.circleShrinkAfterNRounds = circleShrinkAfterNRoundsInput
            if(circleShrinkOffsetInput) updatedGametype.circleShrinkOffset = circleShrinkOffsetInput
            if(timePerRoundInput) updatedGametype.timePerRound = timePerRoundInput
            if(initialDelayInput) updatedGametype.initialDelay = initialDelayInput

            await updateGametype(updatedGametype)

        }

        if(selectedGametype === "new gametype"){

            await createGametype(gametypeInput, numberOfPlayersSelect, circleShrinkAfterNRoundsInput, circleShrinkOffsetInput, timePerRoundInput, initialDelayInput)

        }

        const options = {
            url:'/admin/gametypes',
            method:'GET',
            headers: {
                Authorization:'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        }

        const result = await apiCaller(options)
        setGametypes(result)

        gametypeDeselected()

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
                            data={gametypes}
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
                                            Username
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        {
                                            selectedGametype === "new gametype"
                                            ? (
                                                <input
                                                    type="username"
                                                    id="usernameInput"
                                                    name="usernameInput"
                                                    {...register("usernameInput", {
                                                        // validate:{
                                                        //     value: (value) => value.includes('@'),
                                                        //     message: "moet een @ bevatten jaja"
                                                        // }
                                                    })}
                                                />
                                            )
                                            : selectedGametype.username
                                        }
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Email
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input
                                            type="email"
                                            id="emailInput"
                                            name="emailInput"
                                            {...register("emailInput", {
                                                // validate:{
                                                //     value: (value) => value.includes('@'),
                                                //     message: "moet een @ bevatten jaja"
                                                // }
                                            })}
                                        />
                                        {errors.name}
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Password
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input type="password" id="passwordInput" name="passwordInput" {...register("passwordInput", { minLength:8, maxLength:80 })} />
                                        { errors.name && errors.name.type === 'minLength' && <span role="alert">Value is too short</span>}
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Repeat password
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input type="password" id="passwordInput2" name="passwordInput2" {...register("passwordInput2")} />
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Authorities
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <select id="authoritiesSelect" name="authoritiesSelect" {...register("authoritiesSelect")}>
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button type='submit' className={`${styles.button} ${styles.applyButton}`}>
                                    Save user
                                </button>
                            </div>
                        </form>
                    </BasicContainer>
                )
            }
        </div>
    )
}
