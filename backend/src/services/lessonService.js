const pool = require('../config/db');

/**
 * Complete a lesson for a learner.
 * Validates: lesson exists, learner is enrolled in the lesson's course.
 * Handles duplicate completion gracefully.
 */
async function completeLesson(lessonId, learnerId) {
  // 1. Check that the lesson exists and get its course_id
  const [lessons] = await pool.execute(
    'SELECT id, course_id FROM lessons WHERE id = ?',
    [lessonId]
  );

  if (lessons.length === 0) {
    return { error: 'Lesson not found', status: 404 };
  }

  const lesson = lessons[0];

  // 2. Check that the learner is enrolled in this course
  const [enrollments] = await pool.execute(
    'SELECT id FROM course_enrollments WHERE learner_id = ? AND course_id = ?',
    [learnerId, lesson.course_id]
  );

  if (enrollments.length === 0) {
    return { error: 'Learner is not enrolled in this course', status: 403 };
  }

  // 3. Insert completion – the UNIQUE constraint handles concurrency
  try {
    const [result] = await pool.execute(
      'INSERT INTO lesson_progress (learner_id, lesson_id) VALUES (?, ?)',
      [learnerId, lessonId]
    );
    return { completed: true, progressId: result.insertId };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { alreadyCompleted: true };
    }
    throw err;
  }
}

module.exports = { completeLesson };
