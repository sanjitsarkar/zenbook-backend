const req = require("express/lib/request");
const { User } = require("../models");

const followUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    if (followingId !== req.user.id) {
      await User.findOneAndUpdate(
        { _id: followingId },
        { $push: { followers: req.user.id } }
      );
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { followings: req.user.id } }
      );
      res.json("Successfully followed");
    } else {
      res.json("Can't follow yourself");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const unFollowUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    if (followingId !== req.user.id) {
      await User.findOneAndUpdate(
        { _id: followingId },
        { $pull: { followers: req.user.id } }
      );
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { followings: req.user.id } }
      );
      res.json("Successfully unfollowed");
    } else {
      res.json("Can't unfollow yourself");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = { followUser, unFollowUser };
