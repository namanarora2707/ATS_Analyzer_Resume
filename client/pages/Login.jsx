import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Loader2, Mail, Lock, FileText } from 'lucide-react';
import './login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Username:', username);
    console.log('Password:', password);

    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      console.log('Login result:', result);
      if (result.success) {
        navigate('/dashboard');
      } else {
        throw new Error(result.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="icon-container-xl gradient-primary-button rounded-2xl mb-4 mx-auto">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ResumeATS</h1>
          <p className="text-gray-600 mt-2">AI-Powered Resume Optimization</p>
        </div>

        <div className="card shadow-xl gradient-card-bg">
          <div className="card-header pb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-center text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="card-content space-y-4">
              {error && (
                <div className="alert alert-destructive">
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon w-4 h-4" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-with-icon"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon w-4 h-4" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-with-icon"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <div className="card-footer flex flex-col space-y-4 pt-6">
              <button
                type="submit"
                className="btn btn-lg btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
