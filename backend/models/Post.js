const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    community: { type: String, required: true },
    image: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    // likes and customElements
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
        reactions: {
          type: Map,
          of: [String], // array of userIds for each emoji
          default: {},
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
