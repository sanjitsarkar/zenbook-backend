const { Post, User } = require("../models");

const addPost = async (req, res) => {
  try {
    const { content, mediaURLs, postType } = req.body;
    const post = await Post.create({
      content,
      mediaURLs,
      postType,
      userId: req.user.id,
    });
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, mediaURLs, postType } = req.body;
    const isPostExists = await Post.findOne({
      _id: postId,
      userId: req.user.id,
    });
    if (isPostExists) {
      await Post.updateOne({ _id: postId }, { content, mediaURLs, postType });
      res.json("Post updated successfully");
    } else
      res
        .status(404)
        .json({ errors: ["You are not authorized to perform this action"] });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostExists = await Post.findOne({
      _id: postId,
      postId: req.user.id,
    });
    if (isPostExists) {
      await Post.deleteOne({ _id: postId });
      res.json("Post deleted successfully");
    } else
      res
        .status(404)
        .json({ errors: ["You are not authorized to perform this action"] });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserPost = async (req, res) => {
  try {
    let posts;
    let { userId, search } = req.query;
    if (!userId) {
      userId = req.user.id;
    }
    if (search)
      posts = await Post.find(
        { userId },
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else posts = await Post.find({ userId });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserDraftPost = async (req, res) => {
  try {
    let posts;
    const { search } = req.query;
    const userId = req.user.id;

    if (search)
      posts = await Post.find(
        { userId, postType: "draft" },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else posts = await Post.find({ userId, postType: "draft" });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserArchivedPost = async (req, res) => {
  try {
    let posts;
    const { search } = req.query;

    const userId = req.user.id;

    if (search)
      posts = await Post.find(
        { userId, postType: "archived" },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else posts = await Post.find({ userId, postType: "archived" });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserBookmarkedPost = async (req, res) => {
  try {
    let posts;
    const { search } = req.query;
    let userId = req.user.id;

    if (search)
      posts = await Post.find(
        { userId, postType: "bookmarked" },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else posts = await Post.find({ userId, postType: "bookmarked" });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllPost = async (req, res) => {
  try {
    const { search } = req.query;
    let posts;
    if (search)
      posts = await Post.find(
        {},
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else posts = await Post.find();
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllPostByUserId = async (req, res) => {
  try {
    const { search } = req.query;
    const { userId } = req.params;

    const userInfo = await User.findOne({ _id: userId });
    let posts;
    if (search)
      posts = await Post.find(
        {
          postId: { $in: [userId, userInfo.following] },
          postType: "published",
        },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else
      posts = await Post.find({
        userId: { $in: [userId, userInfo.following] },
        postType: "published",
      });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllTrendingUserPost = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    const userInfo = await User.findOne({ _id: userId });
    let posts;
    if (search)
      posts = await Post.find(
        {
          userId: { $in: [userId, userInfo.following] },
          postType: "published",
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      ).sort({ likes: -1, score: { $meta: "textScore" } });
    else
      posts = await Post.find({
        userId: { $in: [userId, userInfo.following] },
        postType: "published",
      }).sort({ likes: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const sortAllUserPostByDate = async (req, res) => {
  try {
    const { search } = req.query;
    let { order } = req.query;
    const userId = req.user.id;
    const userInfo = await User.findOne({ _id: userId });

    if (order === "asc") {
      order = 1;
    } else {
      order = -1;
    }
    let posts;
    if (search)
      posts = await Post.find(
        {
          userId: { $in: [userId, userInfo.following] },
          postType: "published",
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      ).sort({ updatedAt: order, score: { $meta: "textScore" } });
    else
      posts = await Post.find({
        userId: { $in: [userId, userInfo.following] },
        postType: "published",
      }).sort({ updatedAt: order });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllTrendingPost = async (req, res) => {
  try {
    const { search } = req.query;

    let posts;
    if (search)
      posts = await Post.find(
        {
          postType: "published",
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      ).sort({ likes: -1, score: { $meta: "textScore" } });
    else
      posts = await Post.find({
        postType: "published",
      }).sort({ likes: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const sortAllPostByDate = async (req, res) => {
  try {
    const { search } = req.query;
    let { order } = req.query;
    if (order === "asc") {
      order = 1;
    } else {
      order = -1;
    }
    let posts;
    if (search)
      posts = await Post.find(
        {
          postType: "published",
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      ).sort({ updatedAt: order, score: { $meta: "textScore" } });
    else
      posts = await Post.find({
        postType: "published",
      }).sort({ updatedAt: order });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllPostByHashTags = async (req, res) => {
  const { hashtag } = req.params;
  try {
    const posts = await Post.find({
      hashTags: { $in: hashtag },
      postType: "published",
    });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addPost,
  updatePost,
  deletePost,
  fetchPost,
  fetchAllUserPost,
  fetchAllPostByUserId,
  fetchAllPost,
  sortAllPostByDate,
  fetchAllUserDraftPost,
  fetchAllUserArchivedPost,
  fetchAllUserBookmarkedPost,
  fetchAllPostByHashTags,
  fetchAllTrendingPost,
  sortAllUserPostByDate,
  fetchAllTrendingUserPost,
};
