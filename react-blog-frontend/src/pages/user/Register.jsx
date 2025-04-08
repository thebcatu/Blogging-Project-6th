import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  role: Yup.string().oneOf(['visitor', 'writer']).required('Role is required'),
});

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      {registrationSuccess ? (
        <div className="bg-green-50 border border-green-400 text-green-700 p-6 rounded text-center">
          <h3 className="font-bold text-xl mb-2">Registration Successful!</h3>
          <p className="mb-4">A verification email has been sent to your email address. Please check your inbox and click the verification link to activate your account.</p>
          <Link to="/login" className="inline-block bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700">
            Go to Login
          </Link>
        </div>
      ) : (
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            role: 'visitor',
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const result = await dispatch(registerUser(values));
            if (!result.error) {
              resetForm();
              setRegistrationSuccess(true);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-md rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first_name" className="block text-gray-700 font-medium mb-2">
                    First Name*
                  </label>
                  <Field
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="middle_name" className="block text-gray-700 font-medium mb-2">
                    Middle Name
                  </label>
                  <Field
                    type="text"
                    name="middle_name"
                    id="middle_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-gray-700 font-medium mb-2">
                  Last Name*
                </label>
                <Field
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                  Username*
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email*
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password*
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirm_password" className="block text-gray-700 font-medium mb-2">
                  Confirm Password*
                </label>
                <Field
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                  Register as*
                </label>
                <Field
                  as="select"
                  name="role"
                  id="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="visitor">Reader/Visitor</option>
                  <option value="writer">Content Writer</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error.message || 'Registration failed. Please try again.'}
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
                    Registering...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
              
              <div className="mt-4 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Register;
