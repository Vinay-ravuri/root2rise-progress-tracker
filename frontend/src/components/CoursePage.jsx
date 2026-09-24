import { useState, useEffect } from 'react';
import { getCourse, completeLesson } from '../api';

const LEARNER_ID = 1;

export default function CoursePage({ courseId, onBack }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [lessonMsg, setLessonMsg] = useState({});

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourse(courseId, LEARNER_ID);
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(lessonId) {
    setCompletingId(lessonId);
    setLessonMsg({});
    try {
      const result = await completeLesson(lessonId, LEARNER_ID);
      setLessonMsg({ [lessonId]: result.message });
      // Refresh course data to get updated completion status from DB
      const data = await getCourse(courseId, LEARNER_ID);
      setCourse(data);
    } catch (err) {
      setLessonMsg({ [lessonId]: err.message });
    } finally {
      setCompletingId(null);
    }
  }

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={loadCourse}>Retry</button>
      </div>
    );
  }

  if (!course) {
    return <div className="empty-state">Course not found.</div>;
  }

  const totalLessons = course.lessons.length;
  const completedCount = course.lessons.filter((l) => l.completed).length;
  const percentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="course-page">
      <button className="btn btn-back" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-desc">{course.description}</p>
      </div>

      <div className="course-progress-section">
        <div className="progress-info">
          <span>
            {completedCount} of {totalLessons} lessons completed ({percentage}%)
          </span>
        </div>
        <div className="progress-bar large">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <h2>Lessons</h2>

      {course.lessons.length === 0 ? (
        <div className="empty-state">No lessons available for this course.</div>
      ) : (
        <div className="lesson-list">
          {course.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`lesson-item ${lesson.completed ? 'completed' : ''}`}
            >
              <div className="lesson-info">
                <span className="lesson-index">{index + 1}</span>
                <div>
                  <h3>{lesson.title}</h3>
                  {lesson.content_or_url && (
                    <a
                      href={lesson.content_or_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lesson-link"
                    >
                      View Resource ↗
                    </a>
                  )}
                </div>
              </div>
              <div className="lesson-actions">
                {lesson.completed ? (
                  <span className="badge completed-badge">✓ Completed</span>
                ) : (
                  <button
                    className="btn btn-complete"
                    onClick={() => handleComplete(lesson.id)}
                    disabled={completingId === lesson.id}
                  >
                    {completingId === lesson.id ? 'Completing...' : 'Complete'}
                  </button>
                )}
              </div>
              {lessonMsg[lesson.id] && (
                <p className="msg lesson-msg">{lessonMsg[lesson.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
