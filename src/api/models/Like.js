const { Schema, model } = require("mongoose");
const likeSchema = new Schema(
  {
    likedBy: {
      type: [Schema.Types.ObjectId],
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
module.exports = like = model("Like", likeSchema);
