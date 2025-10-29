import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ExamTake from './pages/ExamTake';
import ExamResult from './pages/ExamResult';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import ManageExams from './pages/ManageExams';
import ManageStudents from './pages/ManageStudents';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId"
            element={
              <ProtectedRoute>
                <ExamTake />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result/:examId"
            element={
              <ProtectedRoute>
                <ExamResult />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create-exam"
            element={
              <AdminRoute>
                <CreateExam />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-exams"
            element={
              <AdminRoute>
                <ManageExams />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-students"
            element={
              <AdminRoute>
                <ManageStudents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <Reports />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;