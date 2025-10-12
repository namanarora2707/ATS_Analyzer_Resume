import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { 
  Upload, 
  FileText, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  LogOut,
  History,
  Target,
  Lightbulb,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { createAnalysisResponse, createHistoryResponse } from './apiClient.js';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [activeTab, setActiveTab] = useState('analyze');

  // Fetch history on component mount and when new analysis is completed
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const response = await fetch('/api/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setHistory(result.analyses);
      } else {
        setHistoryError('Failed to load history');
      }
    } catch (error) {
      console.error('History fetch error:', error);
      setHistoryError('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.type.includes('text')) {
        setError('Please upload a PDF or text file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  }, []);

  const analyzeResume = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result);
        // Reset form after successful analysis
        setSelectedFile(null);
        setJobDescription('');
        // Reset file input
        const fileInput = document.getElementById('resume');
        if (fileInput) {
          fileInput.value = '';
        }
        // Refresh history
        fetchHistory();
      } else {
        setError(result.message || 'Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent match';
    if (score >= 60) return 'Good match';
    if (score >= 40) return 'Fair match';
    return 'Needs improvement';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="logo-text">ResumeATS</h1>
          </div>
          <div className="user-menu">
            <span className="user-greeting">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="btn btn-sm btn-outline text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Tabs */}
        <div className="space-y-6">
          <div className="tabs-list">
            <button
              className={`tabs-trigger ${activeTab === 'analyze' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyze')}
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Analyze Resume</span>
            </button>
            <button
              className={`tabs-trigger ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History className="w-4 h-4 mr-2" />
              <span>History</span>
            </button>
          </div>

          {/* Analyze Tab Content */}
          {activeTab === 'analyze' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload Resume</span>
                    </h2>
                    <p className="card-description">
                      Upload your resume in PDF or text format (max 5MB)
                    </p>
                  </div>
                  <div className="card-content space-y-4">
                    <div className="form-group">
                      <label htmlFor="resume" className="form-label">Resume File</label>
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleFileChange}
                        className="input"
                        style={{cursor: 'pointer'}}
                      />
                      {selectedFile && (
                        <div className="flex items-center space-x-2 text-sm text-green-600 mt-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="jobDescription" className="form-label">Job Description</label>
                      <textarea
                        id="jobDescription"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="textarea"
                        style={{minHeight: '200px', resize: 'none'}}
                      />
                    </div>

                    {error && (
                      <div className="alert alert-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                      </div>
                    )}

                    <button
                      onClick={analyzeResume}
                      disabled={loading || !selectedFile || !jobDescription.trim()}
                      className="btn btn-lg btn-primary w-full"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Zap className="mr-2 h-4 w-4" />
                          Analyze Resume
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Analysis Results</span>
                    </h2>
                    <p className="card-description">
                      ATS compatibility score and recommendations
                    </p>
                  </div>
                  <div className="card-content">
                    {!analysis ? (
                      <div className="empty-state">
                        <Target className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-center">
                          Upload your resume and job description to get started
                        </p>
                      </div>
                    ) : analysis.success && analysis.analysis ? (
                      <div className="space-y-6">
                        {/* Score */}
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getScoreColor(analysis.analysis.atsScore)}`}>
                            {analysis.analysis.atsScore}%
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {getScoreDescription(analysis.analysis.atsScore)}
                          </p>
                          <div className="progress mt-3">
                            <div 
                              className="progress-indicator"
                              style={{width: `${analysis.analysis.atsScore}%`}}
                            />
                          </div>
                        </div>

                        {/* Matched Skills */}
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Matched Skills
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {analysis.analysis.matchedSkills.map((skill, index) => (
                              <span key={index} className="badge badge-green">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {analysis.analysis.missingSkills.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Missing Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {analysis.analysis.missingSkills.map((skill, index) => (
                                <span key={index} className="badge badge-red">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        <div>
                          <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Improvement Suggestions
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {analysis.analysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-indigo-600 mt-0.5">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {analysis.message || 'Analysis failed. Please try again.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab Content */}
          {activeTab === 'history' && (
            <div className="card">
              <div className="card-header flex justify-between items-start">
                <div>
                  <h2 className="card-title">Analysis History</h2>
                  <p className="card-description">
                    View your previous resume analyses and scores
                  </p>
                </div>
                <button
                  onClick={fetchHistory}
                  disabled={historyLoading}
                  className="btn btn-sm btn-outline"
                >
                  {historyLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="card-content">
                {historyError && (
                  <div className="alert alert-destructive flex items-center mb-6">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {historyError}
                  </div>
                )}

                {historyLoading ? (
                  <div className="loading-state">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p>Loading history...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="empty-state">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No analyses yet</p>
                    <p className="text-sm mt-2">Your analysis history will appear here after you upload and analyze resumes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="card border border-gray-200">
                        <div className="card-content">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="icon-container-md gradient-primary-button rounded-lg">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{item.fileName}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(item.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(item.atsScore)}`}>
                                {item.atsScore}%
                              </div>
                              <p className="text-sm text-gray-600">
                                {getScoreDescription(item.atsScore)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-green-700 mb-2 flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Matched Skills ({item.matchedSkills.length})
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {item.matchedSkills.slice(0, 5).map((skill, index) => (
                                  <span key={index} className="badge badge-green text-xs">
                                    {skill}
                                  </span>
                                ))}
                                {item.matchedSkills.length > 5 && (
                                  <span className="badge badge-secondary text-xs">
                                    +{item.matchedSkills.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.missingSkills.length > 0 && (
                              <div>
                                <h4 className="font-medium text-red-700 mb-2 flex items-center text-sm">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  Missing Skills ({item.missingSkills.length})
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {item.missingSkills.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="badge badge-red text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                  {item.missingSkills.length > 3 && (
                                    <span className="badge badge-secondary text-xs">
                                      +{item.missingSkills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-indigo-700 mb-2 flex items-center text-sm">
                              <Lightbulb className="w-4 h-4 mr-1" />
                              Key Suggestions
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {item.suggestions.slice(0, 3).map((suggestion, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-indigo-600 mt-0.5 text-xs">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                              {item.suggestions.length > 3 && (
                                <li className="text-xs text-gray-500" style={{fontStyle: 'italic'}}>
                                  +{item.suggestions.length - 3} more suggestions available
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
