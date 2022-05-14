const { Schema, model } = require("mongoose");
const hashTagSchema = new Schema({
  tag: {
    type: String,
  },
});
module.exports = comment = model("hashTag", hashTagSchema);
