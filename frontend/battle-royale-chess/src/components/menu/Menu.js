import { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { NavLink } from 'react-router-dom'

import { AuthenticationContext } from '../../contexts/AuthenticationContext'

import styles from './Menu.module.css'

export default function Menu({ title, buttons }){

    const history = useHistory()

    const { logout } = useContext(AuthenticationContext)

    return (
        <div className={styles.container}>
            <div className={styles.menuOuter}>
                <div className={styles.menuInner}>
                    <div className={styles.pageTitle}>
                        {title}
                    </div>
                    <div className={styles.buttons}>
                        {
                            buttons.map(b => {

                                return (
                                    <div className={styles.categoryButton} onClick={b.onClick} >
                                        {b.text}
                                    </div>
                                )

                            })
                        }
                        <div className={styles.categoryButton} onClick={() => history.push('/')} >
                            Return to Lobby
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
