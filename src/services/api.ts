// Mock API service for frontend-only application
// When real Supabase env vars are present, delegate to the
// `supabaseService` so created exams are recorded and auto-assigned to real students.
import { supabaseService } from './supabaseService';

const USE_SUPABASE = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data persisted to localStorage so created exams survive reloads in mock mode
const STORAGE_KEYS = {
  users: 'mock_users_v1',
  exams: 'mock_exams_v1',
  questions: 'mock_questions_v1',
  submissions: 'mock_submissions_v1',
  uploads: 'mock_uploads_v1'
};

const loadFromStorage = <T,>(key: string, fallback: T) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('Failed to load mock data from localStorage', key, e);
    return fallback;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to persist mock data to localStorage', key, e);
  }
};

const defaultUsers = [
  { id: '1', email: 'student@example.com', password: 'password123', name: 'Test Student', role: 'student' },
  { id: '2', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' }
];

const mockUsers = loadFromStorage<any[]>(STORAGE_KEYS.users, defaultUsers);
const mockExams = loadFromStorage<any[]>(STORAGE_KEYS.exams, [
  {
    _id: '1',
    title: 'EAPCET Mock Test - గణితం, భౌతిక శాస్త్రం, రసాయన శాస్త్రం',
    description: 'Complete mock test covering all three subjects',
    active: true,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: 180,
    assignedStudents: ['1'],
    totalMarks: 120,
    has_questions: false
  }
]);

const mockQuestions = loadFromStorage<Record<string, any[]>>(STORAGE_KEYS.questions, {
  mathematics: [
    {
      _id: '1',
      examId: '1',
      subject: 'mathematics',
      questionText: 'ఒక వృత్తం యొక్క వ్యాసార్థం 7 సెం.మీ అయితే, దాని వైశాల్యం ఎంత?',
      options: [
        { id: 'a', text: '154 చ.సెం.మీ' },
        { id: 'b', text: '44 చ.సెం.మీ' },
        { id: 'c', text: '22 చ.సెం.మీ' },
        { id: 'd', text: '49 చ.సెం.మీ' }
      ],
      correctAnswer: 'a',
      marks: 4
    }
  ],
  physics: [],
  chemistry: []
});

// store submissions for mock reporting
const mockSubmissions: any[] = loadFromStorage<any[]>(STORAGE_KEYS.submissions, []);
// store upload metadata (sheet names, uploader file info)
const mockUploads: any[] = loadFromStorage<any[]>(STORAGE_KEYS.uploads, []);
class ApiService {
  async login(email: string, password: string) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(userData: any) {
    // If Supabase is configured, use the real sign-up flow which also creates
    // a profile row in the `users` table via `supabaseService.signUp`.
    if (USE_SUPABASE) {
      try {
        const created = await supabaseService.signUp(
          typeof userData === 'object' && 'email' in userData ? userData.email : userData.get('email'),
          typeof userData === 'object' && 'password' in userData ? userData.password : userData.get('password'),
          userData
        );

        // Normalize response to same shape as mock
        const returnedUser = (created as any)?.user ?? (created as any)?.data?.user;
        const token = (created as any)?.session?.access_token ?? 'supabase-token-' + Date.now();

        return {
          token,
          user: {
            id: returnedUser?.id ?? Date.now().toString(),
            name: returnedUser?.user_metadata?.name ?? returnedUser?.name ?? (userData.name ?? null),
            email: returnedUser?.email ?? (typeof userData === 'object' && 'email' in userData ? userData.email : null),
            role: (returnedUser && ((returnedUser.user_metadata && returnedUser.user_metadata.role) || returnedUser.role)) || (userData.role || 'student')
          }
        };
      } catch (e: any) {
        console.warn('api.register: supabase signUp failed, falling back to mock', e);
        // fall through to mock registration
      }
    }

    await delay(1000);

    const email = typeof userData === 'object' && 'get' in userData 
      ? userData.get('email') as string 
      : userData.email;
      
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email: email,
      name: typeof userData === 'object' && 'get' in userData 
        ? userData.get('name') as string 
        : userData.name,
      role: typeof userData === 'object' && 'get' in userData 
        ? (userData.get('role') as string) || 'student'
        : userData.role || 'student',
      password: typeof userData === 'object' && 'get' in userData 
        ? userData.get('password') as string 
        : userData.password
    };

  mockUsers.push(newUser);
  try { saveToStorage(STORAGE_KEYS.users, mockUsers); } catch (_) { }

  return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  async getAssignedExams() {
    await delay(500);
    return mockExams;
  }

  async getExam(examId: string) {
    await delay(500);
    return mockExams.find(exam => exam._id === examId);
  }

  async getQuestionsBySubject(examId: string, subject: string) {
    await delay(500);
    // Use local mockQuestions store and filter by subject and examId when available
    const all = Object.values(mockQuestions).flat() as any[];
    return all.filter(q => q.subject === subject && (!examId || q.examId === examId));
  }

  async submitExam(examId: string, answers: any, _timeTaken: number, _studentId?: string) {
    try {
      await delay(1000);

      if (!examId) throw new Error('Missing examId');
      if (!answers || typeof answers !== 'object') throw new Error('Invalid answers payload');

      // Use local mockQuestions store
      const allQuestions = Object.values(mockQuestions).flat() as any[];

      // Calculate detailed results
      const results = {
        mathematics: { score: 0, total: 0, details: [] as any[] },
        physics: { score: 0, total: 0, details: [] as any[] },
        chemistry: { score: 0, total: 0, details: [] as any[] }
      };
    
    let totalScore = 0;
    let totalMarks = 0;
    
    Object.keys(answers).forEach(subject => {
      const subjectAnswers = answers[subject] || [];
      const questions = allQuestions.filter(q => q.subject === subject && q.examId === examId);

      results[subject as keyof typeof results].total = questions.length * 4; // assume 4 marks per question if marks missing
      totalMarks += questions.reduce((s, q) => s + (Number(q.marks) || 4), 0);

      subjectAnswers.forEach((answer: any) => {
        const question = questions.find(q => (q._id || q.id) === answer.questionId || q.id === answer.questionId);
        if (question && (question.correctAnswer === answer.selectedAnswer || question.correctOptionId === answer.selectedAnswer)) {
          results[subject as keyof typeof results].score += Number(question.marks || 4);
          totalScore += Number(question.marks || 4);
        }

        if (question) {
          const selectedOption = question.options.find((opt: any) => opt.id === answer.selectedAnswer);
          const correctOption = question.options.find((opt: any) => opt.id === (question.correctAnswer || question.correctOptionId));

          results[subject as keyof typeof results].details.push({
            questionId: question._id ?? question.id,
            questionText: question.questionText ?? question.text,
            selectedAnswer: selectedOption ? selectedOption.text : 'Not Answered',
            correctAnswer: correctOption ? correctOption.text : '',
            isCorrect: (question.correctAnswer || question.correctOptionId) === answer.selectedAnswer,
            marks: Number(question.marks || 4),
            marksAwarded: ((question.correctAnswer || question.correctOptionId) === answer.selectedAnswer) ? Number(question.marks || 4) : 0
          });
        }
      });

      // Add unanswered questions
      questions.forEach(question => {
        const answered = subjectAnswers.find((ans: any) => ans.questionId === (question._id ?? question.id));
        if (!answered) {
          const correctOption = question.options.find((opt: any) => opt.id === (question.correctAnswer || question.correctOptionId));
          results[subject as keyof typeof results].details.push({
            questionId: question._id ?? question.id,
            questionText: question.questionText ?? question.text,
            selectedAnswer: 'Not Answered',
            correctAnswer: correctOption ? correctOption.text : '',
            isCorrect: false,
            marks: Number(question.marks || 4),
            marksAwarded: 0
          });
        }
      });
    });

      return {
        message: 'Exam submitted successfully',
        results: {
          mathematics: results.mathematics.score,
          physics: results.physics.score,
          chemistry: results.chemistry.score,
          total: totalScore,
          totalMarks: totalMarks,
          percentage: totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0,
          details: results
        }
      };
    } catch (e: any) {
      // Keep mock API throwing errors so callers can detect failures
      throw new Error(e?.message || 'Failed to submit exam');
    }
  }

  // Also record submission in mockSubmissions so admin reports can display it.
  // Note: keep this separate from storeSubmission to avoid double-calculation.
  async submitExamAndRecord(examId: string, answers: any, timeTaken: number, studentId?: string) {
    try {
      const res = await this.submitExam(examId, answers, timeTaken, studentId);
      const record = {
        id: Date.now().toString(),
        examId,
        studentId: studentId || 'unknown',
        result: res.results,
        timeTaken,
        submittedAt: new Date().toISOString()
      };
  mockSubmissions.push(record);
  try { saveToStorage(STORAGE_KEYS.submissions, mockSubmissions); } catch (_) { }
      // Return the same shape as submitExam but attach the stored record for inspection
      return {
        ...res,
        record
      };
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to submit and record exam');
    }
  }

  // store submission and return simple report list for admin
  async storeSubmission(examId: string, studentId: string, answers: any, timeTaken: number) {
    const res = await this.submitExam(examId, answers, timeTaken);
    const record = {
      id: Date.now().toString(),
      examId,
      studentId,
      result: res.results,
      submittedAt: new Date().toISOString()
    };
  mockSubmissions.push(record);
  try { saveToStorage(STORAGE_KEYS.submissions, mockSubmissions); } catch (_) { }
  return record;
  }

  // Save metadata about an uploaded Excel sheet (admin-provided name + file info)
  async saveUploadMetadata(examId: string, uploadName: string, originalSheetName: string, fileName: string) {
    try {
      if (!examId) throw new Error('Missing examId for upload metadata');
      await delay(200);
      const record = {
        id: Date.now().toString(),
        examId,
        uploadName,
        originalSheetName,
        fileName,
        uploadedAt: new Date().toISOString()
      };
  mockUploads.push(record);
  try { saveToStorage(STORAGE_KEYS.uploads, mockUploads); } catch (_) { }
  return record;
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to save upload metadata');
    }
  }

  async getAllSubmissions() {
    await delay(300);
    return mockSubmissions;
  }

  async getUploads(examId?: string) {
    await delay(200);
    if (!examId) return mockUploads;
    return mockUploads.filter(u => u.examId === examId);
  }

  // Admin APIs (mock)
  async getAdminDashboard() {
    await delay(500);
    return {
      totalStudents: 5,
      totalExams: 2,
      totalSubmissions: 3,
      examStats: mockExams.map(exam => ({
        _id: exam._id,
        title: exam.title,
        active: exam.active,
        totalAssigned: exam.assignedStudents.length,
        totalSubmissions: Math.floor(Math.random() * exam.assignedStudents.length)
      }))
    };
  }

  async createExam(examData: any) {
    // If Supabase is configured, use the real service which will auto-assign
    // the exam to all registered students (see supabaseService.createExam).
    if (USE_SUPABASE) {
      try {
        const created = await supabaseService.createExam(examData, 'admin');
        // Normalize DB row to frontend mock shape used across the app
        const normalized = {
          _id: created.id ?? created._id ?? String(created),
          title: created.title,
          description: created.description,
          active: created.active ?? created.is_active ?? true,
          startTime: created.start_time ?? created.startTime,
          endTime: created.end_time ?? created.endTime,
          duration: created.duration,
          assignedStudents: Array.isArray(created.assigned_students) ? created.assigned_students : [],
          totalMarks: created.total_marks ?? created.totalMarks ?? 0,
          has_questions: !!created.has_questions
        };
  // Keep a small delay to mimic the mock behaviour for UI consistency
  await delay(200);
  mockExams.push(normalized);
  try { saveToStorage(STORAGE_KEYS.exams, mockExams); } catch (_) { }
  return normalized;
      } catch (e) {
        // fallback to mock behaviour if Supabase call fails
        console.warn('api.createExam: supabase create failed, falling back to mock', e);
      }
    }

    await delay(1000);
    const assigned = mockUsers.filter(u => u.role === 'student').map(u => u.id);
    const newExam = {
      _id: Date.now().toString(),
      ...examData,
      assignedStudents: assigned,
      totalMarks: 0
    };
  mockExams.push(newExam);
  try { saveToStorage(STORAGE_KEYS.exams, mockExams); } catch (_) { }
  return newExam;
  }

  async getAllExams() {
    // If Supabase configured, fetch from DB and normalize to mock shape
    if (USE_SUPABASE) {
      try {
        const exams = await supabaseService.getExams();
        const normalized = (exams || []).map((e: any) => ({
          _id: e.id ?? e._id ?? String(e.id ?? Date.now()),
          title: e.title,
          description: e.description,
          active: e.active ?? e.is_active ?? false,
          startTime: e.start_time ?? e.startTime,
          endTime: e.end_time ?? e.endTime,
          duration: e.duration,
          assignedStudents: Array.isArray(e.assigned_students) ? e.assigned_students : [],
          totalMarks: e.total_marks ?? e.totalMarks ?? 0,
          has_questions: !!e.has_questions
        }));

        // Also include any locally-created mock exams that couldn't be persisted to Supabase
        // (happens when createExam fell back to mock). Avoid duplicates by _id.
        const dbIds = new Set(normalized.map((e: any) => e._id));
        const merged = [
          ...normalized,
          ...mockExams.filter((m) => !dbIds.has(m._id))
        ];

        await delay(200);
        return merged;
      } catch (err) {
        console.warn('api.getAllExams: supabase fetch failed, falling back to mock', err);
      }
    }

    await delay(500);
    return mockExams;
  }

  async toggleExamStatus(examId: string, active: boolean) {
    await delay(500);
    const exam = mockExams.find(e => e._id === examId);
    if (exam) {
      exam.active = active;
    }
    return exam;
  }

  async addQuestion(questionData: any) {
    await delay(500);
    const newQuestion = {
      _id: Date.now().toString(),
      ...questionData
    };
    
    const subject = questionData.subject as keyof typeof mockQuestions;
    if (mockQuestions[subject]) {
      mockQuestions[subject].push(newQuestion);
      try { saveToStorage(STORAGE_KEYS.questions, mockQuestions); } catch (_) { }
    }
    
    return newQuestion;
  }

  // Bulk insert questions (faster than inserting one-by-one)
  async addQuestions(questionsData: any[]) {
    try {
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        throw new Error('No questions to add');
      }

      // Simulate a single network/database operation instead of per-row delays
      await delay(300);

      const inserted: any[] = [];
      for (const q of questionsData) {
        const newQuestion = {
          _id: Date.now().toString() + Math.random().toString(36).slice(2),
          ...q
        };

        const subject = q.subject as keyof typeof mockQuestions;
        if (!mockQuestions[subject]) mockQuestions[subject] = [];
        mockQuestions[subject].push(newQuestion);
        inserted.push(newQuestion);
      }

      // Recompute exam total marks and mark exam as having questions
      const examId = questionsData.length > 0 ? questionsData[0].examId : null;
      if (examId) {
        let total = 0;
        Object.values(mockQuestions).forEach((arr: any[]) => {
          arr.forEach((qq) => {
            if (qq.examId === examId) {
              total += Number(qq.marks || 0);
            }
          });
        });

        const exam = mockExams.find(e => e._id === examId);
        if (exam) {
          exam.totalMarks = total;
          (exam as any).has_questions = true;
        }
      }

      // persist mock questions and exam totals so UI shows updates after reload
      try { saveToStorage(STORAGE_KEYS.questions, mockQuestions); } catch (_) { }
      try { saveToStorage(STORAGE_KEYS.exams, mockExams); } catch (_) { }

      return inserted;
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to add questions');
    }
  }

  async getExamQuestions(examId: string) {
    await delay(300);
    // Return flattened questions filtered by examId
    const all = Object.values(mockQuestions).flat() as any[];
    return all.filter(q => !examId || q.examId === examId);
  }

  async getAllStudents() {
    await delay(500);
    return mockUsers
      .filter(user => user.role === 'student')
      .map(user => ({
        _id: user.id,
        name: user.name,
        email: user.email,
        assignedExams: mockExams.filter(exam => exam.assignedStudents.includes(user.id))
      }));
  }

  async assignExam(examId: string, studentIds: string[]) {
    await delay(500);
    const exam = mockExams.find(e => e._id === examId);
    if (exam) {
      exam.assignedStudents.push(...studentIds);
      try { saveToStorage(STORAGE_KEYS.exams, mockExams); } catch (_) { }
    }
    return { message: 'Exam assigned successfully' };
  }

  async getExamStats(examId: string) {
    await delay(300);
    const subs = mockSubmissions.filter(s => s.examId === examId);
    if (subs.length === 0) return { totalSubmissions: 0, averageScore: 0, submissions: [] };
    const scores = subs.map(s => s.result?.total ?? 0);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { totalSubmissions: subs.length, averageScore: avg, submissions: subs };
  }

  // Assign all existing students to an exam (useful for retroactive assignment)
  async assignAllStudents(examId: string) {
    await delay(500);
    if (USE_SUPABASE) {
      try {
        // supabaseService.getAllUsers returns student rows
        const students = await supabaseService.getAllUsers();
        const studentIds = (students || []).map((s: any) => s.id ?? s._id).filter(Boolean);
        if (studentIds.length === 0) return { message: 'No students found to assign', assigned: 0 };
        await supabaseService.assignExamToMultipleStudents(examId, studentIds);
        return { message: 'Assigned to all students', assigned: studentIds.length };
      } catch (e: any) {
        throw new Error(e?.message || 'Failed to assign students');
      }
    }

    // Mock fallback: add all mock student ids to the exam
    const exam = mockExams.find(e => e._id === examId);
    if (exam) {
      const assigned = mockUsers.filter(u => u.role === 'student').map(u => u.id);
      exam.assignedStudents = Array.from(new Set([...(exam.assignedStudents || []), ...assigned]));
      try { saveToStorage(STORAGE_KEYS.exams, mockExams); } catch (_) { }
      return { message: 'Assigned (mock)', assigned: assigned.length };
    }

    return { message: 'Exam not found', assigned: 0 };
  }
}

export const apiService = new ApiService();