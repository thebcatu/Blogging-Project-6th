import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resendVerification } from '../../redux/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [resendEmail, setResendEmail] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  
  // Get the redirect path from location state
  const from = location.state?.from || '/';
  
  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (resendEmail) {
      await dispatch(resendVerification(resendEmail));
      setResendSent(true);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Log In to Your Account</h1>
      
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await dispatch(loginUser(values));
          if (!result.error) {
            navigate(from, { replace: true });
          } else if (result.payload?.requires_verification) {
            setShowResend(true);
            setResendEmail(values.username);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your username"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Field
                type="password"
                name="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            
            {error && !showResend && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error.error || 'Invalid credentials. Please try again.'}
              </div>
            )}
            
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isLoading || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
            
            <div className="mt-4 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
            </div>
          </Form>
        )}
      </Formik>
      
      {showResend && (
        <div className="mt-6 bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded">
          <h3 className="font-bold mb-2">Account Not Verified</h3>
          <p className="mb-3">Your account has not been verified yet. Please check your email for the verification link or request a new one.</p>
          
          {!resendSent ? (
            <form onSubmit={handleResendVerification} className="mt-3">
              <div className="flex">
                <input 
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Confirm your email address"
                  className="flex-1 px-3 py-2 border border-yellow-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button 
                  type="submit"
                  className="bg-yellow-500 text-white py-2 px-4 rounded-r-md hover:bg-yellow-600 focus:outline-none"
                >
                  Resend
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-3 text-green-600 font-medium">
              Verification email has been resent. Please check your inbox.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
