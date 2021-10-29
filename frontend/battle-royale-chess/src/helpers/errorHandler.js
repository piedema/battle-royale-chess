export default function handleError(error){

    alert(JSON.stringify(error.response || error))
}
