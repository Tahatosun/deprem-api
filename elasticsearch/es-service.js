const client = require('./es-client');
const esMapping = require('./es-mapping');
const elasticIndex = require('./es-index');


client.ping({
    requestTimeout: 1000
}, async function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
        try {
            //create index
            const resp = await elasticIndex('earthquakes');
            console.log("Index:" + resp);

            //Set Mapping
            const mapping = {
                properties: {
                    date: {
                        type: "date",
                        format: "yyyy.MM.dd"
                    },
                    hour: {
                        type: "date",
                        format: "HH:mm:ss"
                    },
                    depth: {
                        type: "float"
                    },
                    mag: {
                        type: "float"
                    },
                    place: {
                        type: "text"
                    },
                    location: {
                        type: "geo_point"
                    }
                }
            }
            esMapping(mapping,"earthquakes");

        } catch (error) {
            console.log(error);
        }
    }
});

const addData = async function (depremler) {
    const body = depremler.flatMap(doc => [{ index: { _index: 'earthquakes' } }, doc])
    const bulkResponse = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        })
        console.log(erroredDocuments)
    }

    const countResult  = await client.count({ index: 'earthquakes' })
    console.log(`Count: ${countResult.count}`);
    
}

const searchByLocation = async function (index, lat, lon,size,radius=50) {
    return await client.search({
        index: index,
        body: {
            size:size,
            query: {
                bool: {
                    must: {
                        match_all: {}
                    },
                    filter: {
                        geo_distance: {
                            distance: `${radius}km`,
                            location: {
                                lat: parseFloat(lat),
                                lon: parseFloat(lon)
                            }
                        }
                    }

                }
            }
        }
    })
}

const searchByMag = async function (index, mag,size) {
    return await client.search({
        index: index,
        body: {
            size: size,

            query: {
                bool: {
                    must: {
                        match_all: {}
                    },
                    filter: {
                        range: {
                            mag: {
                                gte: mag
                            }
                        }
                    }

                }

            }
        }
    })
}

const searchByDate = async function (index, start,end, size) {
    return await client.search({
        index: index,
        body: {
            size: size,
            query: {
                bool: {
                    must: {
                        match_all: {}
                    },
                    filter: {
                        range: {
                            date: {
                                gte: end,
                                lte:start,
                                format: "yyyy.MM.dd"
                            }
                        }
                    }

                }

            }
        }
    })
}

module.exports = {
    addData: addData,
    searchByLocation: searchByLocation,
    searchByMag: searchByMag,
    searchByDate: searchByDate
};