const express = require('express');
const router = express.Router();
const { enroll } = require('../controllers/enrollController');

router.post('/', enroll);

module.exports = router;
