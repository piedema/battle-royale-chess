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
    const { username, email, authorities } = response.data
    let role = "USER"

    authorities.forEach(a => {
        if(a.authority === "ROLE_ADMIN"){
            role = "ADMIN"
        }
    })

    return { username, email, role}

}
