import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('categories/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('name', categoryData.name)
      if (categoryData.image && categoryData.image instanceof File) {
        formData.append('image', categoryData.image)
      }
      
      const response = await api.post('categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Category created successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to create category')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('name', categoryData.name)
      if (categoryData.image && categoryData.image instanceof File) {
        formData.append('image', categoryData.image)
      }
      
      const response = await api.patch(`categories/${categoryId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Category updated successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to update category')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`categories/${categoryId}/`)
      toast.success('Category deleted successfully!')
      return categoryId
    } catch (error) {
      toast.error('Failed to delete category')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload.results || action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.categories.findIndex(category => category.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = state.categories.filter(
          category => category.id !== action.payload
        )
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = categorySlice.actions

export default categorySlice.reducer
