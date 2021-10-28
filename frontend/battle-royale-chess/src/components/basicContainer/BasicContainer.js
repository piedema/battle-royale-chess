import styles from './BasicContainer.module.css';

export default function BasicContainer({ children, outerStyle, innerStyle }){

    return (
        <div className={styles.outerContainer} style={outerStyle}>
            <div className={styles.innerContainer} style={innerStyle}>
                { children }
            </div>
        </div>
    )
}
