import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, val] of Object.entries(intervals)) {
    const count = Math.floor(seconds / val);
    if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");

  const userId = localStorage.getItem("userId");
  const loggedIn = Boolean(userId);

  // Fetch post
  useEffect(() => {
    API.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  // Add comment
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/posts/${id}/comment`, {
        text: commentText,
      });

      setPost({ ...post, comments: res.data.comments });
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await API.delete(`/posts/${id}/comment/${commentId}`);
      setPost({ ...post, comments: res.data.comments });
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  // Emoji reaction
  const handleReact = async (commentId, emoji) => {
    try {
      const res = await API.put(`/posts/${id}/comment/${commentId}/react`, {
        emoji,
      });
      setPost({ ...post, comments: res.data.comments });
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      )}

      {/* Post Content */}
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="mb-4 text-gray-700">{post.body}</p>

      <p className="text-blue-600 font-medium mb-4">
        Community: {post.community}
      </p>

      <p className="text-gray-600 text-sm">
        Author: <span className="font-semibold">{post?.author?.name}</span>
      </p>

      {post.createdAt && (
        <p className="text-gray-500 text-sm mb-4">
          Posted {timeAgo(post.createdAt)}
        </p>
      )}

      {/* Toggle Comments */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="mt-6 mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-full text-center"
      >
        {showComments
          ? "Hide Comments"
          : `Show Comments (${post.comments?.length || 0})`}
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">
            Comments ({post.comments?.length || 0})
          </h3>

          {/* Comment List */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => (
                <div
                  key={c._id}
                  className="p-3 bg-white rounded-lg shadow flex flex-col gap-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      {c.user?.name || "User"}
                    </p>
                    <span className="text-gray-400 text-xs">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm">{c.text}</p>

                  {/* Emoji Reactions */}
                  <div className="flex items-center gap-2 mt-1">
                    {["👍", "❤️", "😂", "😢"].map((emoji) => {
                      const users = c.reactions?.[emoji] || [];
                      const reacted = users.includes(userId);

                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(c._id, emoji)}
                          className={`text-lg px-2 py-1 rounded ${
                            reacted ? "bg-blue-200" : "bg-gray-100"
                          } hover:bg-blue-300 transition`}
                        >
                          {emoji}{" "}
                          {users.length > 0 && (
                            <span className="text-xs">{users.length}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Delete Comment */}
                  {String(c.user?._id) === String(userId) && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-red-500 text-xs mt-2 underline hover:text-red-700"
                    >
                      Delete Comment
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            )}
          </div>

          {/* Add Comment */}
          {loggedIn && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm shadow-sm"
              />
              <button
                onClick={handleComment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow"
              >
                Post
              </button>
            </div>
          )}

          {!loggedIn && (
            <p className="text-xs text-gray-500 mt-3">
              Login to post comments.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
