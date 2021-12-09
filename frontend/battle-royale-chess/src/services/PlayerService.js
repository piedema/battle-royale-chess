import axios from 'axios'

export async function getPlayerdata(){

    const options = {
        url:'/players',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function getAllPlayersdata(){

    const options = {
        url:'/players/all',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}
