# Root2Rise Progress Tracker — Backend

Node.js + Express REST API for the Micro-Learning Progress Tracker.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

3. **Create database and seed data:**
   ```bash
   mysql -u root -p < schema.sql
   mysql -u root -p < seed.sql
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000` by default.

## API Endpoints

| Method | Endpoint                      | Description                  |
|--------|-------------------------------|------------------------------|
| POST   | `/api/enroll`                 | Enroll a learner in a course |
| GET    | `/api/courses`                | List all courses             |
| GET    | `/api/courses/:id`            | Get course with lessons      |
| POST   | `/api/lessons/:id/complete`   | Mark a lesson as complete    |
| GET    | `/api/learners/:id/progress`  | Get learner progress         |
| GET    | `/api/health`                 | Health check                 |
