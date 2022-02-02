import axios from 'axios'

export async function getGames(){

    const options = {
        url:'/games',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return await axios(options)

}

export async function getGamedata(gameId){

    const options = {
        url:'/games/' + gameId,
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return await axios(options)

}

export async function doNewMove(gameId, from, to){

    const options = {
        url:'/games/' + gameId + "/newMove",
        method:'POST',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:{ from, to }
    }

    console.log(options)

    return await axios(options)

}

export async function doCancelMove(gameId, username){

    const options = {
        url:'/games/' + gameId + "/cancelMove",
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}
