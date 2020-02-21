const { success, notFound } = require('../../services/response');
const log4js = require('log4js');
const logger = log4js.getLogger('ticker.controller');
const influx = require('../../services/influxdb')();
const redis = require('../../services/redis')();
const { escape } = require('influx');

/* 
 * We assume a session to be full day. we may check market hours in future
 */

const getLastSessionData = async (exchange) => {
    //if cached on redis return it
    let cached = await redis.get(`stats:${exchange}:last`);
    if (cached)  {
        logger.debug('Returning cached data', `stats:${exchange}:last`,  cached);
        return JSON.parse(cached);
    }
    
    logger.debug(`Stats for ${exchange} not in cache`);
    //Fetch data from influxh
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); 
    let start = new Date(yesterday.getTime());
    start.setHours(0,0,0,0);
    let end = new Date(yesterday.getTime());
    end.setHours(23,59,59,99);
    
    let query = `SELECT MAX(price), MIN(price), SUM(qty) as volume, LAST(price) as last
                FROM trades 
                WHERE exchange = '${escape.tag(exchange)}' and time >= '${start.toISOString()}' and time <= '${end.toISOString()}'`;

    logger.debug(`Querying InfluxDB for Last Sesison Data of ${exchange}`);
    let data = await influx.query(query);

    //If we have yesterday markets data, store it in cache
    if (data && data.length) {
        let key = `stats:${exchange}:last`;
        let todayEnd = new Date().setHours(23,59,59,99);
        redis.set(key,JSON.stringify(data[0]));
        redis.expireat(key,parseInt(todayEnd/1000));
        return data[0];
    }
    
    return null; //No previouse data
}

const index = (req, res, next) =>  {
    let start = new Date();
    start.setHours(0,0,0,0);
    let query = `SELECT MAX(price), MIN(price), SUM(qty) as volume, LAST(price) as last
                FROM trades WHERE time >= '${start.toISOString()}' and time < now()
                GROUP BY exchange`;

    logger.debug('Querying InfluxDB for today stats', query)

    return influx.query(query)
    .then(results => {

        return Promise.map(results, result => {
            //remove influx time from each result and get only the exchange stats
            const { time, ...data} = result;
            //get last session data and calculate variatin
            return getLastSessionData(data.exchange)
            .then(lastSession => {
                let variation = lastSession ? (data.last-lastSession.last)/lastSession.last*100 : 0;
                variation = Math.round((variation + Number.EPSILON) * 100) / 100; //Round 2 places
                
                return {
                    ...data,
                    lastSession,
                    "percentageChange": variation
                }
            })
        });
        
    })
    .then(success(res))
    .catch(next)
}


module.exports = {
	index
}