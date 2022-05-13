const { Schema, model } = require("mongoose");
const likeSchema = new Schema(
  {
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = like = model("Like", likeSchema);
