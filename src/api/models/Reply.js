const { Schema, model } = require("mongoose");
const replySchema = new Schema(
  {
    reply: {
      type: String,
    },
    repliedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = reply = model("reply", replySchema);
