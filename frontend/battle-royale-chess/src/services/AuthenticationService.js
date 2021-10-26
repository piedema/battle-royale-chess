import axios from 'axios'
import Cookies from 'universal-cookie'

export async function authenticate(username, password){

    const cookies = new Cookies()

    const options = {
        url:'/authenticate',
        method:'POST',
        data:{
            username,
            password
        }
    }

    try {

        const result = await axios(options)
        cookies.set('jwt', result.data.jwt, { path: '/' })

    } catch (error) {
        return error
    }

}
