import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WriterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await api.get('dashboard/writer/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Writer Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Blogs</h2>
          <p className="text-3xl font-bold text-blue-600">{stats?.total_blogs || 0}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Views</h2>
          <p className="text-3xl font-bold text-green-600">{stats?.total_views || 0}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Reactions</h2>
          <p className="text-3xl font-bold text-purple-600">{stats?.total_reactions || 0}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Comments</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats?.total_comments || 0}</p>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/blogs/create" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create New Post
          </Link>
          <Link 
            to="/blogs?author=me" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View My Posts
          </Link>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        
        {stats?.recent_activity?.length === 0 ? (
          <p className="text-gray-500">No recent activity to display.</p>
        ) : (
          <div className="space-y-4">
            {stats?.recent_activity?.map((activity, index) => (
              <div key={index} className="border-b pb-3">
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">{activity.user}</span>
                  {activity.action_type === 'comment' && ' commented on your blog post'}
                  {activity.action_type === 'reaction' && ` reacted with "${activity.details?.reaction_type}" to your blog post`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterDashboard;
