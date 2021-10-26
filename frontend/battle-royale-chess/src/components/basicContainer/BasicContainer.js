import styles from './BasicContainer.module.css';

export default function BasicContainer({ children }){

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                { children }
            </div>
        </div>
    )
}
