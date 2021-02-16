const client = require('./es-client');
const createIndex = async function (index) {
    try {
        return await client.indices.get({
            index: index
        });
    }
    catch (e) {
        return await client.indices.create({
            index: index
        });
    }
}
 
module.exports = createIndex;