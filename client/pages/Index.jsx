import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { 
  FileText, 
  Zap, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  BarChart3,
  Calendar
} from 'lucide-react';
import './index.css';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="icon-container-2xl gradient-primary-button rounded-3xl mb-8 mx-auto">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ResumeATS
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-Powered Resume Optimization Platform
            </p>
            
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Upload your resume, provide a job description, and get instant ATS compatibility scores 
              with personalized suggestions to improve your chances of landing interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="btn btn-lg btn-primary px-8"
              >
                Get Started Free
              </button>
              <button
                onClick={handleSignIn}
                className="btn btn-lg btn-outline border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-8"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose ResumeATS?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform helps you optimize your resume for Applicant Tracking Systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #3b82f6, #2563eb)'}}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">Instant Analysis</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Get real-time ATS compatibility scores and detailed feedback on your resume
              </p>
            </div>
          </div>

          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #10b981, #059669)'}}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">Smart Matching</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Compare your skills against job requirements and identify missing keywords
              </p>
            </div>
          </div>

          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #8b5cf6, #7c3aed)'}}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">Improvement Tips</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Receive actionable suggestions to enhance your resume's effectiveness
              </p>
            </div>
          </div>

          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #f97316, #ea580c)'}}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">ATS Optimized</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Ensure your resume passes through Applicant Tracking Systems successfully
              </p>
            </div>
          </div>

          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #ec4899, #db2777)'}}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">Track Progress</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Monitor your improvement over time with detailed analytics and history
              </p>
            </div>
          </div>

          <div className="card shadow-lg gradient-card-bg text-center">
            <div className="card-header">
              <div className="icon-container-lg mx-auto mb-4" style={{background: 'linear-gradient(to right, #6366f1, #4f46e5)'}}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="card-title">Multiple Formats</h3>
            </div>
            <div className="card-content">
              <p className="card-description text-base">
                Support for PDF, DOC, and text formats with secure file processing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-primary-button py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl mb-8" style={{color: '#e0e7ff'}}>
            Join thousands of job seekers who have improved their ATS scores with ResumeATS
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-lg bg-white text-indigo-600 hover:bg-gray-100 px-8 font-semibold"
          >
            Start Free Analysis
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="logo justify-center mb-4">
            <div className="logo-icon">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="logo-text">ResumeATS</span>
          </div>
          <p className="text-gray-600">
            © 2024 ResumeATS. AI-Powered Resume Optimization Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
