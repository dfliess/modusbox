// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, logLevel } = require('./config');
const influx = require('./services/influxdb');
const app = require('./services/express');
const log4js = require('log4js');
const logger = log4js.getLogger();

log4js.configure({
  appenders: {
      colouredConsole: { type: 'stdout' },
  },
  categories: { default: { appenders: ['colouredConsole'], level: logLevel } }
})

//Connect to Influx
logger.debug('Strating Server, checking DB connection');
influx().ping(5000).then(hosts => {
  if (!hosts.some(host => host.online)) {
    logger.error('No InfluxDB host available');
    process.exit(1);
  } else {
      // listen to requests
    app.listen(port, () => logger.info(`Server started on port ${port} ${env}`));
  }
});




/**
* Exports express
* @public
*/
module.exports = app;