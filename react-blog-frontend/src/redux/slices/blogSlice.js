import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.get(`blogs/${blogId}/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchTrendingBlogs = createAsyncThunk(
  'blog/fetchTrendingBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/trending/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchRecommendedBlogs = createAsyncThunk(
  'blog/fetchRecommendedBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/recommended/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchBlogsByCategory = createAsyncThunk(
  'blog/fetchBlogsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/', { params: { category: categoryId } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchBlogsByTag = createAsyncThunk(
  'blog/fetchBlogsByTag',
  async (tag, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/', { params: { tag } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchMyBlogs = createAsyncThunk(
  'blog/fetchMyBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/my_blogs/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      // Handle form data for file uploads
      const formData = new FormData()
      
      Object.keys(blogData).forEach(key => {
        if (key === 'image' || key === 'file') {
          if (blogData[key] && blogData[key] instanceof File) {
            formData.append(key, blogData[key])
          }
        } else {
          formData.append(key, blogData[key])
        }
      })
      
      const response = await api.post('blogs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Blog created successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to create blog')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      // Handle form data for file uploads
      const formData = new FormData()
      
      Object.keys(blogData).forEach(key => {
        if (key === 'image' || key === 'file') {
          if (blogData[key] && blogData[key] instanceof File) {
            formData.append(key, blogData[key])
          }
        } else {
          formData.append(key, blogData[key])
        }
      })
      
      const response = await api.patch(`blogs/${blogId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Blog updated successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to update blog')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      await api.delete(`blogs/${blogId}/`)
      toast.success('Blog deleted successfully!')
      return blogId
    } catch (error) {
      toast.error('Failed to delete blog')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const rateBlog = createAsyncThunk(
  'blog/rateBlog',
  async ({ blogId, score }, { rejectWithValue }) => {
    try {
      const response = await api.post(`blogs/${blogId}/rate/`, { score })
      toast.success('Blog rated successfully!')
      return { blogId, rating: response.data.rating }
    } catch (error) {
      toast.error('Failed to rate blog')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchPopularTags = createAsyncThunk(
  'blog/fetchPopularTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('blogs/tags/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  blogs: [],
  currentBlog: null,
  trendingBlogs: [],
  recommendedBlogs: [],
  myBlogs: [],
  popularTags: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  isLoading: false,
  error: null,
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.blogs = action.payload.results
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBlog = action.payload
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch trending blogs
      .addCase(fetchTrendingBlogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.trendingBlogs = action.payload.results || action.payload
      })
      .addCase(fetchTrendingBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch recommended blogs
      .addCase(fetchRecommendedBlogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecommendedBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendedBlogs = action.payload.results || action.payload
      })
      .addCase(fetchRecommendedBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch my blogs
      .addCase(fetchMyBlogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.myBlogs = action.payload.results || action.payload
      })
      .addCase(fetchMyBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false
        state.blogs.unshift(action.payload)
        state.myBlogs.unshift(action.payload)
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false
        
        // Update in blogs list
        const index = state.blogs.findIndex(blog => blog.id === action.payload.id)
        if (index !== -1) {
          state.blogs[index] = action.payload
        }
        
        // Update in myBlogs list
        const myIndex = state.myBlogs.findIndex(blog => blog.id === action.payload.id)
        if (myIndex !== -1) {
          state.myBlogs[myIndex] = action.payload
        }
        
        // Update current blog if it's the same
        if (state.currentBlog && state.currentBlog.id === action.payload.id) {
          state.currentBlog = action.payload
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload)
        state.myBlogs = state.myBlogs.filter(blog => blog.id !== action.payload)
        if (state.currentBlog && state.currentBlog.id === action.payload) {
          state.currentBlog = null
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Rate blog
      .addCase(rateBlog.fulfilled, (state, action) => {
        if (state.currentBlog && state.currentBlog.id === action.payload.blogId) {
          state.currentBlog = {
            ...state.currentBlog,
            user_rating: action.payload.rating,
          }
        }
      })
      
      // Popular tags
      .addCase(fetchPopularTags.fulfilled, (state, action) => {
        state.popularTags = action.payload
      })
  }
})

export const { clearCurrentBlog, clearError } = blogSlice.actions

export default blogSlice.reducer
