module.exports = (() => {

    const pieces = [
        {
            stroke:"#4f8751",
            fill:"#a7c3a8"
        },
        {
            stroke:"#4f5687",
            fill:"#a7abc3"
        },
        {
            stroke:"#874f50",
            fill:"#c3a7a8"
        },
        {
            stroke:"#4f8783",
            fill:"#a7c3c1"
        },
        {
            stroke:"#87834f",
            fill:"#c3c1a7"
        },
        {
            stroke:"#834f87",
            fill:"#c1a7c3"
        },
        {
            stroke:"#7d7d7d",
            fill:"#bebebe"
        },
        {
            stroke:"#b7ce3f",
            fill:"#dbe2b9"
        }
    ]

    // const pieces = [
    //     {
    //         stroke:"#346340",
    //         fill:"#cae8d2"
    //     },
    //     {
    //         stroke:"#635334",
    //         fill:"#e8dcca"
    //     },
    //     {
    //         stroke:"#633434",
    //         fill:"#e8caca"
    //     },
    //     {
    //         stroke:"#346340",
    //         fill:"#bce8e5"
    //     },
    //     {
    //         stroke:"#2a3157",
    //         fill:"#cacfe8"
    //     },
    //     {
    //         stroke:"#592e66",
    //         fill:"#e1cae8"
    //     },
    //     {
    //         stroke:"#545925",
    //         fill:"#e5e8ca"
    //     },
    //     {
    //         stroke:"darkred",
    //         fill:"orangered"
    //     }
    // ]

    return  {
        pieces:index => { return pieces[index] }
    }

})()
