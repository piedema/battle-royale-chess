import axios from 'axios'

export async function getGametypes(){

    const options = {
        url:'/gametypes',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function doUpdateGametype(updatedGametype){

    const options = {
        url:'/admin/gametype',
        method:'PUT',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:updatedGametype
    }

    return await axios(options)

}

export async function doCreateGametype(
    gametype,
    numberOfPlayers,
    circleShrinkAfterNRounds,
    circleShrinkOffset,
    timePerRound,
    initialDelay,
    board,
    playerDirections
){

    const options = {
        url:'/admin/gametype',
        method:'POST',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:{
            gametype,
            numberOfPlayers,
            circleShrinkAfterNRounds,
            circleShrinkOffset,
            timePerRound,
            initialDelay,
            board,
            playerDirections
        }
    }

    return await axios(options)

}
