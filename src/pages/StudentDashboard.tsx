import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Exam } from '../types';
import { BookOpen, Clock, Target, Play, LogOut, User, Calendar } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignedExams();
  }, []);

  const fetchAssignedExams = async () => {
    try {
      const data = await apiService.getAssignedExams();
      setExams(data);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your exams...</p>
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
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EAPCET Online Test</h1>
                <p className="text-sm text-gray-500">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user?.photo && (
                <img
                  src={`http://localhost:5000/uploads/${user.photo}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">స్వాగతం | Welcome</p>
                <p className="text-sm text-blue-600 font-semibold">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Online Examination Platform</h2>
            <p className="text-xl opacity-90 mb-4">
              Your gateway to digital assessment and evaluation
            </p>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 inline-block">
              <p className="text-lg font-medium">
                Best wishes for your success, {user?.name}!
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Exams Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Assigned Exams
          </h3>

          {exams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Exams Assigned</h4>
              <p className="text-gray-600">
                No exams have been assigned to you yet. Please contact your administrator.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div key={exam._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {exam.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {exam.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>Total Marks: {exam.totalMarks}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {formatDate(exam.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>End: {formatDate(exam.endTime)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartExam(exam._id)}
                    disabled={!exam.active}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Exam</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Important Instructions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Before Starting the Exam:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure you have a stable internet connection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Update your browser to the latest version</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Close all unnecessary applications and tabs</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">During the Exam:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use the flag feature to mark questions for review</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Manage your time effectively across all sections</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            © 2025 Rompit Technologies — Online Examination Platform
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;