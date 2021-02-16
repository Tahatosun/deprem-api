const client = require('./es-client');

async function addMappingToIndex(mapping,index) {
    try {
        console.log(client.indices)
       
        await client.indices.putMapping({
            index: index,
            body: mapping
        });
    } catch (error) {
        console.trace(error);
    }


}
module.exports = addMappingToIndex;