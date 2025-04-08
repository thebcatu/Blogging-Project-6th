import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await api.get('bookmarks/');
      console.log('Bookmarks API response:', response.data);
      
      // Handle both paginated and non-paginated responses
      if (response.data.results && Array.isArray(response.data.results)) {
        setBookmarks(response.data.results);
      } else if (Array.isArray(response.data)) {
        setBookmarks(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setBookmarks([]);
        setError('Unexpected data format received from server');
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveBookmark = async (blogId) => {
    try {
      // The Django backend uses a toggle approach for bookmarks
      const response = await api.post('bookmarks/', { blog_id: blogId });
      
      if (response.status === 200) {
        // Item was removed - filter from local state
        setBookmarks(bookmarks.filter(bookmark => bookmark.blog !== blogId));
        toast.success('Bookmark removed');
      } else {
        // Refresh bookmarks to ensure we're in sync with the backend
        fetchBookmarks();
      }
    } catch (err) {
      toast.error('Failed to remove bookmark: ' + (err.response?.data?.message || err.message));
      console.error('Error removing bookmark:', err);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookmarks</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">You haven't bookmarked any blogs yet.</p>
          <Link 
            to="/blogs" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Blogs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4">
              {bookmark.blog_details?.image && (
                <div className="md:w-1/4">
                  <img 
                    src={bookmark.blog_details.image} 
                    alt={bookmark.blog_details.title}
                    className="w-full h-40 object-cover rounded-md" 
                  />
                </div>
              )}
              
              <div className="md:w-3/4">
                <h2 className="text-xl font-bold mb-2">
                  <Link to={`/blogs/${bookmark.blog_details?.slug || bookmark.blog}`} className="text-blue-600 hover:text-blue-800">
                    {bookmark.blog_details?.title || `Blog #${bookmark.blog}`}
                  </Link>
                </h2>
                
                {bookmark.blog_details?.author_details && (
                  <p className="text-sm text-gray-600 mb-2">
                    By: {bookmark.blog_details.author_details.first_name} {bookmark.blog_details.author_details.last_name}
                  </p>
                )}
                
                {bookmark.created_at && (
                  <p className="text-sm text-gray-500 mb-3">
                    Bookmarked on: {new Date(bookmark.created_at).toLocaleDateString()}
                  </p>
                )}
                
                {bookmark.notes && (
                  <div className="bg-yellow-50 p-3 rounded-md mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Your Notes:</h3>
                    <p className="text-gray-600">{bookmark.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.blog)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove Bookmark
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
