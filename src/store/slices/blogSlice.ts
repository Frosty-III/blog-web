import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Blog {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface BlogState {
  blogs: Blog[]
  currentBlog: Blog | null
  loading: boolean
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
}

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload
    },
    setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
      state.currentBlog = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload)
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex((blog) => blog.id === action.payload.id)
      if (index !== -1) {
        state.blogs[index] = action.payload
      }
      state.currentBlog = action.payload
    },
    removeBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, setCurrentBlog, setLoading, addBlog, updateBlog, removeBlog } = blogSlice.actions
export default blogSlice.reducer
