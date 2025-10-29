import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // DEBUG: log auth state to help find why spinner never clears
  useEffect(() => {
    console.log('Login debug: auth state', { isAuthenticated, isLoading, user, authError });
  }, [isAuthenticated, isLoading, user, authError]);
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Display error from auth context or local error
  const displayError = authError || localError;

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    console.log('Login: submit', { email, passwordPresent: !!password });

    try {
      const success = await login(email.trim(), password);
      console.log('Login: login() returned', success);

      if (!success) {
        setLocalError('Invalid email or password. Please try again.');
      } else {
        console.log('Login: success, navigating to', from);
        // Navigation will happen via useEffect when isAuthenticated changes
      }
    } catch (err: any) {
      console.error('Login: exception', err);
      setLocalError(err?.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always render the form so we can surface errors even when the auth provider
  // reports `isLoading`. We still show a global spinner overlay when loading.
  // This helps debugging stuck-login scenarios where the page previously hid
  // the form behind a spinner with no visible error.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              EAPCET Online Test
            </h1>
            <p className="text-gray-600">Sign in to access your examination portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{displayError}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="student@example.com"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Student:</strong> student@example.com / password123</p>
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-500">
          © 2025 Rompit Technologies — Online Examination Platform
        </p>
      </div>
    </div>
  );
};

export default Login;