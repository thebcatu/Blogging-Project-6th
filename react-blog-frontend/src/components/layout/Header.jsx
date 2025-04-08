import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center">
            <button 
              className="mr-4 lg:hidden" 
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <FaBars size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold">Nepal Blog</Link>
          </div>

          {/* Middle - Search bar */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search blogs..."
                className="px-4 py-2 rounded-l w-full text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary-500 px-4 rounded-r hover:bg-primary-600"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 py-2">
                  <span className="hidden md:inline">{user?.username || 'User'}</span>
                  <FaUser />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/bookmarks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bookmarks</Link>
                    
                    {(role === 'writer' || role === 'admin') && (
                      <>
                        <Link to="/my-blogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Blogs</Link>
                        <Link to="/blogs/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Create Blog</Link>
                        <Link to="/dashboard/writer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Writer Dashboard</Link>
                      </>
                    )}
                    
                    {role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" /> Logout
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="py-2 px-4 rounded hover:bg-primary-600">Login</Link>
                <Link to="/register" className="py-2 px-4 bg-white text-primary-700 rounded hover:bg-gray-100">Register</Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile search bar */}
        <div className="pb-4 md:hidden">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search blogs..."
              className="px-4 py-2 rounded-l w-full text-gray-800 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary-500 px-4 rounded-r hover:bg-primary-600"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
