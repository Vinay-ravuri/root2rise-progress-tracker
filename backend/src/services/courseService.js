const pool = require('../config/db');

/**
 * Get course by ID with its lessons sorted by order_index ASC.
 * Optionally includes completion status per lesson for a given learner.
 */
async function getCourseById(courseId, learnerId) {
  const [courses] = await pool.execute(
    'SELECT id, title, description, created_at FROM courses WHERE id = ?',
    [courseId]
  );

  if (courses.length === 0) {
    return null;
  }

  const course = courses[0];

  let lessons;

  if (learnerId) {
    // Include completion status for the learner
    const [rows] = await pool.execute(
      `SELECT l.id, l.title, l.content_or_url, l.order_index,
              CASE WHEN lp.id IS NOT NULL THEN 1 ELSE 0 END AS completed
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.learner_id = ?
       WHERE l.course_id = ?
       ORDER BY l.order_index ASC`,
      [learnerId, courseId]
    );
    lessons = rows.map((r) => ({ ...r, completed: Boolean(r.completed) }));
  } else {
    const [rows] = await pool.execute(
      'SELECT id, title, content_or_url, order_index FROM lessons WHERE course_id = ? ORDER BY order_index ASC',
      [courseId]
    );
    lessons = rows;
  }

  return { ...course, lessons };
}

/**
 * Get all courses (summary list).
 */
async function getAllCourses() {
  const [courses] = await pool.execute(
    'SELECT id, title, description, created_at FROM courses ORDER BY id ASC'
  );
  return courses;
}

module.exports = { getCourseById, getAllCourses };
