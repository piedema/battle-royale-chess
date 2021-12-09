import axios from 'axios'

export async function getQueue(){

    const options = {
        url:'/lobby/queue',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function doPlaceInQueue(gametype){

    const options = {
        url:'/lobby/queue/' + gametype,
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function doRemoveFromQueue(){

    const options = {
        url:'/lobby/queue/',
        method:'DELETE',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function getGameId(username){

    const options = {
        url:'/games/getGameIdForPlayer/' + username,
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}
