const API_BASE = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = res.status;
    throw error;
  }

  return data;
}

export function getAllCourses() {
  return request('/courses');
}

export function getCourse(id, learnerId) {
  const query = learnerId ? `?learnerId=${learnerId}` : '';
  return request(`/courses/${id}${query}`);
}

export function enrollInCourse(learnerId, courseId) {
  return request('/enroll', {
    method: 'POST',
    body: JSON.stringify({ learnerId, courseId }),
  });
}

export function completeLesson(lessonId, learnerId) {
  return request(`/lessons/${lessonId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ learnerId }),
  });
}

export function getLearnerProgress(learnerId) {
  return request(`/learners/${learnerId}/progress`);
}
