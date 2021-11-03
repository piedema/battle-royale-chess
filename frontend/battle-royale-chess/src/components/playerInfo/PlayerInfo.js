export default function PlayerInfo({ index, players, score, piecesLeft}){

    const styles = {}

    switch (players.length) {
        case 2:
            styles.position = ['s3', 's4'][index]
            break;
        case 3:
            styles.position = ['s0', 's1', 's2'][index]
            break;
        case 4:
            styles.position = ['s0', 's1', 's2', 's5'][index]
            break;
        case 5:
            styles.position = ['s0', 's1', 's3', 's2', 's5'][index]
            break;
        case 6:
            styles.position = ['s0', 's1', 's3', 's4', 's2', 's5'][index]
            break;
        case 7:
            styles.position = ['s0', 's1', 's3', 's4', 's2', 's6', 's5'][index]
            break;
        case 8:
            styles.position = ['s0', 's1', 's3', 's4', 's2', 's7', 's8', 's5'][index]
            break;

        }

    styles.color = 'c' + index

    return (
        <div className={Object.values(styles).join(" ")}>
            Player: {players[index]}<br />
            Score: {score}
            Pieces Left: {piecesLeft}
        </div>
    )

}
