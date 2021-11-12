import { useHistory } from 'react-router-dom'

import styles from './Menu.module.css'

export default function Menu({ title, buttons }){

    const history = useHistory()

    return (
        <div className={styles.container}>
            <div className={styles.menuOuter}>
                <div className={styles.menuInner}>
                    <div className={styles.pageTitle}>
                        {title}
                    </div>
                    <div className={styles.buttons}>
                        {
                            Array.isArray(buttons)
                            ?   buttons.map(b => {

                                    return (
                                        <div key={b.text} className={styles.categoryButton} onClick={b.onClick} >
                                            {b.text}
                                        </div>
                                    )

                                })
                            : null
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
