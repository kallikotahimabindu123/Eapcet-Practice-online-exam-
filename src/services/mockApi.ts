import { mockUser, mockExamMetadata, mockQuestions as defaultMockQuestions } from '../data/mockData';
import { apiService } from './api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async login(email: string, _password: string): Promise<any> {
    await delay(1000);
    
    // For development: accept any credentials
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        ...mockUser,
        email: email.trim()
      }
    };
  },

  async getExamMetadata(token: string): Promise<any> {
    await delay(500);
    
    if (!token) {
      throw new Error('Unauthorized');
    }
    // Prefer latest exam metadata from the mock API service so uploads/creates are reflected
    try {
      const exams: any = await apiService.getAllExams();
      if (exams && exams.length > 0) {
        // Use the first exam as the active exam in this simplified mock
        const exam = exams[0];
        const questions = await apiService.getExamQuestions(exam._id);
        return {
          title: exam.title || mockExamMetadata.title,
          totalQuestions: (questions || []).length,
          timeLimitMinutes: exam.duration || mockExamMetadata.timeLimitMinutes,
          totalMarks: exam.totalMarks ?? mockExamMetadata.totalMarks
        };
      }
    } catch (e) {
      // fall back to bundled mock metadata
    }

    return mockExamMetadata;
  },

  async getQuestions(token: string): Promise<any[]> {
    await delay(800);
    
    if (!token) {
      throw new Error('Unauthorized');
    }
    // Return questions from the central apiService so uploaded questions show up for students
    try {
      const exams: any = await apiService.getAllExams();
      const examId = exams && exams.length > 0 ? exams[0]._id : null;
      const remoteQuestions: any[] = await apiService.getExamQuestions(examId);

  // Normalize different shapes into the Question shape the UI expects
  const normalized: any[] = (remoteQuestions || defaultMockQuestions).map((q: any) => ({
        id: q._id ?? q.id,
        text: q.questionText ?? q.text ?? '',
        options: (q.options || []).map((opt: any) => ({ id: opt.id, text: opt.text })),
        correctOptionId: q.correctOptionId ?? q.correctAnswer ?? q.correct_answer ?? '',
        marks: Number(q.marks ?? q.marks ?? 4),
        subject: q.subject ?? 'mathematics'
      }));

      return normalized;
    } catch (e) {
      // fallback to bundled questions
      return defaultMockQuestions as unknown as any[];
    }
  },

  async submitExam(
    token: string,
    answers: Map<string, string>,
    timeTaken: number
  ): Promise<any> {
    await delay(1500);
    
    if (!token) {
      throw new Error('Unauthorized');
    }

    const details: any[] = (defaultMockQuestions || []).map((question: any) => {
      const selectedOptionId = answers.get(question.id);
      const selectedOption = selectedOptionId
        ? question.options.find((opt: any) => opt.id === selectedOptionId) || null
        : null;
      const correctOption = question.options.find((opt: any) => opt.id === question.correctOptionId)!;
      const isCorrect = selectedOptionId === question.correctOptionId;

      return {
        questionId: question.id,
        questionText: question.text,
        selectedOption,
        correctOption,
        isCorrect,
        marks: question.marks
      };
    });

    const answeredCount = Array.from(answers.values()).filter(Boolean).length;
    const correctCount = details.filter(detail => detail.isCorrect).length;
    const obtainedMarks = details.reduce((total, detail) => 
      total + (detail.isCorrect ? detail.marks : 0), 0
    );

    return {
      totalQuestions: defaultMockQuestions.length,
      answeredCount,
      correctCount,
      totalMarks: mockExamMetadata.totalMarks,
      obtainedMarks,
      percentage: (obtainedMarks / mockExamMetadata.totalMarks) * 100,
      timeTaken,
      details
    };
  }
};