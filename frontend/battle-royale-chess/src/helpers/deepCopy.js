module.exports = inObject => {

    // copy an object and copy all it's children
    // to end up with a completely new object without any references

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
