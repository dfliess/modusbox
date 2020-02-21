const Influx = require('influx');
const { influx: config } = require('../config');
const trades = require('../api/trades/model')
const log4js = require('log4js');
const logger = log4js.getLogger('services.influx');

/**
* Service to Connect to influx db
*
* @returns {object} influx connection
* @public
*/
let influx;

module.exports = () => {
    if (influx) return influx;
    logger.debug('Connecting to InfluxDB', config);
    influx = new Influx.InfluxDB({
        ...config,
        schema: [
            trades
        ]
    });

    //Check for database to exists
    influx.getDatabaseNames().then(dbs =>  {
        logger.debug('Checking Database', config.database, dbs)
        if (!dbs.includes(config.database)) {
            logger.debug('Creating Database', config.database)
            return influx.createDatabase(config.database);
        }
    }).catch((e) => logger.error('Error checking DB', e));
    
    return influx;
}

