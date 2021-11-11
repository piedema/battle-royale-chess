import styles from './BasicContainer.module.css';

export default function BasicContainer({ children, outerStyle, innerStyle }){

    return (
        <div>
            <div className={styles.outerContainer} style={outerStyle}>
                <div className={styles.innerContainer} style={innerStyle}>
                    { children }
                </div>
            </div>
            <div className={styles.marginBottomFix}></div>
        </div>
    )
}
