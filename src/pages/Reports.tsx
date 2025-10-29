import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// No auth info required for this simple reports view in the mock; remove unused import
import { apiService } from '../services/api';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [examStats, setExamStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchExams();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await apiService.getAllSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const data = await apiService.getAllExams();
      setExams(data || []);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  const onSelectExam = async (examId: string) => {
    setSelectedExam(examId);
    setIsLoading(true);
    try {
      if (examId) {
        const stats = await apiService.getExamStats(examId);
        setExamStats(stats);
        // fetch submissions for this exam
        const all = await apiService.getAllSubmissions();
        setSubmissions((all || []).filter((s: any) => s.examId === examId));
      } else {
        setExamStats(null);
        const all = await apiService.getAllSubmissions();
        setSubmissions(all || []);
      }
    } catch (err) {
      console.error('Failed to load exam stats/submissions', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-500">Student submissions and results</p>
            </div>
            <div>
              <button onClick={() => navigate('/admin')} className="text-blue-600">Back to dashboard</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Student Results</h2>

          {isLoading ? (
            <div>Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="text-gray-500">No submissions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.examId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.result?.total ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.result?.percentage ? s.result.percentage.toFixed(1) + '%' : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mb-4 flex items-center space-x-3">
            <label className="text-sm font-medium">Filter by Exam:</label>
            <select
              value={selectedExam}
              onChange={(e) => onSelectExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">All Exams</option>
              {exams.map((ex) => (
                <option key={ex._id || ex.id} value={ex._id || ex.id}>{ex.title}</option>
              ))}
            </select>

            {examStats && (
              <div className="ml-4 text-sm text-gray-700">
                <strong>Total Submissions:</strong> {examStats.totalSubmissions} &nbsp; 
                <strong>Avg Score:</strong> {examStats.averageScore}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
