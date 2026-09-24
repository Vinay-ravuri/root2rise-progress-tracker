const express = require('express');
const router = express.Router();
const { getProgress } = require('../controllers/progressController');

router.get('/:id/progress', getProgress);

module.exports = router;
