module.exports = (() => {

    const pieces = [
        {
            stroke:"#346340",
            fill:"#cae8d2"
        },
        {
            stroke:"#635334",
            fill:"#e8dcca"
        },
        {
            stroke:"#633434",
            fill:"#e8caca"
        },
        {
            stroke:"#346340",
            fill:"#bce8e5"
        },
        {
            stroke:"#2a3157",
            fill:"#cacfe8"
        },
        {
            stroke:"#592e66",
            fill:"#e1cae8"
        },
        {
            stroke:"#545925",
            fill:"#e5e8ca"
        },
        {
            stroke:"darkred",
            fill:"orangered"
        }
    ]

    return  {
        pieces:index => { return pieces[key] }
    }

})()
