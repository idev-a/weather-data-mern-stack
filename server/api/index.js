const express = require('express');
const filter = require('./filter');
const search = require('./search');
const venue = require('./venue');

const router = express.Router();

router.use('/search', search);
router.use('/filter', filter);
router.use('/venue', venue);

module.exports = router;
