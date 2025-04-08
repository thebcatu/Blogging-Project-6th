import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode'; // Fix: Import jwtDecode
import api from '../../services/api';
import { toast } from 'react-toastify';

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
  } catch (error) {
    return error.message === 'Invalid token specified'
  }
}

// Get token from local storage
const getLocalToken = () => {
  const access = localStorage.getItem('accessToken')
  const refresh = localStorage.getItem('refreshToken')
  return { access, refresh }
}

// Initialize auth state based on stored tokens
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    const { access, refresh } = getLocalToken();
    
    if (!access || !refresh) {
      return null;
    }
    
    // Check if access token is expired
    if (isTokenExpired(access)) {
      // If expired, try to refresh
      if (!isTokenExpired(refresh)) {
        return dispatch(refreshToken());
      } else {
        // Both tokens expired, logout
        return dispatch(logout());
      }
    } else {
      // If token is valid, decode and return user data
      try {
        const decoded = jwtDecode(access);
        const response = await api.get(`users/${decoded.user_id}/`);
        return {
          access,
          user: response.data,
          role: getRoleFromUser(response.data),
        };
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        return null;
      }
    }
  }
)

// Helper function to determine user role consistently
function getRoleFromUser(userData) {
  if (userData.is_admin_user) return 'admin'
  if (userData.is_writer) return 'writer'
  return 'visitor'
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/login-after-verification/', credentials)
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      return response.data
    } catch (error) {
      if (error.response?.data?.requires_verification) {
        toast.error('Account not verified. Please check your email.')
      } else {
        toast.error(error.response?.data?.error || 'Login failed')
      }
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/register/', userData)
      toast.success('Registration successful! Please check your email to verify your account.')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ uidb64, token }, { rejectWithValue }) => {
    try {
      const response = await api.get(`auth/verify-email/${uidb64}/${token}/`)
      toast.success('Email verified successfully! You can now login.')
      return response.data
    } catch (error) {
      toast.error('Email verification failed. The link may be invalid or expired.')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/resend-verification/', { email })
      toast.success('Verification email has been resent. Please check your inbox.')
      return response.data
    } catch (error) {
      toast.error('Failed to resend verification email')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/password-reset/', { email })
      toast.success('Password reset instructions sent to your email')
      return response.data
    } catch (error) {
      toast.error('Failed to request password reset')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ uidb64, token, password, confirm_password }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/password-reset/confirm/', {
        uidb64,
        token,
        password,
        confirm_password
      })
      toast.success('Password reset successful! You can now login with your new password.')
      return response.data
    } catch (error) {
      toast.error('Password reset failed. The link may be invalid or expired.')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const { refresh } = getLocalToken();
      if (!refresh) return rejectWithValue('No refresh token found');

      const response = await api.post('auth/token/refresh/', { refresh });
      localStorage.setItem('accessToken', response.data.access);
      return response.data;
    } catch (error) {
      // If refresh fails, clear all tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.role = action.payload.role
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.role = null
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        try {
          state.user = {
            id: action.payload.user_id,
            username: action.payload.username,
          };

          // Fetch user details
          api.get(`users/${action.payload.user_id}/`).then((response) => {
            state.user = response.data;
            state.role = getRoleFromUser(response.data);
          }).catch((err) => {
            console.error('Failed to fetch user details:', err);
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Token refresh
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true

        try {
          state.user = {
            id: jwtDecode(action.payload.access).user_id,
            username: jwtDecode(action.payload.access).username,
          };

          // Fetch user details
          api.get(`users/${state.user.id}/`).then((response) => {
            state.user = response.data;
            state.role = getRoleFromUser(response.data);
          }).catch((err) => {
            console.error('Failed to fetch user details:', err);
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
          state.isAuthenticated = false;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.role = null
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.role = null
      })
  }
})

export const { clearError } = authSlice.actions

export default authSlice.reducer
