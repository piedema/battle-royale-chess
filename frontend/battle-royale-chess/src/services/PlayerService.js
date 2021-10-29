import axios from 'axios'

import handleError from '../helpers/errorHandler'

export async function fetchPlayerdata(){

    const options = {
        url:'/players',
        method:'GET',
        headers: {},
        withCredentials:true
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
        headers: {},
        withCredentials:true
    }

    try {
        return await axios(options)
    } catch (error) {
        handleError(error)
        return []
    }

}
