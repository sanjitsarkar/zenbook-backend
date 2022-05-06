const { Schema, model } = require("mongoose");
const likeSchema = new Schema(
  {
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = like = model("Like", likeSchema);
