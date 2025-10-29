import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Exam, Question } from '../types';
import { supabaseService } from '../services/supabaseService';
import {
  Clock,
  LogOut,
  Send,
  Flag,
  FlagOff,
  ChevronLeft,
  ChevronRight,
  Save,
  Camera,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';

// --- helpers & local types ---
type Subject = 'mathematics' | 'physics' | 'chemistry';
type AnswerItem = { questionId: string; selectedAnswer: string };
type AnswersMap = Record<Subject, AnswerItem[]>;

const normalizeQuestions = (raw: any[]): Question[] =>
  (raw || []).map((q) => ({
    id: q.id ?? q._id ?? String(Math.random()),
    exam_id: q.exam_id ?? q.examId ?? null,
    question_text: q.question_text ?? q.text ?? '',
    options: (q.options ?? []).map((o: any) => ({
      id: o.id ?? o._id ?? String(Math.random()),
      text: o.text ?? o.label ?? '',
    })),
    correct_answer: q.correct_answer ?? q.correctOptionId ?? q.correct ?? null,
    marks: q.marks ?? q.weight ?? 1,
    difficulty: q.difficulty ?? 'medium',
    subject: q.subject ?? 'mathematics',
  })) as Question[];

const normalizeExam = (r: any): Exam =>
  ({
    // keep backend fields if present, then normalize well-known fields/aliases
    ...(r ?? {}),
    id: r?.id ?? r?._id ?? '',
    title: r?.title ?? '',
    description: r?.description ?? '',
    active: r?.active ?? !!r?.active,
    start_time: r?.start_time ?? r?.startTime ?? new Date().toISOString(),
    end_time: r?.end_time ?? r?.endTime ?? new Date().toISOString(),
    duration: r?.duration ?? r?.duration ?? 0,
    total_marks: r?.total_marks ?? r?.totalMarks ?? 0,
    // add common audit / meta defaults so object literal matches Exam shape
    created_by: r?.created_by ?? r?.createdBy ?? null,
    created_at: r?.created_at ?? r?.createdAt ?? new Date().toISOString(),
    updated_at: r?.updated_at ?? r?.updatedAt ?? new Date().toISOString(),
    has_images: r?.has_images ?? r?.hasImages ?? false,
    // keep any extra fields the backend provided
  } as Exam);

const ExamTake: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject>('mathematics');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({
    mathematics: [],
    physics: [],
    chemistry: []
  } as AnswersMap);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSubmitError] = useState<string | null>(null); // keep setter only to avoid "value is never read"
  const [startTime] = useState(Date.now());
  const [showWebcamSetup, setShowWebcamSetup] = useState(true);
  const [webcamPermissionGranted, setWebcamPermissionGranted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState<string[]>([]);
  const [currentSubmissionId] = useState<string | null>(null); // remove unused setter

  useEffect(() => {
    if (examId && webcamPermissionGranted) {
      fetchExamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, webcamPermissionGranted]);

  useEffect(() => {
    if (currentSubject && allQuestions.length > 0) {
      const subjectQuestions = allQuestions.filter(q => q.subject === currentSubject);
      setQuestions(subjectQuestions);
      setCurrentQuestionIndex(0);
    }
  }, [currentSubject, allQuestions]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Auto-save answers every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      try {
        if (Object.keys(answers).length > 0) {
          localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers));
          localStorage.setItem(`exam_${examId}_flags`, JSON.stringify(Array.from(flaggedQuestions)));
        }
      } catch (e) {
        console.warn('Auto-save failed', e);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [answers, flaggedQuestions, examId]);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => {
          const next = c + 1;
          console.log('ExamTake: tab switched — new count', next);
          return next;
        });
        setSuspiciousActivity(prev => [...prev, `Tab switched at ${new Date().toISOString()}`]);
      }
    };

    const handleBlur = () => {
      setSuspiciousActivity(prev => [...prev, `Window lost focus at ${new Date().toISOString()}`]);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Disable right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSuspiciousActivity(prev => [...prev, `Right-click attempted at ${new Date().toISOString()}`]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'a')
      ) {
        e.preventDefault();
        setSuspiciousActivity(prev => [...prev, `Blocked shortcut: ${e.key} at ${new Date().toISOString()}`]);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleWebcamPermissionGranted = () => {
    setWebcamPermissionGranted(true);
    setShowWebcamSetup(false);
  };

  const handlePhotoCapture = async (photoBlob: Blob) => {
    if (currentSubmissionId) {
      try {
        await supabaseService.saveProctorPhoto(currentSubmissionId, photoBlob);
      } catch (error) {
        console.error('Failed to save proctor photo:', error);
      }
    }
  };

  const handleWebcamPermissionDenied = () => {
    alert('Camera access is required to take the exam. Please allow camera access and try again.');
  };

  const fetchExamData = async () => {
    try {
      const examData = await apiService.getExam(examId!);
      if (!examData) {
        navigate('/dashboard');
        return;
      }
      setExam(normalizeExam(examData));
      setTimeRemaining((examData.duration ?? 0) * 60);

      // Fetch all questions and normalize
      const allQuestionsData = await apiService.getExamQuestions(examId!);
      const normalized = normalizeQuestions(allQuestionsData ?? []);
      setAllQuestions(normalized);

      // Load saved answers if any
      const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
      const savedFlags = localStorage.getItem(`exam_${examId}_flags`);
      
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers) as AnswersMap);
        } catch (e) {
          console.warn('Failed to parse saved answers', e);
        }
      }
      if (savedFlags) {
        try {
          setFlaggedQuestions(new Set(JSON.parse(savedFlags)));
        } catch (e) {
          console.warn('Failed to parse saved flags', e);
        }
      }

    } catch (error) {
      console.error('Failed to fetch exam:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers(prev => {
      const list = prev[currentSubject] || [];
      const filtered = list.filter((a: AnswerItem) => a.questionId !== questionId);
      return {
        ...prev,
        [currentSubject]: [...filtered, { questionId, selectedAnswer }]
      } as AnswersMap;
    });
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // submit handler — always attempt submit, include tabSwitchCount and suspiciousActivity
  const handleSubmitExam = async () => {
    console.log('ExamTake: submit requested', { examId, tabSwitchCount, suspiciousActivity, answers });
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        examId,
        answers,
        tabSwitchCount,
        suspiciousActivity,
        startedAt: startTime,
        finishedAt: new Date().toISOString(),
      };

      console.log('ExamTake: submit payload', payload);

      // compute timeTaken in seconds
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      // use your existing apiService if available, otherwise fallback to fetch
      let res;
      if (apiService?.submitExamAndRecord) {
        // prefer the helper that records the submission in the mock store
        res = await apiService.submitExamAndRecord(examId!, answers, timeTaken, user?.id);
      } else if (apiService?.submitExam) {
        // call submitExam with the expected args: examId, answers, timeTaken
        res = await apiService.submitExam(examId!, answers, timeTaken, user?.id);
      } else {
        res = await fetch('/api/exams/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // normalize response: support both fetch-like Responses and plain objects returned by apiService
      let ok = false;
      let status = 500;
      let result: any = null;

      try {
        if (res && typeof res === 'object' && ('ok' in res || 'status' in res || typeof (res as any).json === 'function')) {
          // fetch-like Response
          ok = (res as any)?.ok ?? !!((res as any)?.status && (res as any).status >= 200 && (res as any).status < 300);
          status = (res as any)?.status ?? (ok ? 200 : 500);
          try {
            result = (res as any)?.json ? await (res as any).json() : (res as any).body ?? res;
          } catch (e) {
            console.warn('ExamTake: submit response not JSON', e);
            result = res;
          }
        } else if (res && typeof res === 'object') {
          // plain-object response from apiService/mock implementations
          // treat as success unless it explicitly indicates an error
          ok = !(res as any).error;
          status = ok ? 200 : (res as any).status ?? 500;
          result = res;
        } else {
          // unexpected response type
          ok = false;
          result = res;
        }
      } catch (e) {
        console.error('ExamTake: error normalizing submit response', e);
        ok = false;
        result = res;
      }

      console.log('ExamTake: submit response', { status, ok, result });

      if (!ok) {
        const msg = result?.message || `Submission failed (${status})`;
        setSubmitError(msg);
        return;
      }

      // success — persist result for the ExamResult page and navigate
      try {
        // apiService mock returns { message, results: { ... } }
        const payloadToStore = result?.results ?? result;
        if (examId) {
          localStorage.setItem(`examResult_${examId}`, JSON.stringify(payloadToStore));
        }

        // navigate to the route that exists in the app: /result/:examId
        // pass the result via navigation state for immediate display
        alert('Exam submitted successfully');
        navigate(`/result/${examId}`, { state: { result: payloadToStore } });
      } catch (e) {
        console.warn('ExamTake: failed to store result in localStorage or navigate', e);
        // fallback: still navigate without state
        navigate(`/result/${examId}`);
      }
    } catch (err: any) {
      console.error('ExamTake: submit exception', err);
      setSubmitError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentAnswer = (questionId: string) => {
    return (answers[currentSubject] || []).find((a) => a.questionId === questionId)?.selectedAnswer || '';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'Mathematics';
      case 'physics': return 'Physics'; 
      case 'chemistry': return 'Chemistry';
      default: return subject;
    }
  };

  const getQuestionStatus = (questionId: string) => {
    const isAnswered = getCurrentAnswer(questionId) !== '';
    const isFlagged = flaggedQuestions.has(questionId);
    
    if (isFlagged && isAnswered) return 'flagged-answered';
    if (isFlagged) return 'flagged';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status: string, isCurrentQuestion: boolean) => {
    if (isCurrentQuestion) {
      return 'bg-blue-600 text-white ring-2 ring-blue-300';
    }
    
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'flagged':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'flagged-answered':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      default:
        return 'bg-red-500 text-white hover:bg-red-600';
    }
  };

  const getSubjectStats = (subject: Subject) => {
    const subjectQuestions = allQuestions.filter(q => q.subject === subject);
    const answered = (answers[subject] || []).length;
    const flagged = subjectQuestions.filter(q => flaggedQuestions.has(q.id)).length;
    return { total: subjectQuestions.length, answered, flagged };
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to next subject or show completion message
      const subjects = ['mathematics', 'physics', 'chemistry'] as const;
      const currentIndex = subjects.indexOf(currentSubject);
      if (currentIndex < subjects.length - 1) {
        setCurrentSubject(subjects[currentIndex + 1]);
      }
    }
  };

  // Show webcam setup if not granted permission yet
  if (showWebcamSetup || !webcamPermissionGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <WebcamMonitor
            onPermissionGranted={handleWebcamPermissionGranted}
            onPermissionDenied={handleWebcamPermissionDenied}
            isRecording={true}
            onPhotoCapture={handlePhotoCapture}
          />
        </div>
      </div>
    );
  }

  if (!exam || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">{exam.title}</h1>
                <p className="text-xs text-gray-500">Online Examination</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs text-green-600">
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Recording</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-mono text-sm font-semibold ${
                timeRemaining <= 300 ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center space-x-2">
                {user?.photo && (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                  />
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subject Tabs */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {(['mathematics', 'physics', 'chemistry'] as const).map((subject) => {
              const stats = getSubjectStats(subject);
              return (
                <button
                  key={subject}
                  onClick={() => setCurrentSubject(subject)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
                    currentSubject === subject
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                    <div className="flex space-x-2 text-xs mt-1">
                      <span className="text-green-600">✓{stats.answered}</span>
                      <span className="text-orange-600">⚑{stats.flagged}</span>
                      <span className="text-gray-500">/{stats.total}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
       {/* Security Warnings */}
       {(tabSwitchCount > 0 || suspiciousActivity.length > 0) && (
         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg">
           <div className="flex items-center space-x-2">
             <AlertCircle className="w-4 h-4" />
             <span className="text-sm font-medium">
               Security Alert: {tabSwitchCount} tab switches, {suspiciousActivity.length} suspicious activities detected
             </span>
           </div>
         </div>
       )}

        {/* Question Area */}
        <main className="flex-1 p-4 lg:p-6">
          {currentQuestion ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Section
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {currentQuestion.marks} marks
                    </span>
                    <button
                      onClick={() => handleFlagQuestion(currentQuestion.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        flaggedQuestions.has(currentQuestion.id)
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={flaggedQuestions.has(currentQuestion.id) ? 'Remove flag' : 'Flag for review'}
                    >
                      {flaggedQuestions.has(currentQuestion.id) ? 
                        <FlagOff className="w-4 h-4" /> : 
                        <Flag className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-900 text-lg leading-relaxed">
                    {currentQuestion.question_text}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                        getCurrentAnswer(currentQuestion.id) === option.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option.id}
                          checked={getCurrentAnswer(currentQuestion.id) === option.id}
                          onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                          className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <span className="font-bold text-gray-900 text-lg bg-gray-100 px-3 py-1 rounded-lg min-w-[2.5rem] text-center">
                          {String(option.id).toUpperCase()}
                        </span>
                        <span className="text-gray-900 flex-1 text-lg">{option.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleSaveAndNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Next</span>
                </button>

                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No questions available for this section.</p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <div className={`fixed lg:relative top-0 right-0 h-full lg:h-auto w-80 bg-white border-l shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-semibold text-gray-900">Navigation</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden lg:block">
              <h3 className="font-semibold text-gray-900 mb-4">Exam Progress</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              {(['mathematics', 'physics', 'chemistry'] as const).map((subject) => {
                const stats = getSubjectStats(subject);
                const percentage = stats.total ? (stats.answered / stats.total) * 100 : 0;
                
                return (
                  <div key={subject} className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 font-medium">
                        {getSubjectName(subject)}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {stats.answered}/{stats.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Flagged: {stats.flagged}</span>
                      <span>{percentage.toFixed(0)}% Complete</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Total Questions:</span>
                  <span className="font-medium">{allQuestions.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Answered:</span>
                  <span className="font-medium text-green-600">
                    {answers.mathematics.length + answers.physics.length + answers.chemistry.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Flagged:</span>
                  <span className="font-medium text-orange-600">{flaggedQuestions.size}</span>
                </div>
              </div>
            </div>

            {/* Question Grid */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Questions
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const questionId = question.id;
                  const status = getQuestionStatus(questionId);
                  const isCurrentQuestion = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={questionId}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setSidebarOpen(false);
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${getStatusColor(status, isCurrentQuestion)}`}
                      title={`Question ${index + 1} - ${status.replace('-', ' ')}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Flagged</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              Auto-saves every 30 seconds
            </p>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ExamTake;