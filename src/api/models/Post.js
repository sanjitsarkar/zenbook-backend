const { Schema, model } = require("mongoose");
const likeSchema = require("./Like");
const commentSchema = require("./Comment");
const postSchema = new Schema(
  {
    content: {
      type: String,
      index: true,
      default: "",
    },
    likes: {
      type: [likeSchema.schema],
      default: [],
      unique: [true, "Like already exist."],
    },
    hashTags: {
      type: [String],
      default: [],
      unique: [true, "Hash tag already exist."],
    },
    comments: {
      type: [commentSchema.schema],
      default: [],
      unique: [true, "Comment already exist."],
    },
    mediaURLs: {
      type: [String],
      required: [true, "MediaURLs can't be empty."],
      unique: [true, "MediaURLs already exist."],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      required: [true, "postedBy can't be empty."],
      ref: "user",
    },
    shares: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: "user",
      unique: [true, "Share already exist."],
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
