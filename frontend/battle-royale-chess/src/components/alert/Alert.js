import BasicContainer from '../basicContainer/BasicContainer'

import styles from './Alert.module.css';

export default function AlertContainer({ message, type, timeout, destroy }){

    return (
        <div className={styles.alertContainer} onClick={() => {destroy(null)}}>
            <BasicContainer>
                { message }
            </BasicContainer>
        </div>
    )
}
