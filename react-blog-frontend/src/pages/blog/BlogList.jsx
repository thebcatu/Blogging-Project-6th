import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import BlogCard from '../../components/blog/BlogCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('q');
  
  const { role } = useSelector(state => state.auth);
  
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let url = 'blogs/?page=' + page;
        
        if (category) url += `&category=${category}`;
        if (tag) url += `&tag=${tag}`;
        if (search) url += `&q=${search}`;
        
        const response = await api.get(url);
        setBlogs(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [page, category, tag, search]);
  
  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage);
    setSearchParams(searchParams);
  };
  
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        {(role === 'writer' || role === 'admin') && (
          <Link 
            to="/blogs/create" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create New Post
          </Link>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        {/* Add search and filter components here */}
      </div>
      
      {/* Blog listing */}
      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.count > 0 && (
        <Pagination 
          currentPage={parseInt(page, 10)}
          totalPages={Math.ceil(pagination.count / 10)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BlogList;
