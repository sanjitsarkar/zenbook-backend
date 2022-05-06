const { Schema, model } = require("mongoose");
const likeSchema = require("./Like");
const commentSchema = require("./Comment");
const postSchema = new Schema(
  {
    content: {
      type: String,
      index: true,
      required: [true, "Post content can't be empty."],
    },
    likes: {
      type: [likeSchema.schema],
    },
    hashTags: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema.schema],
    },
    mediaURLs: {
      type: [String],
      required: [true, "MediaURLs can't be empty."],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User Id can't be empty."],
      ref: "User",
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
