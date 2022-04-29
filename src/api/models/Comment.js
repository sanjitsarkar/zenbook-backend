const { Schema, model } = require("mongoose");
const commentSchema = new Schema(
  {
    comment: {
      type: String,
    },
    commentedBy: {
      type: [Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
module.exports = comment = model("comment", commentSchema);
