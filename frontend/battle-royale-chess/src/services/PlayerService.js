import axios from 'axios'

import handleError from '../helpers/errorHandler'

export async function fetchPlayerdata(){

    const options = {
        url:'/players',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    try {
        return await axios(options)
    } catch (error) {
        handleError(error)
        return []
    }

}

export async function fetchAllPlayersdata(){

    const options = {
        url:'/players/all',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    try {
        return await axios(options)
    } catch (error) {
        handleError(error)
        return []
    }

}
