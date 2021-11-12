import handleError from '../helpers/errorHandler'
import apiCaller from '../helpers/apiCaller'

export async function getUserdata(errorHandler = false){

    const options = {
        url:'/users',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true
    }

    return apiCaller(
        options,
        error => {
            if(errorHandler !== false) errorHandler()
            handleError(error)
            return {}
        }
    )

}

export async function getSpecificUserdata(username){

    const options = {
        url:`/users/${username}`,
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
            return {}
        }
    )

}

export async function getAllUserdata(){

    const options = {
        url:'/users/all',
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

export async function updateUser(updatedUser){

    const options = {
        url:'/users',
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true,
        data:updatedUser
    }

    return apiCaller(
        options,
        error => {
            handleError(error)
            return []
        }
    )

}

export async function doRegister(username, password, email){

    const options = {
        url:'/register',
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true,
        data:{
            username,
            password,
            email,
            authorities:["ROLE_USER"]
        }
    }

    return apiCaller(options)

}
