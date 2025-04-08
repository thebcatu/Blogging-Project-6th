import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const MainNavigation = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-xl font-bold">
              NepalBlog
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
              }
            >
              Categories
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/bookmarks"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
                  }
                >
                  Bookmarks
                </NavLink>
                
                {(role === 'writer' || role === 'admin') && (
                  <NavLink
                    to="/dashboard/writer"
                    className={({ isActive }) =>
                      isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
                    }
                  >
                    Writer Dashboard
                  </NavLink>
                )}
                
                {role === 'admin' && (
                  <NavLink
                    to="/dashboard/admin"
                    className={({ isActive }) =>
                      isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
                    }
                  >
                    Admin Dashboard
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex md:items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center text-blue-200 hover:text-white focus:outline-none"
                >
                  <span className="mr-2">{user?.username}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-blue-200 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                  : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
              }
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                  : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
              }
              onClick={toggleMenu}
            >
              Blogs
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                  : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
              }
              onClick={toggleMenu}
            >
              Categories
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/bookmarks"
                  className={({ isActive }) =>
                    isActive
                      ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                      : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                  }
                  onClick={toggleMenu}
                >
                  Bookmarks
                </NavLink>
                
                {(role === 'writer' || role === 'admin') && (
                  <NavLink
                    to="/dashboard/writer"
                    className={({ isActive }) =>
                      isActive
                        ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                        : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                    }
                    onClick={toggleMenu}
                  >
                    Writer Dashboard
                  </NavLink>
                )}
                
                {role === 'admin' && (
                  <NavLink
                    to="/dashboard/admin"
                    className={({ isActive }) =>
                      isActive
                        ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                        : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                    }
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                      : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                  }
                  onClick={toggleMenu}
                >
                  Profile
                </NavLink>
                
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                      : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                  }
                  onClick={toggleMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? 'block px-3 py-2 rounded-md text-white font-medium bg-blue-800'
                      : 'block px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600'
                  }
                  onClick={toggleMenu}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
