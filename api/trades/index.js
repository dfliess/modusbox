const express = require('express');
const {create, index, show, update, destroy} = require('./controller');
const router = express.Router();

/**
 * GET Trades (some as an example)
 */
router.get('/', index);

/**
 * GET one trade. Expects the exchange symbol and ISO time 
 */
router.get('/:exchange/:time/', show);

/**
 * POST a Trade
 */
router.post('/', create);

/**
 * PUT a Trade 
 * Not allowed throws Frobidde Error
 */
router.put('/:exchange/:time', update);

module.exports = router;

