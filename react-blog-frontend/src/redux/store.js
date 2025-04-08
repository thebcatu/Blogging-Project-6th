import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import blogReducer from './slices/blogSlice'
import categoryReducer from './slices/categorySlice'
import commentReducer from './slices/commentSlice'
import bookmarkReducer from './slices/bookmarkSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    category: categoryReducer,
    comment: commentReducer,
    bookmark: bookmarkReducer,
    user: userReducer,
  },
})

export default store
