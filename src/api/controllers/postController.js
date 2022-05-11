const { Post, User } = require("../models");

const addPost = async (req, res) => {
  try {
    const { content, mediaURLs } = req.body;
    const post = await Post.create({
      content,
      mediaURLs,
      postedBy: req.user.id,
    }).populate("postedBy", "_id name profilePictureURL");
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, mediaURLs } = req.body;
    const isPostExists = await Post.findOne({
      _id: postId,
      postedBy: req.user.id,
    });
    if (isPostExists) {
      await Post.updateOne(
        { _id: postId },
        { content, mediaURLs },
        { new: true }
      ).populate("postedBy", "_id name profilePictureURL");
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
      await Post.deleteOne({ _id: postId }, { new: true }).populate(
        "postedBy",
        "_id name profilePictureURL"
      );
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
    const post = await Post.findById(postId).populate(
      "postedBy",
      "_id name profilePictureURL"
    );
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserPost = async (req, res) => {
  try {
    let posts;
    let { postedBy, search } = req.query;
    if (!postedBy) {
      postedBy = req.user.id;
    }
    if (search)
      posts = await Post.find(
        { postedBy },
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({ postedBy })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserDraftPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const posts = await User.findById(postedBy)
      .sort({ updatedAt: -1 })
      .populate("draftPosts", "postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { draftPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { draftPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserArchivedPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const posts = await User.findById(postedBy)
      .sort({ updatedAt: -1 })
      .populate("archivedPosts", "postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToArchived = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { draftPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromArchived = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { draftPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserBookmarkedPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const posts = await User.findById(postedBy)
      .sort({ updatedAt: -1 })
      .populate("bookmarkedPosts", "postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToBookmarked = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookmarkedPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromBookmarked = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { bookmarkedPosts: { postId } } },
      { new: true }
    );

    res.json({ user });
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
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find()
        .populate("postedBy", "_id name profilePictureURL")
        .sort({ updatedAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllPostByUserId = async (req, res) => {
  try {
    const { search } = req.query;
    const { postedBy } = req.params;

    const userInfo = await User.findOne({ _id: postedBy });
    let posts;
    if (search)
      posts = await Post.find(
        {
          postId: { $in: [postedBy, userInfo.following] },
        },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllTrendingUserPost = async (req, res) => {
  try {
    const { search } = req.query;
    const postedBy = req.user.id;

    const userInfo = await User.findOne({ _id: postedBy });
    let posts;
    if (search)
      posts = await Post.find(
        {
          postedBy: { $in: [postedBy, userInfo.following] },
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ likes: -1, score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ likes: -1, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const sortAllUserPostByDate = async (req, res) => {
  try {
    const { search } = req.query;
    let { order } = req.query;
    const postedBy = req.user.id;
    const userInfo = await User.findOne({ _id: postedBy });

    if (order === "asc") {
      order = 1;
    } else {
      order = -1;
    }
    let posts;
    if (search)
      posts = await Post.find(
        {
          postedBy: { $in: [postedBy, userInfo.following] },
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ updatedAt: order, score: { $meta: "textScore" } })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ updatedAt: order })
        .populate("postedBy", "_id name profilePictureURL");
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
        {},
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ likes: -1, score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({})
        .sort({ likes: -1, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL");
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
        {},
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ updatedAt: order, score: { $meta: "textScore" } })
        .populate("postedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({})
        .sort({ updatedAt: order })
        .populate("postedBy", "_id name profilePictureURL");
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
    })
      .sort({ updatedAt: -1 })
      .populate("postedBy", "_id name profilePictureURL");
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
  addPostToArchived,
  addPostToDraft,
  addPostToBookmarked,
  removePostFromArchived,
  removePostFromBookmarked,
  removePostFromDraft,
};
