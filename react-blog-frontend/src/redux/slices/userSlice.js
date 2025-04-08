import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `users/${userId}/` : 'users/me/';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add fields to form data
      Object.keys(userData).forEach(key => {
        if (key === 'profile_picture' && userData[key] instanceof File) {
          formData.append(key, userData[key]);
        } else if (key !== 'profile_picture') {
          formData.append(key, userData[key]);
        }
      });
      
      const response = await api.patch('users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update profile');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('users/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWriters = createAsyncThunk(
  'user/fetchWriters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('users/writers/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`users/${userId}/`, { role });
      toast.success('User role updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update user role');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentProfile: null,
  users: [],
  writers: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.results || action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch writers
      .addCase(fetchWriters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWriters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.writers = action.payload.results || action.payload;
      })
      .addCase(fetchWriters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        // Update in users list
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        
        // Update writers list if needed
        if (action.payload.is_writer) {
          const writerIndex = state.writers.findIndex(writer => writer.id === action.payload.id);
          if (writerIndex === -1) {
            state.writers.push(action.payload);
          } else {
            state.writers[writerIndex] = action.payload;
          }
        } else {
          state.writers = state.writers.filter(writer => writer.id !== action.payload.id);
        }
      });
  }
});

export const { clearProfile, clearError } = userSlice.actions;

export default userSlice.reducer;
