import { useState } from 'react';
import Dashboard from './components/Dashboard';
import CoursePage from './components/CoursePage';

export default function App() {
  const [currentCourseId, setCurrentCourseId] = useState(null);

  function handleViewCourse(courseId) {
    setCurrentCourseId(courseId);
  }

  function handleBackToDashboard() {
    setCurrentCourseId(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo" onClick={handleBackToDashboard}>
            Root<span className="logo-accent">2</span>Rise
          </h1>
          <span className="header-tag">Micro-Learning Tracker</span>
        </div>
      </header>

      <main className="app-main">
        {currentCourseId ? (
          <CoursePage
            courseId={currentCourseId}
            onBack={handleBackToDashboard}
          />
        ) : (
          <Dashboard onViewCourse={handleViewCourse} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Root2Rise Progress Tracker</p>
      </footer>
    </div>
  );
}
