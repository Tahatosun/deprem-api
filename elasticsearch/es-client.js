const es = require('elasticsearch');
const esClient = es.Client({
    host:'localhost:9200',
    log:'trace'
});

module.exports =esClient;