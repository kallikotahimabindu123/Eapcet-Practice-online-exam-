 this re the diretory wt should i Changes/*
  # Comprehensive EAPCET Online Test Platform Schema

  1. New Tables
    - Enhanced `users` table with additional fields
    - `exams` table with advanced features
    - `questions` table with image support and difficulty levels
    - `exam_submissions` table with detailed tracking
    - `exam_assignments` table for student-exam mapping
    - `practice_sessions` table for practice mode
    - `notifications` table for system notifications
    - `activity_logs` table for audit trail
    - `certificates` table for auto-generated certificates
    - `proctoring_data` table for security monitoring

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for each table
    - Secure file storage policies

  3. Storage Buckets
    - avatars: User profile pictures
    - question-images: Images for questions
    - certificates: Generated certificates
    - proctoring: Captured photos during exams
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('question-images', 'question-images', true),
  ('certificates', 'certificates', true),
  ('proctoring', 'proctoring', false);

-- Enhanced Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  phone text,
  date_of_birth date,
  address text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exams table with advanced features
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL, -- in minutes
  total_marks integer DEFAULT 0,
  passing_marks integer DEFAULT 0,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  active boolean DEFAULT true,
  has_images boolean DEFAULT false,
  randomize_questions boolean DEFAULT false,
  show_results_immediately boolean DEFAULT true,
  allow_review boolean DEFAULT true,
  max_attempts integer DEFAULT 1,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table with enhanced features
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  subject text NOT NULL CHECK (subject IN ('mathematics', 'physics', 'chemistry')),
  question_text text NOT NULL,
  options jsonb NOT NULL, -- Array of {id, text}
  correct_answer text NOT NULL,
  marks integer DEFAULT 4,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic text,
  image_url text,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Exam assignments
CREATE TABLE IF NOT EXISTS exam_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

-- Exam submissions with detailed tracking
CREATE TABLE IF NOT EXISTS exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL, -- {question_id: selected_answer}
  score integer NOT NULL,
  total_marks integer NOT NULL,
  time_taken integer NOT NULL, -- in seconds
  flagged_questions jsonb DEFAULT '[]', -- Array of question IDs
  tab_switches integer DEFAULT 0,
  suspicious_activity jsonb DEFAULT '[]', -- Array of activity descriptions
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

-- Practice sessions for unlimited practice
CREATE TABLE IF NOT EXISTS practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL CHECK (subject IN ('mathematics', 'physics', 'chemistry')),
  questions_attempted integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  time_spent integer DEFAULT 0, -- in seconds
  created_at timestamptz DEFAULT now()
);

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity logs for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  certificate_url text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  UNIQUE(student_id, exam_id)
);

-- Proctoring data for security
CREATE TABLE IF NOT EXISTS proctoring_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES exam_submissions(id) ON DELETE CASCADE,
  photo_url text,
  timestamp timestamptz DEFAULT now(),
  activity_type text, -- 'photo_capture', 'tab_switch', 'suspicious_activity'
  details jsonb
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proctoring_data ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON users FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Exams policies
CREATE POLICY "Students can read assigned exams" ON exams FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM exam_assignments WHERE exam_id = id AND student_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage exams" ON exams FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Questions policies
CREATE POLICY "Students can read questions for assigned exams" ON questions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM exam_assignments WHERE exam_id = questions.exam_id AND student_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage questions" ON questions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Exam assignments policies
CREATE POLICY "Students can read own assignments" ON exam_assignments FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins can manage assignments" ON exam_assignments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Exam submissions policies
CREATE POLICY "Students can manage own submissions" ON exam_submissions FOR ALL TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins can read all submissions" ON exam_submissions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Practice sessions policies
CREATE POLICY "Students can manage own practice sessions" ON practice_sessions FOR ALL TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins can read all practice sessions" ON practice_sessions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can read own activity logs" ON activity_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all activity logs" ON activity_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Certificates policies
CREATE POLICY "Students can read own certificates" ON certificates FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins can manage certificates" ON certificates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Proctoring data policies
CREATE POLICY "Admins can manage proctoring data" ON proctoring_data FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Storage policies
CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can read own avatars" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Public can read avatars" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'avatars');

CREATE POLICY "Admins can manage question images" ON storage.objects FOR ALL TO authenticated USING (
  bucket_id = 'question-images' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Students can read question images" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'question-images'
);

CREATE POLICY "Admins can manage certificates" ON storage.objects FOR ALL TO authenticated USING (
  bucket_id = 'certificates' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Students can read own certificates" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "System can manage proctoring data" ON storage.objects FOR ALL TO authenticated USING (
  bucket_id = 'proctoring'
);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password will be set via Supabase Auth)
INSERT INTO users (id, email, name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;