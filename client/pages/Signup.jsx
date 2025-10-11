import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Loader2, Mail, Lock, User, FileText } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);

    const result = await signup(name, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
    
    setLoading(false);
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
              Create your account
            </h2>
            <p className="text-center text-gray-600">
              Get started with AI-powered resume optimization
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
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-icon-wrapper">
                  <User className="input-icon w-4 h-4" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-with-icon"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-with-icon"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon w-4 h-4" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
