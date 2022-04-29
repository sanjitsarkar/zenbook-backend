const { Post, User } = require("../models");

const addComment = async (req, res) => {
  try {
    const { commentedBy, id: postId, userId } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { commentedBy, userId } } }
    );
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeComment = async (req, res) => {
  try {
    const { commentedBy, id: postId, userId } = req.body;
    await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { commentedBy, userId } } }
    );
    res.json("Comment deleted successfully");
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addComment,
  removeComment,
};
