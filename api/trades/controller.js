const { success, notFound } = require('../../services/response');
const log4js = require('log4js');
const logger = log4js.getLogger('trades.controller');
const influx = require('../../services/influxdb')();
const { escape } = require('influx');

const create = ({ body : { exchange, qty, price, time } }, res, next) => {
    //TODO: validate body (maybe with bodymen ?)
    let point = {
        measurement: 'trades',
        tags: { exchange },
        fields: { 
            qty: parseInt(qty), 
            price: parseFloat(price) 
        },
        timestamp: time ? new Date(time) : new Date()
    };

    return influx.writePoints([point])
    .then(() => {
        return { 
            ...point.fields,
            ...point.tags,
            time: point.timestamp
        };
    })
    .then(success(res, 201))
    .catch(next);
}

const index = async (req, res, next) =>  {
    let offset = parseInt(req.query.offser) || 0;
    let limit = parseInt(req.query.limit) || 10;
    return influx.query(`select * from trades ORDER BY time DESC LIMIT ${limit} OFFSET ${offset}`)
    .then(success(res))
    .catch(next)
}

const show = ({ params: { exchange, time} }, res, next) => {
    let timestamp = time ? new Date(time) : new Date();
    let query = `select * from trades where exchange = '${escape.tag(exchange)}' and time = '${timestamp.toISOString()}'`;
    logger.debug(query);

    return influx.query(query)
    .then(result => {
        if ( result && result.length === 1 ) {
            return result[0];
        }
        else {
            return null;
        }
    })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

const update = (req, res, next) => {
    logger.warn('Somebody is trying to update a trade', req.params, req.body);
    res.status(403).json({ message: 'Can not update trades, you should reverse them' });
}

module.exports = {
	index,
	show,
	update,
	create
}