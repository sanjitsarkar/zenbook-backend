const { Schema, model } = require("mongoose");
const replySchema = require("./Reply");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    replies: { type: [Schema.Types.ObjectId], ref: "reply" },
  },
  { timestamps: true }
);
module.exports = comment = model("comment", commentSchema);
