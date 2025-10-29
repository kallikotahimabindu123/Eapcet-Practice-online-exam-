import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ExcelExport } from '../components/ExcelExport';
import { apiService } from '../services/api';
import { AdminStats } from '../types';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Plus, 
  Settings,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
  const data: any = await apiService.getAdminDashboard();
      // The mock api returns a lightweight object (with _id and camelCase fields).
      // Map it to the strong AdminStats shape expected by our types.
      const mapped = {
        totalStudents: data.totalStudents ?? 0,
        totalExams: data.totalExams ?? 0,
        totalSubmissions: data.totalSubmissions ?? 0,
        // Map each exam stat to the typed shape (id instead of _id, and add defaults)
        examStats: (data.examStats || []).map((e: any) => ({
          id: e._id ?? e.id ?? 'unknown',
          title: e.title ?? '',
          active: !!e.active,
          totalAssigned: e.totalAssigned ?? 0,
          totalSubmissions: e.totalSubmissions ?? 0,
          averageScore: e.averageScore ?? 0,
          highestScore: e.highestScore ?? 0,
          lowestScore: e.lowestScore ?? 0
        })),
        // These fields aren't provided by the mock — initialize to empty arrays
        recentActivity: data.recentActivity ?? [],
        performanceMetrics: data.performanceMetrics ?? []
      } as AdminStats;

      setStats(mapped);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">EAPCET Online Test Management</p>
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
                <p className="text-sm font-medium text-gray-900">Welcome Admin</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.totalStudents || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Exams
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.totalExams || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Submissions
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.totalSubmissions || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Exams
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.examStats.filter(exam => exam.active).length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Excel Export Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <ExcelExport />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/create-exam')}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Exam</span>
              </button>

              <button
                onClick={() => navigate('/admin/manage-exams')}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Manage Exams</span>
              </button>

              <button
                onClick={() => navigate('/admin/manage-students')}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Manage Students</span>
              </button>

              <button
                onClick={() => navigate('/admin/reports')}
                className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Exam Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Exam Statistics</h3>
          </div>
          <div className="p-6">
            {stats?.examStats && stats.examStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.examStats.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {exam.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            exam.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {exam.active ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.totalAssigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.totalSubmissions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.totalAssigned > 0 
                            ? Math.round((exam.totalSubmissions / exam.totalAssigned) * 100)
                            : 0
                          }%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No exams created yet</p>
                <button
                  onClick={() => navigate('/admin/create-exam')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Exam
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            © 2025 Rompit Technologies — Admin Panel
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;