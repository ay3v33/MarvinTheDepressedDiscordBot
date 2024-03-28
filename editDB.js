const Guild = require('./models/guild');
require('dotenv').config();

//Manually add to db
const add = (id, database, username) => {
    if(database == Econ) {
        database.findOrCreate({
            where: {userid: null},
            defaults: {
                userid: id,
                username: username, 
                schmeckels: 500,
            }
        });
    }
}

//find something by id in db
const find = (pkey, database) => {
    if (database == Guild) {
        const data = Guild.findOne({ where: { phrase: pkey } });
    } else if(database == Econ) {
        const data = Econ.findOne({ where: { userid: pkey } });
    }
}

//manually remove
const remove = async (id, database) => {
    const data = await database.findOne({ where: { phrase: id } });
    data.destroy();
}





module.exports = {
    add,
    remove
}

