const express = require('express');
const router = express.Router();
const { markComplete } = require('../controllers/lessonController');

router.post('/:id/complete', markComplete);

module.exports = router;
