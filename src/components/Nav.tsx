import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store"
import { logout } from "../store/slices/authSlice"
import { supabase } from "../lib/supabaseClient"
import "./Nav.css"

export default function Nav() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="nav">
      <div className="nav-container">
        <h1 onClick={() => navigate("/")} className="nav-logo">
          Blog
        </h1>
        <ul className="nav-menu">
          <li>
            <a href="/" className="nav-link">
              Home
            </a>
          </li>
          {user ? (
            <>
              <li>
                <a href="/create" className="nav-link">
                  Create Blog
                </a>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link nav-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login" className="nav-link">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="nav-link">
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
