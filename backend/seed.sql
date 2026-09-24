-- Root2Rise Micro-Learning Progress Tracker
-- Seed Data

USE root2rise_tracker;

-- Learner
INSERT INTO learners (name, email) VALUES
  ('Vinay', 'vinay@example.com');

-- Courses
INSERT INTO courses (title, description) VALUES
  ('Java Full Stack', 'A comprehensive course covering Java fundamentals, OOP, Spring Boot, and RESTful API development.'),
  ('Python Basics', 'An introductory course on Python programming, covering syntax, functions, OOP, and web development with Flask.');

-- Lessons for Course 1: Java Full Stack
INSERT INTO lessons (course_id, title, content_or_url, order_index) VALUES
  (1, 'Java Basics', 'https://docs.oracle.com/javase/tutorial/', 1),
  (1, 'OOP Concepts', 'https://docs.oracle.com/javase/tutorial/java/concepts/', 2),
  (1, 'Spring Boot', 'https://spring.io/guides/gs/spring-boot/', 3),
  (1, 'REST APIs', 'https://spring.io/guides/gs/rest-service/', 4);

-- Lessons for Course 2: Python Basics
INSERT INTO lessons (course_id, title, content_or_url, order_index) VALUES
  (2, 'Python Syntax', 'https://docs.python.org/3/tutorial/', 1),
  (2, 'Functions', 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', 2),
  (2, 'OOP', 'https://docs.python.org/3/tutorial/classes.html', 3),
  (2, 'Flask', 'https://flask.palletsprojects.com/en/latest/quickstart/', 4);
