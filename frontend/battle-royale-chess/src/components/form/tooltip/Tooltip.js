import styles from './Tooltip.module.css'

export default function Tooltip({ children }){

    return (
        <div className={styles.container}>
            <ul>
                <li>{children}</li>
            </ul>
        </div>
    )
}
