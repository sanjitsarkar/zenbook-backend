const { Schema, model } = require("mongoose");
const likeSchema = require("./Like");
const commentSchema = require("./Comment");
const mediaUrlSchema = require("./MediaUrl");
const shareSchema = require("./Share");
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
      type: [mediaUrlSchema.schema],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      required: [true, "postedBy can't be empty."],
      ref: "user",
    },
    shares: {
      type: [shareSchema.schema],
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
