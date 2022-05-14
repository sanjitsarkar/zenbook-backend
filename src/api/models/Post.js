const { Schema, model } = require("mongoose");
const likeSchema = require("./Like");
const commentSchema = require("./Comment");
const postSchema = new Schema(
  {
    content: {
      type: String,
      index: true,
    },
    likes: {
      type: [likeSchema.schema],
    },
    hashTags: {
      type: [String],
    },
    comments: {
      type: [commentSchema.schema],
    },
    mediaURLs: {
      type: [String],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      required: [true, "postedBy can't be empty."],
      ref: "user",
    },
    shares: {
      type: [Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
