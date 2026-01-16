import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { createComment } from "../lib/commentService";

interface CommentFormProps {
  blogId: string;
  onCommentAdded: () => void; // callback to refresh comments
}

export default function CommentForm({ blogId, onCommentAdded }: CommentFormProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <p>You must be logged in to comment</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createComment({
        blogId,
        content,
        imageFile: imageFile || undefined,
      });
      setContent("");
      setImageFile(null);
      onCommentAdded(); // refresh comment list
    } catch (err: any) {
      console.error(err);
      setError("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "10px" }}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button type="submit" disabled={loading} style={{ padding: "10px 20px", borderRadius: "8px" }}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
