import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../contexts/ExamContext';
import { useAuth } from '../contexts/AuthContext';
import { Clock, BookOpen, Target, AlertCircle, LogOut, Play } from 'lucide-react';

const ExamLanding: React.FC = () => {
  const { examMetadata, initializeExam, isLoading, error } = useExam();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initializeExam();
  }, []);

  const handleStartExam = () => {
    navigate('/exam/take');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => initializeExam()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!examMetadata) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EAPCET Online Test</h1>
                <p className="text-sm text-gray-500">Rompit Technologies</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-8 mb-8 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">స్వాగతం! Welcome to Online Examination</h2>
            <p className="text-xl opacity-90 mb-4">
              ఆన్‌లైన్ పరీక్షకు స్వాగతం | Welcome to the Digital Assessment Platform
            </p>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 inline-block">
              <p className="text-lg font-medium">
                మీ విజయానికి శుభాకాంక్షలు | Best wishes for your success!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{examMetadata.title}</h2>
          <p className="text-xl text-gray-600">
            మీ జ్ఞానాన్ని పరీక్షించండి మరియు మీ సిద్ధతా స్థాయిని అంచనా వేయండి
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Test your knowledge and assess your preparation level
          </p>
        </div>

        {/* Exam Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">పరీక్ష వివరాలు | Exam Details</h3>
          <p className="text-gray-600 text-center mb-6">గణితం, భౌతిక శాస్త్రం, రసాయన శాస్త్రం | Mathematics, Physics, Chemistry</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-1">మొత్తం ప్రశ్నలు</h4>
              <p className="text-sm text-gray-600 mb-1">Total Questions</p>
              <p className="text-3xl font-bold text-blue-600">{examMetadata.totalQuestions}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-1">మొత్తం మార్కులు</h4>
              <p className="text-sm text-gray-600 mb-1">Total Marks</p>
              <p className="text-3xl font-bold text-green-600">{examMetadata.totalMarks}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-1">సమయ పరిమితి</h4>
              <p className="text-sm text-gray-600 mb-1">Time Limit</p>
              <p className="text-3xl font-bold text-orange-600">{examMetadata.timeLimitMinutes} min</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">ముఖ్యమైన సూచనలు | Important Instructions:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">ప్రతి ప్రశ్నను జాగ్రత్తగా చదివి సమాధానం ఎంచుకోండి</span>
                  <br />
                  <span className="text-sm text-gray-600">Read each question carefully before selecting your answer.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">సైడ్‌బార్ లేదా నావిగేషన్ బటన్‌లను ఉపయోగించి ప్రశ్నల మధ్య తిరుగుతారు</span>
                  <br />
                  <span className="text-sm text-gray-600">You can navigate between questions using the sidebar or navigation buttons.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">సమాధానం గురించి అనుమానం ఉంటే ప్రశ్నలను రివ్యూ కోసం ఫ్లాగ్ చేయండి</span>
                  <br />
                  <span className="text-sm text-gray-600">Flag questions for review if you're unsure about the answer.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">సమయ పరిమితి చేరుకున్నప్పుడు పరీక్ష ఆటోమేటిక్‌గా సబ్మిట్ అవుతుంది</span>
                  <br />
                  <span className="text-sm text-gray-600">The exam will auto-submit when the time limit is reached.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">అనుకోకుండా పేజీ రిఫ్రెష్ అయినా మీ పురోగతి ఆటోమేటిక్‌గా సేవ్ అవుతుంది</span>
                  <br />
                  <span className="text-sm text-gray-600">Your progress is automatically saved in case of accidental page refresh.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartExam}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center space-x-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              <span>పరీక్ష ప్రారంభించండి | Start Exam</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              స్థిరమైన ఇంటర్నెట్ కనెక్షన్ ఉందని నిర్ధారించుకోండి | Make sure you have a stable internet connection
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            © 2025 Rompit Technologies — Developed
          </p>
        </div>
      </main>
    </div>
  );
};

export default ExamLanding;