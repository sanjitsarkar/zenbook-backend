const { Schema, model } = require("mongoose");
const shareSchema = new Schema(
  {
    to: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = comment = model("share", shareSchema);
