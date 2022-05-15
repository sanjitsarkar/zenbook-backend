const { Schema, model } = require("mongoose");
const commentSchema = require("./Comment");
const mediaUrlSchema = require("./MediaUrl");
const postSchema = new Schema(
  {
    content: {
      type: String,
      index: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "user",
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
      type: [Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
postSchema.index({ content: "text" });
module.exports = post = model("post", postSchema);
