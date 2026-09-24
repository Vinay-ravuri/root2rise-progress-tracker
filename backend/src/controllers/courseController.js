const { getCourseById, getAllCourses } = require('../services/courseService');

async function getCourse(req, res, next) {
  try {
    const { id } = req.params;
    const { learnerId } = req.query;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid course ID is required' });
    }

    const parsedLearnerId = learnerId ? Number(learnerId) : null;

    const course = await getCourseById(Number(id), parsedLearnerId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (err) {
    next(err);
  }
}

async function listCourses(req, res, next) {
  try {
    const courses = await getAllCourses();
    return res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCourse, listCourses };
