import { useEffect, useContext, useMemo, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import moment from 'moment'
import axios from 'axios'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import BasicTable from '../../components/basicTable/BasicTable'
import Tooltip from '../../components/form/tooltip/Tooltip'

import { AuthenticationContext } from '../../contexts/AuthenticationContext'
import { SettingsContext } from '../../contexts/SettingsContext'

import { doCreateUser, doUpdateUser, getAllUserdata, usernameExists, emailExists, chessComAccountExists } from '../../services/UserService'

import containsDigit from '../../helpers/containsDigit'

import styles from './Users.module.css'

export default function Users() {

    const history = useHistory()

    const { authenticate } = useContext(AuthenticationContext)
    const { dateFormat } = useContext(SettingsContext)

    const { register, handleSubmit, reset, watch, formState:{ errors } } = useForm()

    const password = useRef({})
    password.current = watch('passwordInput', '')

    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(undefined)
    const [buttons, setButtons] = useState([
        {
            text:"New user",
            onClick:userSelected
        }
    ])

    const columns = useMemo(
        () => [
            {
                Header: 'Users',
                columns: [
                    {
                        Header: 'Username',
                        accessor: 'username'
                    },
                    {
                        Header: 'Email',
                        accessor: data => <div className={styles.tableIcon}>{data.email}</div>,
                    },
                    {
                        Header: 'Status',
                        accessor: data => data.enabled ? 'enabled' : 'disabled',
                    },
                    {
                        Header: 'Authorities',
                        accessor: data => data.authorities
                            .map(a => a.authority.split('ROLE_')[1])
                            .sort((a, b) => a.localeCompare(b))
                            .join(', '),
                    },
                    {
                        Header: 'Chess.com username',
                        accessor: 'chessCom',
                    }
                ],
            }
        ],
        []
    )

    // load users to show in table
    useEffect(() => {

        (async () => {

            try {

                const result = await getAllUserdata()
                setUsers(result.data)

            } catch (error){

                console.log('Error getting user data')

            }

        })()

    }, [])

    // set input fields bast on type of action
    useEffect(() => {

        if(selectedUser === undefined) return

        if(selectedUser.username && selectedUser.email){
            reset({
                emailInput:selectedUser.email,
                passwordInput:'',
                passwordCheck:'',
                authoritiesSelect:selectedUser.authorities.find(u => u.authority === "ROLE_ADMIN") ? "ADMIN" : "USER",
                chessComInput:selectedUser.chessCom
            })
        }

        if(selectedUser === "new user"){
            reset({
                emailInput:'',
                passwordInput:'',
                passwordCheck:'',
                authoritiesSelect:"USER",
                chessComInput:''
            })
        }

    }, [selectedUser])

    function userSelected(user){

        setSelectedUser(user.original || "new user")
        setButtons([
            {
                text:"Back to userlist",
                onClick:userDeselected
            }
        ])

    }

    function userDeselected(){

        setSelectedUser(undefined)
        setButtons([
            {
                text:"New user",
                onClick:userSelected
            }
        ])

    }

    // adjust which values to send to server when the form is submitted
    async function onFormSubmit(data){

        const { usernameInput, passwordInput,  emailInput, authoritiesSelect, chessComInput } = data

        if(selectedUser === "new user"){

            await doCreateUser(usernameInput, passwordInput, emailInput, [authoritiesSelect], chessComInput)

        } else {

            const updatedUser = {
                username:selectedUser.username
            }

            if(emailInput){

                updatedUser.email = emailInput

            }

            if(passwordInput.length > 0){

                updatedUser.password = passwordInput

            }

            if(authoritiesSelect){

                updatedUser.authorities = [ authoritiesSelect ]

            }

            if(chessComInput){

                updatedUser.chessCom = chessComInput

            }

            try {

                await doUpdateUser(updatedUser)

            } catch (error) {

                console.log('Error updating user')

            }

        }

        try {

            const result = await getAllUserdata()

            setUsers(result.data)
            userDeselected()

        } catch (error) {

            setUsers([])

            console.log('Error getting userdata')

        }

    }

    return (
        <div className={styles.container}>
            <Menu
                title={'Users'}
                buttons={buttons}
            />
            {
                selectedUser === undefined
                ? (
                    <div className={styles.usersList}>
                        <BasicTable
                            columns={columns}
                            data={users}
                            getRowProps={row => ({
                                style:{
                                    cursor:"pointer"
                                },
                                onClick:() => userSelected(row)
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
                                        selectedUser === "new user"
                                        ? "Create new user"
                                        : "Update user"
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
                                            selectedUser === "new user"
                                            ? (
                                                <>
                                                    <input
                                                        type="username"
                                                        id="usernameInput"
                                                        name="usernameInput"
                                                        {...register('usernameInput', {
                                                            required: true,
                                                            validate: async value => {
                                                                const result = await usernameExists(value)
                                                                return !result
                                                            }
                                                        })}
                                                    />
                                                    {errors.usernameInput?.type === "required" && <Tooltip>Username is required</Tooltip>}
                                                    {errors.usernameInput?.type === "validate" && <Tooltip>Username is not available</Tooltip>}
                                                </>
                                            )
                                            : selectedUser.username
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
                                            {...register('emailInput', {
                                                required: true,
                                                validate: async value => {
                                                    const result = await emailExists(value)
                                                    return !result
                                                }
                                            })}
                                        />
                                        {errors.emailInput?.type === "required" && <Tooltip>Email is required</Tooltip>}
                                        {errors.emailInput?.type === "validate" && <Tooltip>Email is not available</Tooltip>}
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Password
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input
                                            type="password"
                                            id="passwordInput"
                                            name="passwordInput"
                                            {...register('passwordInput', {
                                                required: true,
                                                minLength: 8,
                                                validate: containsDigit
                                            })}
                                        />
                                        {errors.password?.type === "required" && <Tooltip>Password is required</Tooltip>}
                                        {errors.password?.type === "minLength" && <Tooltip>Password needs to be at least 8 characters</Tooltip>}
                                        {errors.password?.type === "validate" && <Tooltip>Password needs at least 1 digit</Tooltip>}
                                    </div>
                                </div>
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Repeat password
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input
                                            type="password"
                                            id="passwordCheck"
                                            name="passwordCheck"
                                            {...register('passwordCheck', {
                                                validate: pw => pw === password.current
                                            })}
                                        />
                                        {errors.passwordCheck?.type === "validate" && <Tooltip>Second password does not match first password</Tooltip>}
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
                                <div className={styles.pair}>
                                    <div className={styles.name}>
                                        <div>
                                            Chess.com username
                                        </div>
                                    </div>
                                    <div className={styles.value}>
                                        <input
                                            type="text"
                                            id="chessComInput"
                                            name="chessComInput"
                                            {...register('chessComInput', {
                                                validate: async value => {
                                                    const result = await chessComAccountExists(value)
                                                    return result
                                                }
                                            })}
                                        />
                                        {errors.chessComInput?.type === "validate" && <Tooltip>Chess.com username does not exist</Tooltip>}
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
