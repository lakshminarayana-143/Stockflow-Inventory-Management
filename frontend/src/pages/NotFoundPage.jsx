import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-black text-brand-600">404</h1>
        <h2 className="text-xl font-bold text-slate-900">Page not found</h2>
        <p className="text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" icon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
