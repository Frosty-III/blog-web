"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/supabaseClient"
import { setCurrentBlog, updateBlog } from "../store/slices/blogSlice"
import type { RootState } from "../store"
import "./BlogForm.css"

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentBlog } = useSelector((state: RootState) => state.blog)
  const { user } = useSelector((state: RootState) => state.auth)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      const { data, error: fetchError } = await supabase.from("blogs").select("*").eq("id", id).single()

      if (fetchError) {
        setError("Blog not found")
        return
      }

      dispatch(setCurrentBlog(data))
      setTitle(data.title)
      setContent(data.content)
    }

    fetchBlog()
  }, [id, dispatch])

  if (!currentBlog) return <p>Loading...</p>

  if (user?.id !== currentBlog.user_id) {
    return <p className="error-message">You don't have permission to edit this blog</p>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: updateError } = await supabase
        .from("blogs")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentBlog.id)
        .select()

      if (updateError) {
        setError(updateError.message)
        return
      }

      if (data && data.length > 0) {
        dispatch(updateBlog(data[0]))
        navigate(`/blog/${currentBlog.id}`)
      }
    } catch (err) {
      setError("Failed to update blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blog-form-container">
      <div className="blog-form">
        <h1>Edit Blog Post</h1>
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
              {loading ? "Updating..." : "Update Blog"}
            </button>
            <button type="button" onClick={() => navigate(`/blog/${currentBlog.id}`)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
