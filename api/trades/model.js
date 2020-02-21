const Influx = require('influx');

module.exports = {
    measurement: 'trades',
    fields: {
        qty: Influx.FieldType.INTEGER,
        price: Influx.FieldType.FLOAT
    },
    tags: [
        'exchange'
    ]
}