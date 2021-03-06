import axios from 'axios'

export async function doAuthenticate(username, password){

    const options = {
        url:'/authenticate',
        method:'POST',
        data:{
            username,
            password
        }
    }

    return await axios(options)

}

export function extractRole(authorities){

    let role = "USER"

    for(let a of authorities){

        if(a.authority === "ROLE_ADMIN"){

            role = "ADMIN"

        }

    }

    return role

}

export async function getUserdata(){

    const options = {
        url:'/users',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }

    return await axios(options)

}

export async function getSpecificUserdata(username){

    const options = {
        url:`/admin/${username}`,
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }

    return await axios(options)

}

export async function getAllUserdata(){

    const options = {
        url:'/admin/users',
        method:'GET',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }

    return await axios(options)

}

export async function doUpdateUser(updatedUser){

    const options = {
        url:'/users',
        method:'PUT',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:updatedUser
    }

    return await axios(options)

}

export async function doRegister(username, password, email, chessCom){

    const options = {
        url:'/register',
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            username,
            password,
            email,
            chessCom
        }
    }

    return await axios(options)

}

export async function doCreateUser(username, password, email, authorities, chessCom){

    const options = {
        url:'/admin/user',
        method:'POST',
        headers: {
            Authorization:'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data:{
            username,
            password,
            email,
            authorities,
            chessCom
        }
    }

    return await axios(options)

}

export async function emailExists(email){

    const options = {
        url:'/users/emailExists',
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            email
        }
    }

    let result = await axios(options)

    return result.data

}

export async function usernameExists(username){

    const options = {
        url:'/users/usernameExists',
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            username
        }
    }

    let result = await axios(options)

    return result.data

}

export async function chessComAccountExists(username){

    const options = {
        url:`https://api.chess.com/pub/player/${username}`,
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        await axios(options)

        return true

    } catch (error) {

        return false

    }

}
