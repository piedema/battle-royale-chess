import axios from 'axios'

import handleError from '../helpers/errorHandler'

export default async function apiCaller (options, errorHandler = undefined, fullResponse = false) {

    try {

        const response = await axios(options)

        if(fullResponse === true) return response

        return response.data

    } catch (error) {

        if(errorHandler === undefined) return handleError(error)

        errorHandler(error)

    }

}
