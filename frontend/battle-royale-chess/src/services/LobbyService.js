import handleError from '../helpers/errorHandler'
import apiCaller from '../helpers/apiCaller'

export async function getQueue(){

    const options = {
        url:'/lobby/queue',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true
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
            'Content-Type': 'application/json'
        },
        withCredentials:true
    }

    return apiCaller(options)

}

export async function removeFromQueue(gametype){

    const options = {
        url:'/lobby/queue/',
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true
    }

    return apiCaller(options)

}
