import { Provider } from "react-redux"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import store from "./store"
import { setUser, logout } from "./store/slices/authSlice"
import { supabase } from "./lib/supabaseClient"
import Nav from "./components/Nav"
import Register from "./pages/Register"
import Login from "./pages/Login"
import BlogList from "./pages/BlogList"
import CreateBlog from "./pages/CreateBlog"
import ViewBlog from "./pages/ViewBlog"
import EditBlog from "./pages/EditBlog"

function AppContent() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        dispatch(setUser({ email: session.user.email || "", id: session.user.id }))
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        dispatch(setUser({ email: session.user.email || "", id: session.user.id }))
      } else {
        dispatch(logout())
      }
    })

    return () => subscription?.unsubscribe()
  }, [dispatch])

  return (
    <Router>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<ViewBlog />} />
          <Route path="/blog/:id/edit" element={<EditBlog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
