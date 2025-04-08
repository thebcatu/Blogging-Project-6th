import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get('categories/');
        setCategories(response.data.results || response.data);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500 text-lg">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="block bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-500">{category.blog_count} blogs</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
