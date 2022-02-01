import { useState, useContext, useEffect, useMemo, useRef } from 'react'

import { useForm } from 'react-hook-form'

import Menu from '../../components/menu/Menu'
import BasicContainer from '../../components/basicContainer/BasicContainer'
import Tooltip from '../../components/form/tooltip/Tooltip'

import { UserContext } from '../../contexts/UserContext'
import { AuthenticationContext } from '../../contexts/AuthenticationContext'

import { usernameExists, emailExists, doUpdateUser } from '../../services/UserService'

import containsDigit from '../../helpers/containsDigit'

import styles from './Settings.module.css'

export default function Settings() {

    const { username, email } = useContext(UserContext)
    const { refreshUser } = useContext(AuthenticationContext)

    const { register, handleSubmit, reset, watch, formState:{ errors } } = useForm()

    const password = useRef({})
    password.current = watch('passwordInput', '')

    useEffect(() => {
        reset({
            emailInput:email,
            languageSelect:localStorage.getItem('language') || 'EN',
            dateTimeSelect:localStorage.getItem('dateTime') || 'DD-MM-YYYY HH:mm:ss',
            boardViewSelect:localStorage.getItem('boardView') || '3d',
            piecesStyleSelect:localStorage.getItem('piecesStyle') || 'outlined'
        })
    }, [username, email])

    async function onFormSubmit(data){

        const {
            emailInput,
            passwordInput,
            passwordCheck,
            languageSelect,
            dateTimeSelect,
            boardViewSelect,
            piecesStyleSelect
        } = data

        const updatedUser = { username:username }

        if(emailInput) updatedUser.email = emailInput
        if(passwordInput.length > 0 && passwordInput === passwordCheck) updatedUser.password = passwordInput

        localStorage.setItem('language', languageSelect)
        localStorage.setItem('dateTime', dateTimeSelect)
        localStorage.setItem('boardView', boardViewSelect)
        localStorage.setItem('piecesStyle', piecesStyleSelect)

        // send new values
        await doUpdateUser(updatedUser)

        // load new data
        refreshUser()

    }

    return (
        <div className={styles.container}>
            <Menu
                title={'Settings'}
            />
            <BasicContainer>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className={styles.group}>
                        <div className={styles.title}>
                            Credentials
                        </div>
                        <div className={styles.pair}>
                            <div className={styles.name}>
                                <div>
                                    Player Name
                                </div>
                            </div>
                            <div className={styles.value}>
                                { username }
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
                                    id="passwordInput"
                                    name="passwordInput"
                                    type="password"
                                    placeholder="password"
                                    className={styles.input}
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
                                    id="passwordCheck"
                                    name="passwordCheck"
                                    type="password"
                                    placeholder="password"
                                    className={styles.input}
                                    {...register('passwordCheck', {
                                        validate: pw => pw === password.current
                                    })}
                                />
                                {errors.passwordCheck?.type === "validate" && <Tooltip>Second password does not match first password</Tooltip>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.title}>
                            Localization
                        </div>
                        <div className={styles.pair}>
                            <div className={styles.name}>
                                <div>
                                    Language
                                </div>
                            </div>
                            <div className={styles.value}>
                                <select id="languageSelect" name="languageSelect" {...register("languageSelect")}>
                                    <option value="EN">English</option>
                                    <option value="NL">Nederlands</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.pair}>
                            <div className={styles.name}>
                                <div>
                                    Datetime format
                                </div>
                            </div>
                            <div className={styles.value}>
                                <select id="dateTimeSelect" name="dateTimeSelect" {...register("dateTimeSelect")}>
                                    <option value="DD-MM-YYYY HH:mm:ss">dd-mm-yyyy hh:mm:ss</option>
                                    <option value="MM-DD-YYYY HH:mm:ss">mm-dd-yyyy hh:mm:ss</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.title}>
                            Visualization
                        </div>
                        <div className={styles.pair}>
                            <div className={styles.name}>
                                <div>
                                    Preferred board view
                                </div>
                            </div>
                            <div className={styles.value}>
                                <select id="boardViewSelect" name="boardViewSelect" {...register("boardViewSelect")}>
                                    <option value="2d">2d</option>
                                    <option value="3d">3d</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.pair}>
                            <div className={styles.name}>
                                <div>
                                    Style of chess pieces
                                </div>
                            </div>
                            <div className={styles.value}>
                                <select id="piecesStyleSelect" name="piecesStyleSelect" {...register("piecesStyleSelect")}>
                                    <option value="outlined">Outlined</option>
                                    <option value="filled">Filled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type='submit' className={`${styles.button} ${styles.applyButton}`}>
                            Apply Changes
                        </button>
                        <div onClick={() => reset()} className={`${styles.button} ${styles.resetButton}`}>
                            Reset fields
                        </div>
                    </div>
                </form>
            </BasicContainer>
        </div>
    )
}
