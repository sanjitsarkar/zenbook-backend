const { Post } = require("../models");

const addComment = async (req, res) => {
  try {
    const { commentedBy, comment } = req.body;
    const { postId } = req.params;
 
    const comments = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { commentedBy, comment } } },
      { new: true }
    )

      .select("comments")
      .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ comments });
  } catch (err) {
    console.log({ err });
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeComment = async (req, res) => {
  try {
    const { commentedBy } = req.body;
    const { postId } = req.params;

    const comments = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { commentedBy } } },
      { new: true }
    )
      .select("comments")
      .populate("comments", "commentedBy", "_id name profilePictureURL");
    res.json({ comments });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addComment,
  removeComment,
};
