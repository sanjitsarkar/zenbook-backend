const { Post } = require("../models");

const likePost = async (req, res) => {
  try {
    const { likedBy, postId } = req.body;
    const userId = req.user.id;
    if (likedBy !== userId) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: { likedBy, userId } } }
      );
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: { likedBy, userId } } }
      );
      res.json("Liked successfully");
    } else {
      res.json("Can't like your own post");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const dislikePost = async (req, res) => {
  try {
    const { dislikedBy, postId } = req.body;
    const userId = req.user.id;

    if (likedBy !== userId) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: { dislikedBy, userId } } }
      );
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: { dislikedBy, userId } } }
      );
      res.json("Disliked successfully");
    } else {
      res.json("Can't dislike your own post");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = { likePost, dislikePost };
