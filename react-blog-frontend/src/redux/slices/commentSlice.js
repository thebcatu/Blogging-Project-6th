import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

export const fetchCommentsByBlogId = createAsyncThunk(
  'comment/fetchCommentsByBlogId',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.get('comments/', { 
        params: { blog: blogId, root_only: true }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await api.post('comments/', commentData)
      toast.success('Comment added successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to add comment')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`comments/${commentId}/`, { content })
      toast.success('Comment updated successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to update comment')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`comments/${commentId}/`)
      toast.success('Comment deleted successfully!')
      return commentId
    } catch (error) {
      toast.error('Failed to delete comment')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createReaction = createAsyncThunk(
  'comment/createReaction',
  async ({ blogId, reactionType }, { rejectWithValue }) => {
    try {
      const response = await api.post('reactions/', {
        blog: blogId,
        reaction_type: reactionType
      })
      return response.data
    } catch (error) {
      toast.error('Failed to react to blog')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments by blog ID
      .addCase(fetchCommentsByBlogId.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCommentsByBlogId.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.results || action.payload
      })
      .addCase(fetchCommentsByBlogId.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false
        // Add new comment or reply
        if (!action.payload.parent) {
          // It's a top-level comment
          state.comments.unshift(action.payload)
        } else {
          // It's a reply - find parent and add to replies
          const parentComment = findCommentById(state.comments, action.payload.parent)
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = []
            }
            parentComment.replies.unshift(action.payload)
          }
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false
        // Find and update comment
        updateCommentInState(state.comments, action.payload)
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false
        // Remove from top-level comments
        state.comments = state.comments.filter(comment => comment.id !== action.payload)
        // Also check in replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply.id !== action.payload)
          }
        })
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

// Helper functions
const findCommentById = (comments, id) => {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment
    }
    if (comment.replies) {
      const found = findCommentById(comment.replies, id)
      if (found) return found
    }
  }
  return null
}

const updateCommentInState = (comments, updatedComment) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === updatedComment.id) {
      comments[i] = { ...comments[i], ...updatedComment }
      return true
    }
    if (comments[i].replies) {
      if (updateCommentInState(comments[i].replies, updatedComment)) {
        return true
      }
    }
  }
  return false
}

export const { clearComments, clearError } = commentSlice.actions

export default commentSlice.reducer
