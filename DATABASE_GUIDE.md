# Database Structure & Data Viewing Guide

## 🗄️ Supabase Tables

### 1. **users** table
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- role ('admin' | 'student')
- phone (text, optional)
- date_of_birth (date, optional)
- address (text, optional)
- photo_url (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```
**Contains:** All registered users (students and admins)

### 2. **exams** table
```sql
- id (uuid, primary key)
- title (text)
- description (text)
- duration (integer, minutes)
- total_marks (integer)
- passing_marks (integer)
- start_time (timestamp)
- end_time (timestamp)
- active (boolean)
- has_images (boolean)
- randomize_questions (boolean)
- show_results_immediately (boolean)
- allow_review (boolean)
- max_attempts (integer)
- created_by (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)
```
**Contains:** All created exams with metadata

### 3. **questions** table
```sql
- id (uuid, primary key)
- exam_id (uuid, foreign key to exams)
- subject ('mathematics' | 'physics' | 'chemistry')
- question_text (text)
- options (jsonb array of {id, text})
- correct_answer (text)
- marks (integer, default 4)
- difficulty ('easy' | 'medium' | 'hard')
- topic (text, optional)
- image_url (text, optional)
- explanation (text, optional)
- created_at (timestamp)
```
**Contains:** All questions for each exam

### 4. **exam_submissions** table
```sql
- id (uuid, primary key)
- exam_id (uuid, foreign key to exams)
- student_id (uuid, foreign key to users)
- answers (jsonb, student's answers)
- score (integer)
- total_marks (integer)
- time_taken (integer, seconds)
- flagged_questions (jsonb, array of question IDs)
- tab_switches (integer)
- suspicious_activity (jsonb, array of activities)
- submitted_at (timestamp)
```
**Contains:** Student exam submissions and scores

### 5. **exam_assignments** table
```sql
- id (uuid, primary key)
- exam_id (uuid, foreign key to exams)
- student_id (uuid, foreign key to users)
- assigned_at (timestamp)
```
**Contains:** Which students are assigned to which exams

### 6. **practice_sessions** table
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key to users)
- subject ('mathematics' | 'physics' | 'chemistry')
- questions_attempted (integer)
- correct_answers (integer)
- time_spent (integer, seconds)
- created_at (timestamp)
```
**Contains:** Student practice session data

### 7. **notifications** table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- title (text)
- message (text)
- type ('info' | 'success' | 'warning' | 'error')
- read (boolean, default false)
- created_at (timestamp)
```
**Contains:** System notifications for users

### 8. **activity_logs** table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- action (text)
- details (text, optional)
- ip_address (inet, optional)
- user_agent (text, optional)
- created_at (timestamp)
```
**Contains:** Audit trail of all user activities

### 9. **certificates** table
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key to users)
- exam_id (uuid, foreign key to exams)
- certificate_url (text)
- issued_at (timestamp)
```
**Contains:** Generated certificates for passed students

### 10. **proctoring_data** table
```sql
- id (uuid, primary key)
- submission_id (uuid, foreign key to exam_submissions)
- photo_url (text, optional)
- timestamp (timestamp)
- activity_type (text, optional)
- details (jsonb, optional)
```
**Contains:** Security monitoring data and photos

## 📊 How to View Data

### Option 1: Supabase Dashboard
1. Go to https://supabase.com
2. Login to your account
3. Select your project
4. Click "Table Editor" in sidebar
5. Click on any table to view data
6. Use filters and search to find specific records

### Option 2: SQL Editor in Supabase
1. Go to "SQL Editor" in Supabase dashboard
2. Run queries like:
```sql
-- View all users
SELECT * FROM users;

-- View all exam submissions with student names
SELECT 
  es.*,
  u.name as student_name,
  e.title as exam_title
FROM exam_submissions es
JOIN users u ON es.student_id = u.id
JOIN exams e ON es.exam_id = e.id;

-- View questions for a specific exam
SELECT * FROM questions WHERE exam_id = 'your-exam-id';
```

### Option 3: Application Admin Panel
1. Login as admin: admin@example.com / admin123
2. Go to Admin Dashboard
3. View statistics and manage data
4. Access student reports and exam analytics

## 🔍 Sample Queries

### Get all students with their exam scores:
```sql
SELECT 
  u.name,
  u.email,
  e.title as exam_name,
  es.score,
  es.total_marks,
  (es.score::float / es.total_marks * 100) as percentage
FROM users u
JOIN exam_submissions es ON u.id = es.student_id
JOIN exams e ON es.exam_id = e.id
WHERE u.role = 'student';
```

### Get exam statistics:
```sql
SELECT 
  e.title,
  COUNT(es.id) as total_submissions,
  AVG(es.score) as average_score,
  MAX(es.score) as highest_score,
  MIN(es.score) as lowest_score
FROM exams e
LEFT JOIN exam_submissions es ON e.id = es.exam_id
GROUP BY e.id, e.title;
```

## 📱 Real-time Data
- All data updates in real-time
- Changes reflect immediately in the application
- Supabase provides real-time subscriptions for live updates