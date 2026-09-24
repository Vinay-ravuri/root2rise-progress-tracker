# Micro-Learning Progress Tracker

A full-stack web application that helps learners enroll in courses, follow lessons in order, track completed lessons, and monitor their learning progress.

**Repository:** https://github.com/Vinay-ravuri/root2rise-progress-tracker

## Features

* **Course enrollment:** Enroll a learner in a course.
* **Ordered lessons:** View course lessons in their defined sequence.
* **Lesson completion:** Mark lessons as completed and save progress.
* **Progress tracking:** View a learner’s progress across enrolled courses.
* **Persistent storage:** Store learners, courses, lessons, enrollments, and completion records in MySQL.
* **Duplicate protection:** Use database constraints to prevent duplicate enrollment and lesson-completion records.

## Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Frontend        | React, Vite, JavaScript |
| Backend         | Node.js, Express.js     |
| Database        | MySQL                   |
| Database driver | mysql2                  |
| API style       | REST                    |

## Project Structure

```text
root2rise-progress-tracker/
├── APPROACH.md
├── README.md
├── .gitignore
├── backend/
│   ├── README.md
│   ├── package.json
│   ├── schema.sql
│   ├── seed.sql
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── server.js
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── api.js
        ├── components/
        └── index.css
```

## Prerequisites

Install the following before running the project:

* Node.js and npm
* MySQL Server
* MySQL Workbench (optional, for database management)
* Git

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/Vinay-ravuri/root2rise-progress-tracker.git
cd root2rise-progress-tracker
```

### 2. Create the MySQL database

Start your local MySQL server and open MySQL Workbench or a MySQL terminal.

Create the database:

```sql
CREATE DATABASE root2rise_tracker;
```

Select the database:

```sql
USE root2rise_tracker;
```

Run the schema and seed scripts from the `backend` folder, in this order:

```bash
mysql -u root -p root2rise_tracker < backend/schema.sql
mysql -u root -p root2rise_tracker < backend/seed.sql
```

Enter your MySQL password when prompted. If you already have tables and seed records from a previous setup, check the scripts before running them again to avoid duplicate data or conflicts.

### 3. Configure backend environment variables

Go to the backend directory:

```bash
cd backend
```

Create a local `.env` file by copying `.env.example`:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Edit `.env` with your local MySQL connection settings:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=root2rise_tracker
```

Replace `your_mysql_password` with your own MySQL password. Do not commit or share your `.env` file. The `.env.example` file is provided as a configuration template.

### 4. Install and start the backend

From the `backend` directory:

```bash
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Keep this terminal open while using the application. If your backend `package.json` does not define a `dev` script, use the start script provided there.

### 5. Install and start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal. It is typically:

```text
http://localhost:5173
```

## API Documentation

The backend exposes REST endpoints for enrollment, course details, lesson completion, and learner progress.

### 1. Enroll a learner in a course

**`POST /api/enroll`**

Enroll a learner in a course.

Example request body:

```json
{
  "learnerId": 1,
  "courseId": 1
}
```

The request should use learner and course IDs that exist in the database.

### 2. Get course details and lessons

**`GET /api/courses/:id`**

Retrieve a course and its lessons, ordered by lesson sequence.

Example:

```http
GET /api/courses/1
```

The course ID in the URL should refer to an existing course.

### 3. Mark a lesson as complete

**`POST /api/lessons/:id/complete`**

Record a learner’s completion of a lesson.

Example:

```http
POST /api/lessons/1/complete
Content-Type: application/json
```

```json
{
  "learnerId": 1
}
```

The learner and lesson must exist, and the learner should be enrolled in the lesson’s course according to the application’s enrollment rules.

### 4. Get learner progress

**`GET /api/learners/:id/progress`**

Retrieve progress information for a learner.

Example:

```http
GET /api/learners/1/progress
```

The response is generated from the learner’s enrollment and lesson-completion records.

> **Note:** Refer to the backend controllers and service files for the exact response JSON and error formats implemented in this repository.

## Database Design

The application uses relational tables to represent learners, courses, lessons, enrollments, and lesson completion.

| Entity               | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `learners`           | Stores learner information                             |
| `courses`            | Stores available courses                               |
| `lessons`            | Stores lessons associated with courses and their order |
| `course_enrollments` | Stores learner-to-course enrollment records            |
| `lesson_progress`    | Stores learner-to-lesson completion records            |

### Data integrity and concurrency

The database is responsible for preventing duplicate records, including when multiple completion requests arrive at nearly the same time.

* A unique constraint on the learner and course pair prevents duplicate enrollments.
* A unique constraint on the learner and lesson pair prevents duplicate completion records.
* Foreign keys keep enrollment and progress records linked to existing learners, courses, and lessons.

The frontend may improve the user experience by reflecting a completed lesson, but database constraints are the key protection against duplicate records.

## Testing Checklist

After starting the application, verify the following:

* [ ] The course list loads from the backend.
* [ ] A learner can enroll in a course.
* [ ] Course lessons appear in the correct order.
* [ ] A learner can complete a lesson.
* [ ] Completed lesson status remains after refreshing the page.
* [ ] The progress view reflects completed lessons.
* [ ] Repeating a completion request does not create a duplicate progress record.
* [ ] Invalid learner, course, or lesson IDs are handled without crashing the server.

For a database-level duplicate check, run:

```sql
SELECT learner_id, lesson_id, COUNT(*) AS total
FROM lesson_progress
GROUP BY learner_id, lesson_id
HAVING COUNT(*) > 1;
```

A correct result for this check is **no rows returned**.

## Environment and Security

* Store local credentials in `backend/.env`.
* Keep `.env` out of version control.
* Use `.env.example` as a template for required configuration.
* Do not publish database passwords, tokens, or other secrets.

## Approach and Design Notes

See [`APPROACH.md`](./APPROACH.md) for the project’s schema decisions, architecture, concurrency protection, tradeoffs, and AI-tool usage.

## Author

**Ravuri Vinay**
GitHub: [Vinay-ravuri](https://github.com/Vinay-ravuri)

## License

No license has been specified for this project yet.
