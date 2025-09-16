import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4">
      <div className="text-center">
        <div className="icon-container-2xl gradient-primary-button rounded-3xl mb-8 mx-auto">
          <FileText className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-lg btn-primary inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
