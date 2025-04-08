import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-6">Access Forbidden</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        You don't have permission to access this page. Please contact the administrator if you believe this is an error.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Forbidden;
