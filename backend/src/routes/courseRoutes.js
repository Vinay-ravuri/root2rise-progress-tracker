const express = require('express');
const router = express.Router();
const { getCourse, listCourses } = require('../controllers/courseController');

router.get('/', listCourses);
router.get('/:id', getCourse);

module.exports = router;
