import axios from 'axios'

export async function getAllPlayersdata(){

    const options = {
        url:'/players',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    return await axios(options)

}

export async function getChessComProfile(username){

    const options = {
        url:`https://api.chess.com/pub/player/${username}`,
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        const result = await axios(options)

        return result.data

    } catch (error) {

        return undefined

    }

}

export async function getChessComStats(username){

    const options = {
        url:`https://api.chess.com/pub/player/${username}/stats`,
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        const result = await axios(options)

        return result.data

    } catch (error) {

        return undefined

    }

}
