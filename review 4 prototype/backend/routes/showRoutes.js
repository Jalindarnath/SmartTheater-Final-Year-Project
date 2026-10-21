const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

router.get('/:showId/seats', showController.getShowSeats);

module.exports = router;
