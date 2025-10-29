import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Friendly runtime error so you see it in console immediately
  console.error('Missing Supabase env. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set and restart dev server.');
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');


// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'student';
          photo_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'student';
          photo_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'student';
          photo_url?: string;
          updated_at?: string;
        };
      };
      exams: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: number;
          total_marks: number;
          start_time: string;
          end_time: string;
          active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          duration: number;
          total_marks?: number;
          start_time: string;
          end_time: string;
          active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          duration?: number;
          total_marks?: number;
          start_time?: string;
          end_time?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          exam_id: string;
          subject: 'mathematics' | 'physics' | 'chemistry';
          question_text: string;
          options: { id: string; text: string }[];
          correct_answer: string;
          marks: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          subject: 'mathematics' | 'physics' | 'chemistry';
          question_text: string;
          options: { id: string; text: string }[];
          correct_answer: string;
          marks?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          subject?: 'mathematics' | 'physics' | 'chemistry';
          question_text?: string;
          options?: { id: string; text: string }[];
          correct_answer?: string;
          marks?: number;
        };
      };
      exam_submissions: {
        Row: {
          id: string;
          exam_id: string;
          student_id: string;
          answers: Record<string, string>;
          score: number;
          total_marks: number;
          time_taken: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          student_id: string;
          answers: Record<string, string>;
          score: number;
          total_marks: number;
          time_taken: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          answers?: Record<string, string>;
          score?: number;
          total_marks?: number;
          time_taken?: number;
        };
      };
      exam_assignments: {
        Row: {
          id: string;
          exam_id: string;
          student_id: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          student_id: string;
          assigned_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          student_id?: string;
        };
      };
    };
  };
}