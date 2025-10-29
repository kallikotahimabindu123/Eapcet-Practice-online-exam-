import { supabase } from '../lib/supabase';

export class SupabaseService {
  // Auth methods
  async signUp(email: string, password: string, userData: any) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'student',
          phone: userData.phone,
          date_of_birth: userData.date_of_birth,
          address: userData.address,
          photo_url: userData.photo_url
        });

      if (profileError) throw profileError;

      // Log activity
      await this.logActivity(authData.user.id, 'user_registered', `New ${userData.role || 'student'} registered`);

      // Send welcome notification
      await this.createNotification(authData.user.id, 'Welcome!', 'Welcome to EAPCET Online Test Platform', 'success');
    }

    return authData;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    // Log activity
    await this.logActivity(data.user.id, 'user_login', 'User logged in');

    return {
      user: data.user,
      profile
    };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Activity logging
  async logActivity(userId: string, action: string, details?: string) {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          details,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        });
      
      if (error) console.error('Failed to log activity:', error);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  private async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  }

  // User methods
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Exam methods
  async createExam(examData: any, createdBy: string) {
    const { data, error } = await supabase
      .from('exams')
      .insert({
        ...examData,
        created_by: createdBy
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getExams() {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getExam(examId: string) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateExam(examId: string, updates: any) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', examId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteExam(examId: string) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId);

    if (error) throw error;
  }

  async toggleExamStatus(examId: string, active: boolean) {
    const { data, error } = await supabase
      .from('exams')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', examId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Question methods
  async addQuestion(questionData: any) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getQuestions(examId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateQuestion(questionId: string, updates: any) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', questionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteQuestion(questionId: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) throw error;
  }

  async addBulkQuestions(questions: any[]) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) throw error;
    return data;
  }

  // Exam assignment methods
  async assignExamToStudent(examId: string, studentId: string) {
    const { data, error } = await supabase
      .from('exam_assignments')
      .insert({
        exam_id: examId,
        student_id: studentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAssignedExams(studentId: string) {
    const { data, error } = await supabase
      .from('exam_assignments')
      .select(`
        *,
        exams (*)
      `)
      .eq('student_id', studentId);

    if (error) throw error;
    return data.map(assignment => assignment.exams);
  }

  async assignExamToMultipleStudents(examId: string, studentIds: string[]) {
    const assignments = studentIds.map(studentId => ({
      exam_id: examId,
      student_id: studentId
    }));

    const { data, error } = await supabase
      .from('exam_assignments')
      .insert(assignments)
      .select();

    if (error) throw error;
    return data;
  }

  // Submission methods
  async submitExam(submissionData: any) {
    const { data, error } = await supabase
      .from('exam_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSubmission(examId: string, studentId: string) {
    const { data, error } = await supabase
      .from('exam_submissions')
      .select('*')
      .eq('exam_id', examId)
      .eq('student_id', studentId)
      .single();

    if (error) throw error;
    return data;
  }

  async getExamSubmissions(examId: string) {
    const { data, error } = await supabase
      .from('exam_submissions')
      .select(`
        *,
        users (name, email)
      `)
      .eq('exam_id', examId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getExamStatistics(examId: string) {
    const { data, error } = await supabase
      .from('exam_submissions')
      .select('score, total_marks, time_taken, submitted_at')
      .eq('exam_id', examId);

    if (error) throw error;

    if (data.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        averageTime: 0,
        passRate: 0
      };
    }

    const scores = data.map(s => s.score);
    const times = data.map(s => s.time_taken);
    const totalMarks = data[0].total_marks;
    const passingMarks = totalMarks * 0.4; // 40% passing
    const passedCount = scores.filter(score => score >= passingMarks).length;

    return {
      totalSubmissions: data.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      passRate: (passedCount / data.length) * 100
    };
  }

  // Practice sessions
  async createPracticeSession(studentId: string, subject: string) {
    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({
        student_id: studentId,
        subject
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePracticeSession(sessionId: string, updates: any) {
    const { data, error } = await supabase
      .from('practice_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Notifications
  async createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  // Proctoring
  async saveProctorPhoto(submissionId: string, photoBlob: Blob) {
    try {
      const fileName = `${submissionId}/${Date.now()}.jpg`;
      
      const { data: _uploadData, error: uploadError } = await supabase.storage
        .from('proctoring')
        .upload(fileName, photoBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('proctoring')
        .getPublicUrl(fileName);

      // Save proctoring data
      const { error: dbError } = await supabase
        .from('proctoring_data')
        .insert({
          submission_id: submissionId,
          photo_url: publicUrl,
          activity_type: 'photo_capture'
        });

      if (dbError) throw dbError;
      return publicUrl;
    } catch (error) {
      console.error('Failed to save proctor photo:', error);
      throw error;
    }
  }

  // Admin dashboard methods
  async getAdminStats() {
    const [studentsResult, examsResult, submissionsResult, recentActivityResult] = await Promise.all([
      supabase.from('users').select('id').eq('role', 'student'),
      supabase.from('exams').select('id'),
      supabase.from('exam_submissions').select('id'),
      supabase.from('activity_logs').select('*, users(name)').order('created_at', { ascending: false }).limit(10)
    ]);

    // Get exam statistics
    const { data: examStats } = await supabase
      .from('exams')
      .select(`
        id,
        title,
        active,
        exam_assignments(count),
        exam_submissions(score, total_marks)
      `);

    return {
      totalStudents: studentsResult.data?.length || 0,
      totalExams: examsResult.data?.length || 0,
      totalSubmissions: submissionsResult.data?.length || 0,
      recentActivity: recentActivityResult.data || [],
      examStats: examStats?.map(exam => ({
        id: exam.id,
        title: exam.title,
        active: exam.active,
        totalAssigned: exam.exam_assignments?.length || 0,
        totalSubmissions: exam.exam_submissions?.length || 0,
        averageScore: exam.exam_submissions?.length > 0 
          ? exam.exam_submissions.reduce((sum: number, sub: any) => sum + sub.score, 0) / exam.exam_submissions.length
          : 0
      })) || []
    };
  }

  async getAllStudents() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        exam_assignments(count),
        exam_submissions(score, total_marks, submitted_at)
      `)
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(student => ({
      ...student,
      total_exams: student.exam_assignments?.length || 0,
      completed_exams: student.exam_submissions?.length || 0,
      average_score: student.exam_submissions?.length > 0
        ? student.exam_submissions.reduce((sum: number, sub: any) => sum + sub.score, 0) / student.exam_submissions.length
        : 0,
      last_activity: student.exam_submissions?.length > 0
        ? student.exam_submissions[student.exam_submissions.length - 1].submitted_at
        : student.created_at
    }));
  }

  // File upload methods
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  }

  async getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}

export const supabaseService = new SupabaseService();