const asyncRedis = require("async-redis");
const { redis: config } = require('../config');
const log4js = require('log4js');
const logger = log4js.getLogger('services.influx');

/**
* Service to Connect to influx db
*
* @returns {object} influx connection
* @public
*/
let client;

module.exports = () => {
    if (client) return client;
    logger.debug('Connecting to Redis', config);
    client = asyncRedis.createClient(config);
    
    return client;
}

