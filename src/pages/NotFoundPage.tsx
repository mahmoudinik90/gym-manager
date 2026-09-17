import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">۴۰۴</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">صفحه یافت نشد</h2>
        <p className="text-gray-500 mb-8">صفحه مورد نظر شما وجود ندارد یا حذف شده است.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
