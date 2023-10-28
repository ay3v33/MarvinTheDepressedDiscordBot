const Fish = require('../../models/fish');

//Fish adding function
async function addFish(name, img, rarity, val){
    await Fish.findOrCreate({where: {
        name: name,
        image: img,
        rarity: rarity,
        value: val,
    }});
}

//Fishes to Add
addFish('test2', null, 20.0, 5);