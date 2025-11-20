const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const router = express.Router();

// Create post
router.post("/", auth, async (req, res) => {
  try {
    const { title, body, community, image } = req.body;
    const post = new Post({
      title,
      body,
      community,
      image,
      author: req.user._id,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all posts (optionally filter by community)
router.get("/", async (req, res) => {
  try {
    const { community } = req.query;
    const query = community ? { community } : {};
    const posts = await Post.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar")
      .populate("comments.author", "name avatar"); 

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update post
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, body, community, image } = req.body;

    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow update only if user owns the post
    if (String(post.author) !== String(req.user._id)) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this post" });
    }

    // Update fields
    post.title = title || post.title;
    post.body = body || post.body;
    post.community = community || post.community;
    post.image = image || post.image;

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Like / Unlike a post
router.put("/:id/like", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;

    let post = await Post.findById(req.params.id).populate(
      "comments.author",
      "name"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      author: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate new comment with author name
    await post.populate("comments.author", "name");

    res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete comment
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only owner can delete
    if (String(comment.author) !== String(req.user._id)) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// React to comment (emoji toggle)
router.put("/:id/comment/:commentId/react", auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (!comment.reactions.has(emoji)) {
      comment.reactions.set(emoji, []);
    }

    const arr = comment.reactions.get(emoji);

    // Toggle
    const index = arr.indexOf(req.user._id.toString());
    if (index >= 0) {
      arr.splice(index, 1);
    } else {
      arr.push(req.user._id.toString());
    }

    comment.reactions.set(emoji, arr);

    await post.save();

    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (String(post.author) !== String(req.user._id)) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
