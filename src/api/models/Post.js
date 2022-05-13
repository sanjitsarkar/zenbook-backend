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
    },
    hashTags: {
      type: [String],
    },
    comments: {
      type: [commentSchema.schema],
      default: [],
    },
    mediaURLs: {
      type: [String],
      required: [true, "MediaURLs can't be empty."],
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
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
