const express = require('express');
const { index } = require('./controller');
const router = express.Router();

/**
 * GET Trades (some as an example)
 */
router.get('/', index);


module.exports = router;

