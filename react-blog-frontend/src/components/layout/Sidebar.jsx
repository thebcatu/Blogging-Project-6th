import { Link } from 'react-router-dom';
import { FaTimes, FaHome, FaFolderOpen, FaTag, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchPopularTags } from '../../redux/slices/blogSlice';

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.category);
  const { popularTags } = useSelector(state => state.blog);
  const { role } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPopularTags());
  }, [dispatch]);

  return (
    <div className="h-full overflow-y-auto py-4">
      <div className="flex items-center justify-between px-4 mb-6">
        <h2 className="font-bold text-lg">Blog Menu</h2>
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FaTimes size={20} />
        </button>
      </div>
      
      <nav className="px-2">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              <FaHome className="mr-3 text-primary-600" />
              Home Feed
            </Link>
          </li>
          
          <li className="pt-4">
            <div className="px-4 mb-2 text-gray-500 uppercase tracking-wide text-xs font-semibold">
              <div className="flex items-center">
                <FaFolderOpen className="mr-2" /> Categories
              </div>
            </div>
            <ul className="space-y-1">
              {categories.length > 0 ? (
                categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/category/${category.id}`}
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={onClose}
                    >
                      {category.name}
                      <span className="ml-auto text-xs text-gray-500">
                        {category.blog_count}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-8 py-2 text-gray-500 italic">Loading categories...</li>
              )}
            </ul>
          </li>
          
          <li className="pt-4">
            <div className="px-4 mb-2 text-gray-500 uppercase tracking-wide text-xs font-semibold">
              <div className="flex items-center">
                <FaTag className="mr-2" /> Popular Tags
              </div>
            </div>
            <div className="px-4 flex flex-wrap gap-2">
              {popularTags.length > 0 ? (
                popularTags.slice(0, 10).map(tag => (
                  <Link 
                    key={tag.tag} 
                    to={`/tag/${tag.tag}`}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-md"
                    onClick={onClose}
                  >
                    {tag.tag} ({tag.count})
                  </Link>
                ))
              ) : (
                <span className="text-gray-500 italic">Loading tags...</span>
              )}
            </div>
          </li>
          
          {role === 'admin' && (
            <li className="pt-4">
              <div className="px-4 mb-2 text-gray-500 uppercase tracking-wide text-xs font-semibold">
                <div className="flex items-center">
                  <FaUsers className="mr-2" /> Admin
                </div>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/admin"
                    className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/users"
                    className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/categories"
                    className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
