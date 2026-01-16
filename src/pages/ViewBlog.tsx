"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/supabaseClient"
import { setCurrentBlog } from "../store/slices/blogSlice"
import type { RootState } from "../store"
import "./BlogView.css"

export default function ViewBlog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentBlog, loading } = useSelector((state: RootState) => state.blog)
  const { user } = useSelector((state: RootState) => state.auth)  

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching blog:", error)
        return
      }

      dispatch(setCurrentBlog(data))
    }

    fetchBlog()
  }, [id, dispatch])

  if (loading) return <p>Loading...</p>
  if (!currentBlog) return <p>Blog not found</p>

  const isOwner = user?.id === currentBlog.user_id

  return (
    <div className="blog-view-container">
      <article className="blog-article">
        <h1>{currentBlog.title}</h1>
        <div className="blog-meta">
          <span>{new Date(currentBlog.created_at).toLocaleDateString()}</span>
        </div>
        {currentBlog.image_url && (
          <img
            src={currentBlog.image_url}
            alt={currentBlog.title}
            className="blog-image"
          />
        )}
        <div className="blog-content">{currentBlog.content}</div>

        {isOwner && (
          <div className="blog-actions">
            <button onClick={() => navigate(`/blog/${currentBlog.id}/edit`)} className="edit-btn">
              Edit
            </button>
            <button
              onClick={async () => {
                await supabase.from("blogs").delete().eq("id", currentBlog.id)
                navigate("/")
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        )}
      </article>
    </div>
  )
}
