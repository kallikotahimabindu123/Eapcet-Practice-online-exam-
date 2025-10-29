export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  photo_url?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'student';
  phone?: string;
  date_of_birth?: string;
  address?: string;
  photo?: File | null;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  active: boolean;
  start_time: string;
  end_time: string;
  duration: number;
  total_marks: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  has_images: boolean;
  randomize_questions: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  passing_marks: number;
}

export interface Question {
  id: string;
  exam_id: string;
  subject: 'mathematics' | 'physics' | 'chemistry';
  question_text: string;
  options: Option[];
  correct_answer: string;
  marks: number;
  image_url?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation?: string;
  created_at: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface ExamSubmission {
  id: string;
  exam_id: string;
  student_id: string;
  answers: Record<string, string>;
  score: number;
  total_marks: number;
  time_taken: number;
  submitted_at: string;
  flagged_questions: string[];
  tab_switches: number;
  suspicious_activity: string[];
}

export interface Answer {
  question_id: string;
  selected_answer: string;
  time_spent: number;
  flagged: boolean;
}

export interface ExamResult {
  submission_id: string;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  score: number;
  total_marks: number;
  percentage: number;
  time_taken: number;
  subject_wise: {
    mathematics: SubjectResult;
    physics: SubjectResult;
    chemistry: SubjectResult;
  };
  rank?: number;
  grade?: string;
}

export interface SubjectResult {
  total_questions: number;
  answered: number;
  correct: number;
  score: number;
  total_marks: number;
  percentage: number;
}

export interface AdminStats {
  totalStudents: number;
  totalExams: number;
  totalSubmissions: number;
  examStats: ExamStat[];
  recentActivity: ActivityLog[];
  performanceMetrics: PerformanceMetric[];
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface PerformanceMetric {
  exam_id: string;
  exam_title: string;
  average_score: number;
  completion_rate: number;
  difficulty_rating: number;
}

export interface ExamStat {
  id: string;
  title: string;
  active: boolean;
  totalAssigned: number;
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  created_at: string;
  total_exams: number;
  completed_exams: number;
  average_score: number;
  last_activity: string;
}

export interface Submission {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  exam_id: string;
  exam_title: string;
  score: number;
  total_marks: number;
  percentage: number;
  time_taken: number;
  submitted_at: string;
  flagged_questions: number;
  suspicious_activities: number;
}

export interface PracticeSession {
  id: string;
  student_id: string;
  subject: 'mathematics' | 'physics' | 'chemistry';
  questions_attempted: number;
  correct_answers: number;
  time_spent: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  exam_id: string;
  certificate_url: string;
  issued_at: string;
}