// Mock API service for frontend-only application
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = [
  { id: '1', email: 'student@example.com', password: 'password123', name: 'Test Student', role: 'student' },
  { id: '2', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' }
];

const mockExams = [
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
];

const mockQuestions = {
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
    },
    {
      _id: '2',
      examId: '1',
      subject: 'mathematics',
      questionText: 'x² - 5x + 6 = 0 సమీకరణం యొక్క మూలాలు ఏవి?',
      options: [
        { id: 'a', text: '2, 3' },
        { id: 'b', text: '1, 6' },
        { id: 'c', text: '-2, -3' },
        { id: 'd', text: '5, 1' }
      ],
      correctAnswer: 'a',
      marks: 4
    },
    {
      _id: '3',
      examId: '1',
      subject: 'mathematics',
      questionText: 'sin²θ + cos²θ = ?',
      options: [
        { id: 'a', text: '0' },
        { id: 'b', text: '1' },
        { id: 'c', text: '2' },
        { id: 'd', text: '-1' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '4',
      examId: '1',
      subject: 'mathematics',
      questionText: 'ఒక AP లో మొదటి పదం 3, సామాన్య భేదం 4 అయితే 10వ పదం ఎంత?',
      options: [
        { id: 'a', text: '39' },
        { id: 'b', text: '43' },
        { id: 'c', text: '35' },
        { id: 'd', text: '47' }
      ],
      correctAnswer: 'a',
      marks: 4
    },
    {
      _id: '5',
      examId: '1',
      subject: 'mathematics',
      questionText: 'log₁₀(100) = ?',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '2' },
        { id: 'c', text: '10' },
        { id: 'd', text: '100' }
      ],
      correctAnswer: 'b',
      marks: 4
    }
  ],
  physics: [
    {
      _id: '6',
      examId: '1',
      subject: 'physics',
      questionText: 'భూమిపై గురుత్వాకర్షణ త్వరణం ఎంత?',
      options: [
        { id: 'a', text: '9.8 మీ/సె²' },
        { id: 'b', text: '10 మీ/సె²' },
        { id: 'c', text: '8.9 మీ/సె²' },
        { id: 'd', text: '11 మీ/సె²' }
      ],
      correctAnswer: 'a',
      marks: 4
    },
    {
      _id: '7',
      examId: '1',
      subject: 'physics',
      questionText: 'కాంతి వేగం ఎంత?',
      options: [
        { id: 'a', text: '3 × 10⁸ మీ/సె' },
        { id: 'b', text: '3 × 10⁶ మీ/సె' },
        { id: 'c', text: '3 × 10⁷ మీ/సె' },
        { id: 'd', text: '3 × 10⁹ మీ/సె' }
      ],
      correctAnswer: 'a',
      marks: 4
    },
    {
      _id: '8',
      examId: '1',
      subject: 'physics',
      questionText: 'ఓహ్మ్ నియమం ప్రకారం V = ?',
      options: [
        { id: 'a', text: 'I/R' },
        { id: 'b', text: 'IR' },
        { id: 'c', text: 'I + R' },
        { id: 'd', text: 'I - R' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '9',
      examId: '1',
      subject: 'physics',
      questionText: 'శక్తి యొక్క SI యూనిట్ ఏది?',
      options: [
        { id: 'a', text: 'వాట్ | Watt' },
        { id: 'b', text: 'జూల్ | Joule' },
        { id: 'c', text: 'న్యూటన్ | Newton' },
        { id: 'd', text: 'పాస్కల్ | Pascal' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '10',
      examId: '1',
      subject: 'physics',
      questionText: 'ధ్వని గాలిలో ఎంత వేగంతో ప్రయాణిస్తుంది?',
      options: [
        { id: 'a', text: '330 మీ/సె | 330 m/s' },
        { id: 'b', text: '340 మీ/సె | 340 m/s' },
        { id: 'c', text: '350 మీ/సె | 350 m/s' },
        { id: 'd', text: '360 మీ/సె | 360 m/s' }
      ],
      correctAnswer: 'b',
      marks: 4
    }
  ],
  chemistry: [
    {
      _id: '11',
      examId: '1',
      subject: 'chemistry',
      questionText: 'నీటి రసాయన సూత్రం ఏది?',
      options: [
        { id: 'a', text: 'H₂O' },
        { id: 'b', text: 'CO₂' },
        { id: 'c', text: 'NH₃' },
        { id: 'd', text: 'CH₄' }
      ],
      correctAnswer: 'a',
      marks: 4
    },
    {
      _id: '12',
      examId: '1',
      subject: 'chemistry',
      questionText: 'కార్బన్ యొక్క పరమాణు సంఖ్య ఎంత?',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '6' },
        { id: 'c', text: '7' },
        { id: 'd', text: '8' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '13',
      examId: '1',
      subject: 'chemistry',
      questionText: 'ఆమ్లాలు నీటిలో విడుదల చేసేవి ఏవి?',
      options: [
        { id: 'a', text: 'OH⁻ అయాన్లు | OH⁻ ions' },
        { id: 'b', text: 'H⁺ అయాన్లు | H⁺ ions' },
        { id: 'c', text: 'Cl⁻ అయాన్లు | Cl⁻ ions' },
        { id: 'd', text: 'Na⁺ అయాన్లు | Na⁺ ions' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '14',
      examId: '1',
      subject: 'chemistry',
      questionText: 'pH స్కేల్ పరిధి ఎంత?',
      options: [
        { id: 'a', text: '0-10' },
        { id: 'b', text: '0-14' },
        { id: 'c', text: '1-14' },
        { id: 'd', text: '0-12' }
      ],
      correctAnswer: 'b',
      marks: 4
    },
    {
      _id: '15',
      examId: '1',
      subject: 'chemistry',
      questionText: 'సోడియం క్లోరైడ్ యొక్క రసాయన సూత్రం ఏది?',
      options: [
        { id: 'a', text: 'NaCl' },
        { id: 'b', text: 'Na₂Cl' },
        { id: 'c', text: 'NaCl₂' },
        { id: 'd', text: 'Na₂Cl₂' }
      ],
      correctAnswer: 'a',
      marks: 4
    }
  ]
};

// store submissions for mock reporting
const mockSubmissions: any[] = [];
// store upload metadata (sheet names, uploader file info)
const mockUploads: any[] = [];
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
    await delay(1000);
    const assigned = mockUsers.filter(u => u.role === 'student').map(u => u.id);
    const newExam = {
      _id: Date.now().toString(),
      ...examData,
      assignedStudents: assigned,
      totalMarks: 0
    };
    mockExams.push(newExam);
    return newExam;
  }

  async getAllExams() {
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
}

export const apiService = new ApiService();