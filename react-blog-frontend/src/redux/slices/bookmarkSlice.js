import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

export const fetchBookmarks = createAsyncThunk(
  'bookmark/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('bookmarks/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const toggleBookmark = createAsyncThunk(
  'bookmark/toggleBookmark',
  async ({ blogId, notes = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post('bookmarks/', { blog_id: blogId, notes })
      
      if (response.status === 200) {
        // Bookmark was removed
        toast.info('Bookmark removed')
        return { removed: true, blogId }
      } else {
        // Bookmark was added
        toast.success('Bookmark added')
        return { removed: false, bookmark: response.data }
      }
    } catch (error) {
      toast.error('Failed to toggle bookmark')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateBookmarkNotes = createAsyncThunk(
  'bookmark/updateBookmarkNotes',
  async ({ bookmarkId, notes }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`bookmarks/${bookmarkId}/`, { notes })
      toast.success('Bookmark notes updated')
      return response.data
    } catch (error) {
      toast.error('Failed to update bookmark notes')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  bookmarks: [],
  isLoading: false,
  error: null,
}

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookmarks = action.payload.results || action.payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Toggle bookmark
      .addCase(toggleBookmark.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.removed) {
          // Remove bookmark
          state.bookmarks = state.bookmarks.filter(
            bookmark => bookmark.blog !== action.payload.blogId
          )
        } else {
          // Add bookmark
          state.bookmarks.unshift(action.payload.bookmark)
        }
      })
      .addCase(toggleBookmark.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update bookmark notes
      .addCase(updateBookmarkNotes.fulfilled, (state, action) => {
        const index = state.bookmarks.findIndex(
          bookmark => bookmark.id === action.payload.id
        )
        if (index !== -1) {
          state.bookmarks[index] = action.payload
        }
      })
  }
})

export const { clearError } = bookmarkSlice.actions

export default bookmarkSlice.reducer
