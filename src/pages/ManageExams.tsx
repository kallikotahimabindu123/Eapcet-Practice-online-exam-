import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
// The mock API returns exams in a frontend-friendly shape (camelCase, _id).
// Define a local type to match that shape so we don't fight the global backend types.
type LocalExam = {
  _id: string;
  title: string;
  description: string;
  active: boolean;
  startTime: string;
  endTime: string;
  duration: number;
  assignedStudents?: string[];
  totalMarks?: number;
  has_questions?: boolean;
};
import { ArrowLeft, Eye, EyeOff, Users, BarChart3, Calendar, Upload } from 'lucide-react';
 
const ManageExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<LocalExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await apiService.getAllExams();
      setExams(data);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: boolean) => {
    try {
      await apiService.toggleExamStatus(examId, !currentStatus);
      setExams(exams.map(exam => 
        exam._id === examId ? { ...exam, active: !currentStatus } : exam
      ));
    } catch (error) {
      console.error('Failed to toggle exam status:', error);
      alert('Failed to update exam status');
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Manage Exams</h1>
            </div>
            <button
              onClick={() => navigate('/admin/create-exam')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Exam
            </button>
            <button
              onClick={() => navigate('/admin/create-exam')}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Questions</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Created</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first exam.</p>
            <button
              onClick={() => navigate('/admin/create-exam')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Exam
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Exams ({exams.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {exam.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {exam.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Duration: {exam.duration} minutes | Total Marks: {exam.totalMarks}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Start: {formatDate(exam.startTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>End: {formatDate(exam.endTime)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleExamStatus(exam._id, exam.active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            exam.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
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
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                          <Users className="w-4 h-4" />
                          <span>{exam.assignedStudents?.length || 0} assigned</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/assign-exam/${exam._id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Assign Students
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Assign this exam to ALL registered students?')) return;
                              try {
                                const res = await apiService.assignAllStudents(exam._id);
                                alert(res?.message || 'Assigned to all students');
                                // refresh exams to show updated counts
                                fetchExams();
                              } catch (err: any) {
                                console.error('Assign all failed', err);
                                alert(err?.message || 'Failed to assign all students');
                              }
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Assign All
                          </button>
                          <button
                            onClick={() => navigate(`/admin/exam-stats/${exam._id}`)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            View Stats
                          </button>
                          <button
                            onClick={() => navigate('/admin/create-exam')}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            Add Questions
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
      </main>

      {/* Upload moved to CreateExam page */}
    </div>
  );
};

export default ManageExams;