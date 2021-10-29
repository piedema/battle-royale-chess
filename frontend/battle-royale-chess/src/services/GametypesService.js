import handleError from '../helpers/errorHandler'
import apiCaller from '../helpers/apiCaller'

export async function getGametypes(){

    const options = {
        url:'/gametypes',
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
