import { lazy } from 'react';
import ProtectedRoute from '../components/ProtectedRoute'; // Fix: Import ProtectedRoute

// Lazy-loaded components for better performance
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const RequestPasswordReset = lazy(() => import('../pages/auth/RequestPasswordReset'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const BlogList = lazy(() => import('../pages/blog/BlogList.jsx')); // Updated extension
const BlogDetail = lazy(() => import('../pages/blog/BlogDetail'));
const CreateBlog = lazy(() => import('../pages/blog/CreateBlog'));
const EditBlog = lazy(() => import('../pages/blog/EditBlog'));
const Categories = lazy(() => import('../pages/categories/Categories'));
const CategoryBlogs = lazy(() => import('../pages/categories/CategoryBlogs'));
const UserProfile = lazy(() => import('../pages/profile/UserProfile'));
const EditProfile = lazy(() => import('../pages/profile/EditProfile'));
const Bookmarks = lazy(() => import('../pages/bookmarks/BookmarkList'));
const WriterDashboard = lazy(() => import('../pages/dashboard/WriterDashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Routes configuration
const routes = [
  // Public routes
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/register',
    component: Register,
    exact: true,
  },
  {
    path: '/verify-email/:uidb64/:token',
    component: VerifyEmail,
    exact: true,
  },
  {
    path: '/password-reset',
    component: RequestPasswordReset,
    exact: true,
  },
  {
    path: '/password-reset/:uidb64/:token',
    component: ResetPassword,
    exact: true,
  },
  {
    path: '/blogs',
    component: BlogList,
    exact: true,
  },
  {
    path: '/blogs/:slug',
    component: BlogDetail,
    exact: true,
  },
  {
    path: '/categories',
    component: Categories,
    exact: true,
  },
  {
    path: '/categories/:id',
    component: CategoryBlogs,
    exact: true,
  },
  
  // Protected routes (require authentication)
  {
    path: '/profile',
    component: UserProfile,
    exact: true,
    protected: true,
  },
  {
    path: '/profile/edit',
    component: EditProfile,
    exact: true,
    protected: true,
  },
  {
    path: '/bookmarks',
    component: Bookmarks,
    exact: true,
    protected: true,
  },
  
  // Writer routes
  {
    path: '/blogs/create',
    component: CreateBlog,
    exact: true,
    protected: true,
    roles: ['writer', 'admin'],
  },
  {
    path: '/blogs/edit/:id',
    component: EditBlog,
    exact: true,
    protected: true,
    roles: ['writer', 'admin'],
  },
  {
    path: '/dashboard/writer',
    component: WriterDashboard,
    exact: true,
    protected: true,
    roles: ['writer', 'admin'],
  },
  
  // Admin routes
  {
    path: '/dashboard/admin',
    component: AdminDashboard,
    exact: true,
    protected: true,
    roles: ['admin'],
  },
  
  // 404 route
  {
    path: '*',
    component: NotFound,
  },
];

export default routes;
