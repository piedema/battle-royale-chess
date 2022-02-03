const containsDigit = require('../helpers/containsDigit')

test(
    'Controleer of containsDigit false geeft wanneer er geen digit in een string zit',
    () => {

        const string = 'abcdefg'

        expect(containsDigit(string)).toBe(false)

    }
)

test(
    'Controleer of containsDigit true geeft wanener er een cijfer in een string zit',
    () => {

        const string = 'abcdefg2'

        expect(containsDigit(string)).toBe(true)

    }
)
