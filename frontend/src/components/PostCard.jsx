import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../api"; // axios instance

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

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

export default function PostCard({ post }) {
  const loggedIn = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(likes.includes(userId));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  // LIKE HANDLING
  const handleLike = async () => {
    if (!loggedIn) return alert("You must be logged in to like posts.");
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.likes.includes(userId));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // COMMENT HANDLING
  const handleComment = async () => {
    if (!loggedIn) return alert("Login to comment.");
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });

      setComments(res.data.comments);
      setCommentText("");
      setShowComments(true);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl duration-300">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        {/* TITLE */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {post.title}
        </h3>

        {/* BODY */}
        <p className="text-gray-600 mb-2 line-clamp-2">{post.body}</p>

        {/* COMMUNITY */}
        <p className="text-sm text-blue-500 font-medium mb-3">
          Community: {post.community}
        </p>

        {/* AUTHOR */}
        {post.author && (
          <p className="text-sm text-gray-500 mb-1">
            Posted by <span className="font-semibold">{post.author.name}</span>
          </p>
        )}

        {/* TIMESTAMP */}
        {post.createdAt && (
          <p className="text-xs text-gray-400 mb-3">{timeAgo(post.createdAt)}</p>
        )}

        {/* LIKE + COMMENT + VIEW DETAILS - HORIZONTAL */}
        <div className="flex items-center gap-2 mb-4">
          {/* LIKE BUTTON */}
          {loggedIn && (
            <button
              onClick={handleLike}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm shadow transition bg-blue-600 text-white hover:bg-blue-700"
            >
              <span
                className={`text-2xl transition-colors ${
                  liked ? "text-red-500" : "text-white"
                }`}
              >
                {liked ? "♥" : "♡"}
              </span>
              <span>{liked ? `Liked (${likes.length})` : `Like (${likes.length})`}</span>
            </button>
          )}

          {/* COMMENT BUTTON */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 px-3 py-2 rounded-lg text-sm shadow bg-blue-600 text-white hover:bg-blue-700 transition flex justify-center"
          >
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </button>

          {/* VIEW DETAILS */}
          <Link
            to={`/post/${post._id}`}
            className="flex-1 inline-flex justify-center px-3 py-2 rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>

        {/* COMMENTS SECTION */}
        {showComments && (
          <div className="bg-gray-50 p-3 rounded-lg mb-3">
            {/* EXISTING COMMENTS */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}

              {comments.map((c) => (
                <div
                  key={c._id}
                  className="flex items-start gap-2 border-b border-gray-100 pb-2"
                >
                  {/* Avatar placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">
                        {c.user?.name || "User"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD COMMENT INPUT */}
            {loggedIn && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={handleComment}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 shadow"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
