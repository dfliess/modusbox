const express = require('express');
const trades = require('../../trades');
const ticker = require('../../ticker');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.json({ status: 'OK'}));


router.use('/trades', trades);
router.use('/ticker', ticker);

module.exports = router;