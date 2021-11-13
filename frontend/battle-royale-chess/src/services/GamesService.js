import handleError from '../helpers/errorHandler'
import apiCaller from '../helpers/apiCaller'

export async function getGames(){

    const options = {
        url:'/games',
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

export async function getGamedata(gameId){

    const options = {
        url:'/games/' + gameId,
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

export async function postNewMove(gameId, from, to){

    const options = {
        url:'/games/' + gameId + "/newMove",
        method:'POST',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:{ from, to }
    }

    return apiCaller(
        options,
        error => {
            handleError(error)
            return {}
        }
    )

}

export async function cancelMove(gameId, username){

    // this endpoint is not available on backend yet

    const options = {
        url:'/games/' + gameId + "/cancelMove",
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
            return {}
        }
    )

}
