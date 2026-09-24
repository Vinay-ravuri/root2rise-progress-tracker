const { enrollLearner } = require('../services/enrollService');

async function enroll(req, res, next) {
  try {
    const { learnerId, courseId } = req.body;

    if (!learnerId || !courseId) {
      return res.status(400).json({ error: 'learnerId and courseId are required' });
    }

    if (!Number.isInteger(Number(learnerId)) || !Number.isInteger(Number(courseId))) {
      return res.status(400).json({ error: 'learnerId and courseId must be integers' });
    }

    const result = await enrollLearner(Number(learnerId), Number(courseId));

    if (result.alreadyEnrolled) {
      return res.status(200).json({ message: 'Already enrolled in this course' });
    }

    return res.status(201).json({
      message: 'Successfully enrolled',
      enrollmentId: result.enrollmentId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { enroll };
