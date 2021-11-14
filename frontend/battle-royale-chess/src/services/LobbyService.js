import handleError from '../helpers/errorHandler'
import apiCaller from '../helpers/apiCaller'

export async function getQueue(){

    const options = {
        url:'/lobby/queue',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return apiCaller(
        options,
        error => {
            handleError(error)
            return []
        }
    )

}

export async function placeInQueue(gametype){

    const options = {
        url:'/lobby/queue/' + gametype,
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return apiCaller(options)

}

export async function removeFromQueue(){

    const options = {
        url:'/lobby/queue/',
        method:'DELETE',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return apiCaller(options)

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

    return apiCaller(
        options,
        error => {
            handleError(error)
            return undefined
        }
    )

}
