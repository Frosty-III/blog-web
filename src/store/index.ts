import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import authReducer from "./slices/authSlice"
import blogReducer from "./slices/blogSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store
