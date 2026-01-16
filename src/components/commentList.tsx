import { useState, useEffect } from "react";
import { getComments } from "../lib/commentService";

interface Comment {
  id: string;
  user_id: string;
  comment_text: string;
  image_url: string | null;
  created_at: string;
}

interface CommentListProps {
  blogId: string;
  refreshTrigger: number;
}

export default function CommentList({ blogId, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments(blogId);
        setComments(data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId, refreshTrigger]);

  if (loading) return <p>Loading comments...</p>;
  if (comments.length === 0) return <p>No comments yet</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
          <p><strong>{comment.user_id}</strong></p>
          <p>{comment.comment_text}</p>
          {comment.image_url && <img src={comment.image_url} alt="comment" style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "10px" }} />}
          <small style={{ color: "#666" }}>{new Date(comment.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}