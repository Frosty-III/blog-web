import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
  user: {
    id: string
    email: string
  } | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
