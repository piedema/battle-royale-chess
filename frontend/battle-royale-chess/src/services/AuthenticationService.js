import axios from 'axios'

export async function authenticate(username, password){

    const options = {
        url:'/authenticate',
        method:'POST',
        data:{
            username,
            password
        }
    }

    try {

        await axios(options)

    } catch (error) {
        return error
    }

}
