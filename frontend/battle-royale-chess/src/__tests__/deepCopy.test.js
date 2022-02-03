const deepCopy = require('../helpers/deepCopy')

const testObject = {
    name:"test"
}

const newObject = deepCopy(testObject)

test(
    'Controleer of deepCopy een object tergugeeft met dezelfde keys en values',
    () => {


        expect(JSON.stringify(newObject)).toBe(JSON.stringify(testObject))

    }
)

test(
    'Controleer of deepCopy een nieuw object teruggeeft',
    () => {

        expect(newObject).not.toBe(testObject)

    }
)
