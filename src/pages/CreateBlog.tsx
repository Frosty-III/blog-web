"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/supabaseClient"
import { addBlog } from "../store/slices/blogSlice"
import type { RootState } from "../store"
import "./BlogForm.css"

export default function CreateBlog() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return <p className="error-message">Please login to create a blog</p>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: insertError } = await supabase
        .from("blogs")
        .insert([
          {
            title,
            content,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (data && data.length > 0) {
        dispatch(addBlog(data[0]))
        navigate("/")
      }
    } catch (err) {
      setError("Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blog-form-container">
      <div className="blog-form">
        <h1>Create Blog Post</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" placeholder="Enter blog title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Content:</label>
            <textarea placeholder="Enter blog content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Blog"}
            </button>
            <button type="button" onClick={() => navigate("/")} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
