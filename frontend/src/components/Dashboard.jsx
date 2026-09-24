import { useState, useEffect } from 'react';
import { getAllCourses, enrollInCourse, getLearnerProgress } from '../api';

const LEARNER_ID = 1;

export default function Dashboard({ onViewCourse }) {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, progressData] = await Promise.all([
        getAllCourses(),
        getLearnerProgress(LEARNER_ID),
      ]);
      setCourses(coursesData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(courseId) {
    setEnrollingId(courseId);
    setEnrollMsg({});
    try {
      const result = await enrollInCourse(LEARNER_ID, courseId);
      setEnrollMsg({ [courseId]: result.message });
      // Refresh progress after enrollment
      const progressData = await getLearnerProgress(LEARNER_ID);
      setProgress(progressData);
    } catch (err) {
      setEnrollMsg({ [courseId]: err.message });
    } finally {
      setEnrollingId(null);
    }
  }

  function isEnrolled(courseId) {
    if (!progress || !progress.courses) return false;
    return progress.courses.some((c) => c.courseId === courseId);
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {progress?.learner?.name || 'Learner'}</h1>
          <p className="subtitle">Your Micro-Learning Dashboard</p>
        </div>
        {progress && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-value">{progress.totalEnrolledCourses}</span>
              <span className="stat-label">Enrolled</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {progress.completedLessons}/{progress.totalLessons}
              </span>
              <span className="stat-label">Lessons</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{progress.completionPercentage}%</span>
              <span className="stat-label">Complete</span>
            </div>
          </div>
        )}
      </div>

      <h2>Available Courses</h2>

      {courses.length === 0 ? (
        <div className="empty-state">No courses available yet.</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const courseProgress = progress?.courses?.find(
              (c) => c.courseId === course.id
            );
            return (
              <div key={course.id} className="course-card">
                <div className="course-card-header">
                  <h3>{course.title}</h3>
                  {enrolled && <span className="badge enrolled">Enrolled</span>}
                </div>
                <p className="course-desc">{course.description}</p>

                {courseProgress && (
                  <div className="mini-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${courseProgress.completionPercentage}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {courseProgress.completedLessons}/{courseProgress.totalLessons} lessons
                      ({courseProgress.completionPercentage}%)
                    </span>
                  </div>
                )}

                <div className="course-card-actions">
                  {enrolled ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => onViewCourse(course.id)}
                    >
                      View Course
                    </button>
                  ) : (
                    <button
                      className="btn btn-enroll"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                    >
                      {enrollingId === course.id ? 'Enrolling...' : 'Enroll'}
                    </button>
                  )}
                </div>

                {enrollMsg[course.id] && (
                  <p className="msg">{enrollMsg[course.id]}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
