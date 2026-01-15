"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/supabaseClient"
import { setBlogs, setLoading } from "../store/slices/blogSlice"
import type { RootState } from "../store"
import "./BlogList.css"

const ITEMS_PER_PAGE = 5

export default function BlogList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blogs, loading } = useSelector((state: RootState) => state.blog)
  const { user } = useSelector((state: RootState) => state.auth)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchBlogs = async () => {
      dispatch(setLoading(true))

     
      const { count } = await supabase.from("blogs").select("*", { count: "exact", head: true })

      setTotalCount(count || 0)

    
      const offset = (currentPage - 1) * ITEMS_PER_PAGE

     
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1)

      if (!error && data) {
        dispatch(setBlogs(data))
      }

      dispatch(setLoading(false))
    }

    fetchBlogs()
  }, [currentPage, dispatch])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="blog-list-container">
      <div className="list-header">
        <h1>Blog Posts</h1>
        {user && (
          <button onClick={() => navigate("/create")} className="create-btn">
            Create New Post
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <>
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card" onClick={() => navigate(`/blog/${blog.id}`)}>
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 100)}...</p>
                <span className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
