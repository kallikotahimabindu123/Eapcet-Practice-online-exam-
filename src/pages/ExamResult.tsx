import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Home, Download, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ExamResult: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    mathematics: false,
    physics: false,
    chemistry: false
  });

  useEffect(() => {
    // Prefer navigation state (navigate('/exam/result', { state })) -> supports immediate display
    // Fallback to localStorage: examResult_{examId}
    try {
      const locState: any = (location && (location as any).state) || null;
      let stored: any = null;

      if (locState && (locState.result || locState.results)) {
        stored = locState.result ?? locState.results;
      } else {
        const savedResult = examId ? localStorage.getItem(`examResult_${examId}`) : null;
        if (savedResult) {
          stored = JSON.parse(savedResult);
        }
      }

      if (stored) {
        setResult(stored);
      } else {
        // No result available — leave result null and show friendly message in UI
        setResult(null);
      }
    } catch (e) {
      console.warn('ExamResult: failed to load result', e);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 80) return 'అద్భుతమైన పనితీరు! | Excellent Performance!';
    if (percentage >= 60) return 'మంచి పనితీరు! | Good Performance!';
    if (percentage >= 40) return 'సాధారణ పనితీరు | Average Performance';
    return 'మెరుగుదల అవసరం | Needs Improvement';
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'గణితం | Mathematics';
      case 'physics': return 'భౌతిక శాస్త్రం | Physics';
      case 'chemistry': return 'రసాయన శాస్త్రం | Chemistry';
      default: return subject;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Exam Results</h1>
                <p className="text-sm text-gray-500">EAPCET Mock Test</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user?.photo && (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
              )}
              <span className="text-sm text-gray-600">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-2 ${getPerformanceColor(result.percentage)}`}>
              {result.percentage.toFixed(1)}%
            </div>
            <h2 className={`text-2xl font-semibold mb-2 ${getPerformanceColor(result.percentage)}`}>
              {getPerformanceMessage(result.percentage)}
            </h2>
            <p className="text-gray-600">
              You scored {result.total} out of {result.totalMarks} marks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Mathematics</h3>
              <p className="text-3xl font-bold text-blue-600">{result.mathematics}</p>
              <p className="text-sm text-gray-600">out of 20 marks</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Physics</h3>
              <p className="text-3xl font-bold text-green-600">{result.physics}</p>
              <p className="text-sm text-gray-600">out of 20 marks</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Chemistry</h3>
              <p className="text-3xl font-bold text-orange-600">{result.chemistry}</p>
              <p className="text-sm text-gray-600">out of 20 marks</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-5 h-5" />
              <span>Download Results</span>
            </button>
          </div>
        </div>

        {/* Detailed Question-wise Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Question-wise Analysis
          </h3>
          
          <div className="space-y-6">
            {Object.entries(result.details || {}).map(([subject, data]: [string, any]) => (
              <div key={subject} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(subject)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {getSubjectName(subject)}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-medium">
                        Score: {data.score}/{data.total}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {((data.score / data.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {expandedSections[subject] ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>

                {expandedSections[subject] && (
                  <div className="px-6 py-4 space-y-4">
                    {data.details && data.details.length > 0 ? (
                      data.details.map((question: any, index: number) => (
                        <div key={question.questionId} className="border-l-4 border-gray-200 pl-4 py-3">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900">
                              Question {index + 1}
                            </h5>
                            <div className="flex items-center space-x-2">
                              {question.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className={`text-sm font-medium ${
                                question.isCorrect ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {question.marksAwarded}/{question.marks} marks
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{question.questionText}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Your Answer:</span>
                              <p className={`mt-1 p-2 rounded ${
                                question.selectedAnswer === 'Not Answered' 
                                  ? 'bg-gray-100 text-gray-500' 
                                  : question.isCorrect 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {question.selectedAnswer}
                              </p>
                            </div>
                            
                            <div>
                              <span className="font-medium text-gray-600">Correct Answer:</span>
                              <p className="mt-1 p-2 rounded bg-green-100 text-green-800">
                                {question.correctAnswer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No detailed results available for this section
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            © 2025 Rompit Technologies — Developed
          </p>
        </div>
      </main>
    </div>
  );
};

export default ExamResult;