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

export default function Users() {

    const { dateFormat } = useContext(SettingsContext)

    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(undefined)
    const [buttons, setButtons] = useState([
        {
            text:"New user",
            onClick:userSelected
        }
    ])

    const { register, handleSubmit, reset, formState:{ errors } } = useForm()

    useEffect(() => {

        (async () => {

            const options = {
                url:'/admin/users',
                method:'GET',
                headers: {
                    Authorization:'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            }

            const result = await apiCaller(options)
            setUsers(result)
        })()

    }, [])

    useEffect(() => {

        if(selectedUser === undefined) return

        if(selectedUser.username && selectedUser.email){
            reset({
                emailInput:selectedUser.email,
                passwordInput:'',
                passwordInput2:'',
                authoritiesSelect:selectedUser.authorities.find(u => u.authority === "ROLE_ADMIN") ? "ADMIN" : "USER"
            })
        }

        if(selectedUser === "new user"){
            reset({
                emailInput:'',
                passwordInput:'',
                passwordInput2:'',
                authoritiesSelect:"USER"
            })
        }

    }, [selectedUser])



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
                    // {
                    //     Header: 'Disable user',
                    //     accessor: data => <div className={styles.tableIcon} onClick={disableUser}>⨯</div>,
                    // },
                    // {
                    //     Header: 'Save',
                    //     accessor: data => <div className={styles.tableIcon} onClick={saveUser}>🖫</div>
                    // },
                ],
            }
        ],
        []
    )

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

    // async function onFormSubmit(data){
    //
    //     const {
    //         emailInput,
    //         passwordInput,
    //         passwordInput2,
    //         enabledSelect,
    //         authoritySelect
    //     } = data
    //
    //     const updatedUser = { username:username }
    //
    //     if(emailInput) updatedUser.email = emailInput
    //     if(passwordInput === passwordInput2) updatedUser.password = passwordInput
    //     if(enabledSelect) updatedUser.enabled = enabledSelect
    //     if(authoritySelect) updatedUser.
    //
    //     // send new values
    //     await updateUser(updatedUser)
    //
    //     // load new data
    //     loadUserdata()
    // }

    async function onFormSubmit(data){

        const { usernameInput, passwordInput, passwordInput2, emailInput, authoritiesSelect } = data

        if(passwordInput !== passwordInput2) return

        if(selectedUser.username && selectedUser.email){

            const updatedUser = {
                username:selectedUser.username
            }

            if(passwordInput) updatedUser.password = passwordInput
            if(emailInput) updatedUser.email = emailInput
            if(authoritiesSelect) updatedUser.authorities = [ authoritiesSelect ]

            await updateUser(updatedUser)

        }

        if(selectedUser === "new user"){

            await createUser(usernameInput, passwordInput, emailInput, [authoritiesSelect])

        }

        const options = {
            url:'/admin/users',
            method:'GET',
            headers: {
                Authorization:'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        }

        const result = await apiCaller(options)
        setUsers(result)

        userDeselected()

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
