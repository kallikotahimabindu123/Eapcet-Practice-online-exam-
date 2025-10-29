import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Question, ExamResult } from '../types';
import { supabaseService } from '../services/supabaseService';

// Local types (the central `types` file doesn't export these exact helpers)
type QuestionState = {
  id: string;
  answered: boolean;
  flagged: boolean;
  visited: boolean;
};

interface ExamMetadata {
  timeLimitMinutes: number;
  [key: string]: any;
}

interface ExamState {
  currentQuestionIndex: number;
  answers: Map<string, string>;
  questionStates: Map<string, QuestionState>;
  timeRemaining: number;
  isSubmitted: boolean;
  startTime: number;
}

interface ExamContextType {
  examState: ExamState;
  questions: Question[];
  examMetadata: ExamMetadata | null;
  currentQuestion: Question | null;
  result: ExamResult | null;
  initializeExam: () => Promise<void>;
  answerQuestion: (questionId: string, optionId: string) => void;
  flagQuestion: (questionId: string) => void;
  navigateToQuestion: (index: number) => void;
  submitExam: (payload: any) => Promise<any>;
  updateTimer: (timeRemaining: number) => void;
  isLoading: boolean;
  error: string | null;
}
import { useAuth } from './AuthContext';
import { mockApi } from '../services/mockApi';

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = (): ExamContextType => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'examState';

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const { token } = useAuth();
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    questionStates: new Map(),
    timeRemaining: 0,
    isSubmitted: false,
    startTime: 0
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examMetadata, setExamMetadata] = useState<ExamMetadata | null>(null);
  const [result] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[examState.currentQuestionIndex] || null;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (examState.startTime > 0) {
      const stateToSave = {
        ...examState,
        answers: Array.from(examState.answers.entries()),
        questionStates: Array.from(examState.questionStates.entries())
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [examState]);

  const loadStoredState = (): ExamState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          answers: new Map(parsed.answers || []),
          questionStates: new Map(parsed.questionStates || [])
        };
      }
    } catch (error) {
      console.error('Failed to load stored exam state:', error);
    }
    return null;
  };

  const initializeExam = async (): Promise<void> => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const [metadata, questionsData] = await Promise.all([
        mockApi.getExamMetadata(token),
        mockApi.getQuestions(token)
      ]);

      setExamMetadata(metadata);
      setQuestions(questionsData);

      // Try to restore previous state
      const storedState = loadStoredState();
      
      if (storedState && !storedState.isSubmitted) {
        setExamState(storedState);
      } else {
        // Initialize fresh exam state
        const initialQuestionStates = new Map<string, QuestionState>();
        questionsData.forEach((question: Question) => {
          initialQuestionStates.set(question.id, {
            id: question.id,
            answered: false,
            flagged: false,
            visited: false
          });
        });

        setExamState({
          currentQuestionIndex: 0,
          answers: new Map(),
          questionStates: initialQuestionStates,
          timeRemaining: metadata.timeLimitMinutes * 60,
          isSubmitted: false,
          startTime: Date.now()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize exam');
    } finally {
      setIsLoading(false);
    }
  };

  const answerQuestion = (questionId: string, optionId: string) => {
    setExamState((prev: ExamState) => {
      const newAnswers = new Map(prev.answers);
      newAnswers.set(questionId, optionId);

      const newQuestionStates = new Map(prev.questionStates);
      const currentState = newQuestionStates.get(questionId);
      if (currentState) {
        newQuestionStates.set(questionId, {
          ...currentState,
          answered: true,
          visited: true
        });
      }

      return {
        ...prev,
        answers: newAnswers,
        questionStates: newQuestionStates
      };
    });
  };

  const flagQuestion = (questionId: string) => {
    setExamState((prev: ExamState) => {
      const newQuestionStates = new Map(prev.questionStates);
      const currentState = newQuestionStates.get(questionId);
      if (currentState) {
        newQuestionStates.set(questionId, {
          ...currentState,
          flagged: !currentState.flagged,
          visited: true
        });
      }

      return {
        ...prev,
        questionStates: newQuestionStates
      };
    });
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      const questionId = questions[index].id;
      
  setExamState((prev: ExamState) => {
        const newQuestionStates = new Map(prev.questionStates);
        const currentState = newQuestionStates.get(questionId);
        if (currentState) {
          newQuestionStates.set(questionId, {
            ...currentState,
            visited: true
          });
        }

        return {
          ...prev,
          currentQuestionIndex: index,
          questionStates: newQuestionStates
        };
      });
    }
  };

  // Replace / update existing submitExam implementation
  const submitExam = async (payload: {
    examId: string;
    answers: any;
    tabSwitchCount?: number;
    suspiciousActivity?: string[];
    startedAt?: string;
    finishedAt?: string;
  }): Promise<any> => {
    try {
      console.log('ExamContext: submitting', payload);
      // send to service that writes to DB (supabaseService or api)
      const result = await supabaseService.submitExam({
        exam_id: payload.examId,
        answers: payload.answers,
        tab_switch_count: payload.tabSwitchCount ?? 0,
        suspicious_activity: payload.suspiciousActivity ?? [],
        started_at: payload.startedAt ?? null,
        finished_at: payload.finishedAt ?? new Date().toISOString(),
      });

      console.log('ExamContext: submit result', result);
      return result;
    } catch (err: any) {
      console.error('ExamContext: submitExam error', err);
      return { error: true, message: err?.message || 'Submit failed' };
    }
  };

  const updateTimer = (timeRemaining: number) => {
    setExamState((prev: ExamState) => ({
      ...prev,
      timeRemaining
    }));
  };

  return (
    <ExamContext.Provider
      value={{
        examState,
        questions,
        examMetadata,
        currentQuestion,
        result,
        initializeExam,
        answerQuestion,
        flagQuestion,
        navigateToQuestion,
        submitExam,
        updateTimer,
        isLoading,
        error
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};