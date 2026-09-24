# APPROACH.md — Root2Rise Micro-Learning Progress Tracker

## 1. Schema and Architecture

### Database Schema

The schema uses five normalized tables:

- **learners** — Stores learner identity (name, email).
- **courses** — Course metadata (title, description).
- **lessons** — Lessons belonging to a course, ordered via `order_index`.
- **course_enrollments** — Many-to-many relationship between learners and courses with a `UNIQUE(learner_id, course_id)` constraint.
- **lesson_progress** — Tracks individual lesson completions with a `UNIQUE(learner_id, lesson_id)` constraint.

Foreign keys enforce referential integrity — you cannot enroll in a non-existent course or complete a non-existent lesson.

### Backend Architecture

The backend follows a layered architecture:

```
Routes → Controllers → Services → Database (mysql2 pool)
```

- **Routes** define the HTTP endpoints and delegate to controllers.
- **Controllers** handle request/response concerns: parsing params, validating input, formatting responses, and choosing HTTP status codes.
- **Services** contain all business logic and database queries. They are framework-agnostic and could be reused with a different HTTP framework.
- **Config** provides the mysql2 connection pool as a shared singleton.

This separation keeps each layer focused and testable.

### Frontend Architecture

The React frontend uses a simple state-based routing approach (no React Router needed for 2 views):

- `App.jsx` — Holds `currentCourseId` state; renders either `Dashboard` or `CoursePage`.
- `Dashboard` — Fetches all courses and learner progress; shows stats and course cards.
- `CoursePage` — Fetches a single course with per-lesson completion status; enables marking lessons complete.
- `api.js` — Centralized API client with error handling.

Progress data is always fetched from the backend (which queries the database), never computed from frontend counters.

---

## 2. Concurrency / Race-Condition Solution

The primary concurrency risk is **duplicate lesson completions** — e.g., a user double-clicks "Complete" or two requests arrive simultaneously.

### How it's handled:

1. **Database-level UNIQUE constraint** on `lesson_progress(learner_id, lesson_id)`:
   - This is the **only** authoritative guard. Even if two identical INSERT statements execute concurrently, the database will reject the second with a `ER_DUP_ENTRY` error.
   - This is an **idempotent** design — the same request can be retried safely.

2. **Application-level graceful handling** of `ER_DUP_ENTRY`:
   - The service layer catches MySQL error code `ER_DUP_ENTRY` and returns `{ alreadyCompleted: true }` instead of throwing.
   - The controller returns HTTP `200` with a message `"Lesson already completed"` rather than a `500` or `409`.

3. **Frontend button disabling** is a UX convenience only:
   - The "Complete" button is disabled while a request is in flight.
   - But the system does **not** rely on this — correctness is enforced at the database level.

The same pattern applies to `course_enrollments(learner_id, course_id)` for duplicate enrollment protection.

### Why not use application-level locks?

A mutex or in-memory lock wouldn't work across multiple server instances. The database UNIQUE constraint works regardless of how many Node.js processes are running.

---

## 3. Trade-offs and What Could Be Improved With Another Week

### Current Trade-offs

| Decision | Trade-off |
|---|---|
| **No authentication** | Any client can act as any learner. Acceptable for a take-home demo. |
| **Hardcoded `LEARNER_ID = 1`** in the frontend | Simplifies the UI but limits to a single learner demo. |
| **No React Router** | Simple state-based navigation works for 2 views but doesn't support URL-based routing or deep linking. |
| **No pagination** | Fine for 2 courses × 4 lessons. Would break with hundreds of records. |
| **No input sanitization beyond parameterized queries** | Parameterized queries prevent SQL injection. HTML/XSS sanitization is minimal since there's no user-generated content being rendered as HTML. |

### Improvements With Another Week

1. **Authentication & Authorization** — JWT-based auth so learners log in and can only access their own data.
2. **React Router** — Proper URL routing (`/courses/1`, `/progress`) with browser history support.
3. **Learner selector / registration** — Support multiple learners instead of hardcoding `LEARNER_ID = 1`.
4. **Pagination & search** — For courses and lessons at scale.
5. **Unit & integration tests** — Jest for service layer, Supertest for API endpoints, React Testing Library for components.
6. **Input sanitization middleware** — Express middleware to trim/sanitize inputs.
7. **Rate limiting** — Prevent abuse of the completion endpoint.
8. **Optimistic UI updates** — Update the UI immediately on completion, then reconcile with the server response.
9. **Database migrations** — Use a migration tool instead of raw `.sql` files.
10. **Docker Compose** — One-command setup for MySQL + backend + frontend.
11. **Error boundary** — React error boundary component for graceful crash handling.

---

## 4. AI Tool Transparency

This project was built with the assistance of **Google Antigravity (AI coding assistant)**. The AI was used for:

- **Code generation** — Scaffolding the project structure, writing boilerplate (Express routes, controllers, services, React components, CSS).
- **Architecture guidance** — Structuring the layered backend and designing the concurrency solution.
- **Best practices** — Parameterized queries, proper HTTP status codes, centralized error handling, and idempotent endpoint design.

### What the AI did NOT do:

- **Database setup** — The actual MySQL server must be configured and the schema/seed scripts run manually.
- **Design decisions** — The technology choices, API contract, and database schema were specified by the assignment requirements.
- **Testing/verification** — Manual testing and verification of the running application is the developer's responsibility.

### Human judgment applied:

- Reviewed all generated code for correctness and consistency.
- Made architectural decisions about how to handle completion status fetching (added `learnerId` query param to the course endpoint rather than creating a separate endpoint).
- Ensured the UNIQUE constraint approach for concurrency was the right solution (database-level, not application-level).
- Validated that progress calculations are always derived from the database, not client-side state.
