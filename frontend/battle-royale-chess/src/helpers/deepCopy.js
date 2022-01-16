module.exports = inObject => {

    function deepCopy(inObj){

        let outObj, value, key

        if (typeof inObj !== "object" || inObj === null) {

            return inObj

        }

        outObj = Array.isArray(inObj) ? [] : {}

        for (key in inObj) {

            value = inObj[key]

            outObj[key] = deepCopy(value)

        }

        return outObj

    }

    return deepCopy(inObject)

}
