const pool = require('../config/db');

/**
 * Enroll a learner in a course.
 * Returns { enrolled: true } on success or { alreadyEnrolled: true } on duplicate.
 */
async function enrollLearner(learnerId, courseId) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO course_enrollments (learner_id, course_id) VALUES (?, ?)',
      [learnerId, courseId]
    );
    return { enrolled: true, enrollmentId: result.insertId };
  } catch (err) {
    // MySQL duplicate entry error code
    if (err.code === 'ER_DUP_ENTRY') {
      return { alreadyEnrolled: true };
    }
    throw err;
  }
}

module.exports = { enrollLearner };
