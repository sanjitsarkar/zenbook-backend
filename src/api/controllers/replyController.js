const { Reply } = require("../models");

const addReply = async (req, res) => {
  try {
    const { repliedBy, id: commentId } = req.body;
    const reply = await Reply.create({ repliedBy, commentId }).populate(
      "repliedBy",
      "_id name profilePictureURL"
    );
    res.json({ reply });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeReply = async (req, res) => {
  try {
    const { repliedBy, id: commentId } = req.body;
    await Reply.remove({ repliedBy, commentId }, { new: true }).populate(
      "repliedBy",
      "_id name profilePictureURL"
    );
    res.json("Reply deleted successfully");
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllReply = async (req, res) => {
  try {
    const { id: commentId } = req.body;
    const replies = await Reply.find({ commentId }).populate(
      "repliedBy",
      "_id name profilePictureURL"
    );
    res.json({ replies });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addReply,
  removeReply,
  fetchAllReply,
};
