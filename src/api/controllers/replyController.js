const { Reply } = require("../models");

const addReply = async (req, res) => {
  try {
    const { reply, repliedBy } = req.body;
    const { commentId } = req.params;
    let _reply = new Reply({ reply, repliedBy, commentId });
    await _reply.save();
    _reply = await _reply.populate("repliedBy", "_id name profilePictureURL");

    res.json({ reply: _reply });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    await Reply.findOneAndDelete({ _id: replyId });
    res.json({ replyId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllReply = async (req, res) => {
  try {
    const { commentId } = req.params;
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
