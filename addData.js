const Econ = require('./models/econ');
require('dotenv').config();

//Manually add to db
const add = (id, database, username) => {
    database.findOrCreate({
        where: {userid: 'placeholder'},
        defaults: {
            userid: id,
            username: username, 
            schmeckels: 500,
        }
    });
}

//add();




//manually remove
const remove = async (id, database) => {
    const data = await database.findOne({ where: { userid: id } });
    data.destroy();
}
//remove();