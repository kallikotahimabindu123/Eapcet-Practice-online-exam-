import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Award, Clock, Target } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

interface AnalyticsData {
  examPerformance: any[];
  subjectWisePerformance: any[];
  timeAnalysis: any[];
  difficultyAnalysis: any[];
  studentProgress: any[];
}

const AnalyticsDashboard: React.FC<{ examId?: string }> = ({ examId }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'time' | 'difficulty'>('score');

  useEffect(() => {
    fetchAnalyticsData();
  }, [examId]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch comprehensive analytics data
      const stats = await supabaseService.getAdminStats();
      
      // Mock data for demonstration - replace with real analytics
      const mockData: AnalyticsData = {
        examPerformance: [
          { name: 'Math Mock 1', averageScore: 75, submissions: 45, passRate: 80 },
          { name: 'Physics Test', averageScore: 68, submissions: 38, passRate: 65 },
          { name: 'Chemistry Quiz', averageScore: 82, submissions: 52, passRate: 90 },
          { name: 'Full Mock Test', averageScore: 71, submissions: 67, passRate: 75 }
        ],
        subjectWisePerformance: [
          { subject: 'Mathematics', averageScore: 76, totalQuestions: 120, difficulty: 'Medium' },
          { subject: 'Physics', averageScore: 69, totalQuestions: 100, difficulty: 'Hard' },
          { subject: 'Chemistry', averageScore: 81, totalQuestions: 110, difficulty: 'Easy' }
        ],
        timeAnalysis: [
          { questionRange: '1-10', averageTime: 45, optimalTime: 40 },
          { questionRange: '11-20', averageTime: 52, optimalTime: 45 },
          { questionRange: '21-30', averageTime: 48, optimalTime: 42 },
          { questionRange: '31-40', averageTime: 55, optimalTime: 50 }
        ],
        difficultyAnalysis: [
          { difficulty: 'Easy', correctRate: 85, totalQuestions: 50 },
          { difficulty: 'Medium', correctRate: 65, totalQuestions: 80 },
          { difficulty: 'Hard', correctRate: 45, totalQuestions: 30 }
        ],
        studentProgress: [
          { week: 'Week 1', averageScore: 60, studentsActive: 25 },
          { week: 'Week 2', averageScore: 65, studentsActive: 32 },
          { week: 'Week 3', averageScore: 70, studentsActive: 28 },
          { week: 'Week 4', averageScore: 75, studentsActive: 35 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Average Performance
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  74.5%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Students
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  156
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg. Completion Time
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  2.3h
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pass Rate
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  77.5%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.examPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageScore" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.subjectWisePerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, averageScore }) => `${subject}: ${averageScore}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="averageScore"
              >
                {analyticsData.subjectWisePerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Time Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.timeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="questionRange" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="averageTime" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="optimalTime" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.studentProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="averageScore" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="studentsActive" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Question Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, subject: 'Mathematics', difficulty: 'Easy', correctRate: 85, avgTime: 45 },
                { id: 2, subject: 'Physics', difficulty: 'Medium', correctRate: 65, avgTime: 52 },
                { id: 3, subject: 'Chemistry', difficulty: 'Hard', correctRate: 45, avgTime: 68 },
                { id: 4, subject: 'Mathematics', difficulty: 'Medium', correctRate: 72, avgTime: 48 },
                { id: 5, subject: 'Physics', difficulty: 'Easy', correctRate: 88, avgTime: 38 }
              ].map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Question {question.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.correctRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.avgTime}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;