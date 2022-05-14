const { Schema, model } = require("mongoose");
const likeSchema = require("./Like");
const commentSchema = require("./Comment");
const mediaUrlSchema = require("./MediaUrl");
const shareSchema = require("./Share");
const hashTagSchema = require("./Hashtag");
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
      type: [hashTagSchema.schema],
    },
    comments: {
      type: [commentSchema.schema],
    },
    mediaURLs: {
      type: [mediaUrlSchema.schema],
      required: false,
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
