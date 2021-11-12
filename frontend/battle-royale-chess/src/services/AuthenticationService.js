import apiCaller from '../helpers/apiCaller'

export async function authenticate(username, password){

    const options = {
        url:'/authenticate',
        method:'POST',
        data:{
            username,
            password
        }
    }

    return apiCaller(options)

}
