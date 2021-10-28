import axios from 'axios'

export async function getUserdata(){

    const options = {
        url:'/users',
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials:true
    }

    const response = await axios(options)

    return transformUser(response.data)

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

    const response = await axios(options)

    return transformUser(response.data)

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

    const response = await axios(options)
    const users = response.data.map(user => transformUser(user))

    return users

}

export async function register(username, password, email){

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

    const response = await axios(options)

}

function transformUser(user){

    const { username, email, authorities } = user
    let role = "USER"

    authorities.forEach(a => {
        if(a.authority === "ROLE_ADMIN"){
            role = "ADMIN"
        }
    })

    return { username, email, role }

}
