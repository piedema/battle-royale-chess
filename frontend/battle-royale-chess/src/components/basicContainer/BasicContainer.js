import styles from './BasicContainer.module.css';

export default function basicContainer({ children }){

    return (
        <div style={styles.outerContainer}>
            <div style={styles.innerContainer}>
                { children }
            </div>
        </div>
    )
}
