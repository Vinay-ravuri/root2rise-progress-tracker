const pool = require('../config/db');

/**
 * Get overall progress for a learner.
 * All progress is calculated from the database, never from client-side counters.
 */
async function getLearnerProgress(learnerId) {
  // 1. Verify learner exists
  const [learners] = await pool.execute(
    'SELECT id, name, email FROM learners WHERE id = ?',
    [learnerId]
  );

  if (learners.length === 0) {
    return null;
  }

  const learner = learners[0];

  // 2. Get enrolled courses count
  const [enrolledRows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM course_enrollments WHERE learner_id = ?',
    [learnerId]
  );
  const totalEnrolledCourses = enrolledRows[0].total;

  // 3. Get total lessons across enrolled courses
  const [totalLessonRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM lessons l
     INNER JOIN course_enrollments ce ON l.course_id = ce.course_id
     WHERE ce.learner_id = ?`,
    [learnerId]
  );
  const totalLessons = totalLessonRows[0].total;

  // 4. Get completed lessons count
  const [completedRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM lesson_progress lp
     INNER JOIN lessons l ON lp.lesson_id = l.id
     INNER JOIN course_enrollments ce ON l.course_id = ce.course_id AND ce.learner_id = lp.learner_id
     WHERE lp.learner_id = ?`,
    [learnerId]
  );
  const completedLessons = completedRows[0].total;

  // 5. Completion percentage
  const completionPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // 6. Per-course progress
  const [perCourse] = await pool.execute(
    `SELECT
       c.id AS courseId,
       c.title,
       COUNT(l.id) AS totalLessons,
       COUNT(lp.id) AS completedLessons,
       ROUND(COUNT(lp.id) / COUNT(l.id) * 100) AS completionPercentage
     FROM course_enrollments ce
     INNER JOIN courses c ON ce.course_id = c.id
     INNER JOIN lessons l ON l.course_id = c.id
     LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.learner_id = ce.learner_id
     WHERE ce.learner_id = ?
     GROUP BY c.id, c.title
     ORDER BY c.id ASC`,
    [learnerId]
  );

  return {
    learner,
    totalEnrolledCourses,
    totalLessons,
    completedLessons,
    completionPercentage,
    courses: perCourse,
  };
}

module.exports = { getLearnerProgress };
