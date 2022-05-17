const { Post, User } = require("../models");

const addPost = async (req, res) => {
  try {
    const { content, mediaURLs } = req.body;
    const { id } = req.params;

    const hashTags = content.split(" ").filter((word) => {
      if (word.startsWith("#")) return word.slice(1);
    });
    let data = {
      content,
      postedBy: id,
    };
    if (hashTags[0] !== undefined)
      data = {
        ...data,
        hashTags,
      };
    if (mediaURLs && mediaURLs.length > 0) data = { ...data, mediaURLs };

    let post = new Post(data);

    post = await post.save();

    res.json({ post });
  } catch (err) {
    console.log({ err });
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updatePost = async (req, res) => {
  try {
    const { content, mediaURLs } = req.body;
    const { postId } = req.params;
    const isPostExists = await Post.findOne({
      _id: postId,
      postedBy: req.user.id,
    });

    if (isPostExists) {
      const hashTags = content.split(" ").filter((word) => {
        if (word.startsWith("#")) return word.slice(1);
      });
      let data = {
        content,
        postedBy: req.user.id,
      };
      if (hashTags[0] !== undefined)
        data = {
          ...data,
          hashTags,
        };
      if (mediaURLs && mediaURLs.length > 0) data = { ...data, mediaURLs };
      if (!mediaURLs) data = { ...data, mediaURLs: [] };
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { ...data },
        { new: true }
      )
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
      res.json({ post });
    } else
      res
        .status(404)
        .json({ errors: ["You are not authorized to perform this action"] });
  } catch (err) {
    console.log("err", err);
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostExists = await Post.findOne({
      _id: postId,
      postedBy: req.user.id,
    });
    if (isPostExists) {
      await Post.deleteOne({ _id: postId }, { new: true });
      res.json({ post: { _id: postId } });
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
    const post = await Post.findById(postId)
      .populate("postedBy", "_id name profilePictureURL")
      .populate("comments.commentedBy", "_id name profilePictureURL");
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
    if (search) {
      posts = await Post.find(
        {
          isArchived: false,
          postedBy,
        },
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    } else {
      posts = await Post.find({
        isArchived: false,
        postedBy,
      })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    }
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserDraftPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const user = await User.findById(postedBy);
    if (user == undefined) {
      res.json({ posts: [] });
    } else {
      const posts = await Promise.all(
        user?.draftPosts?.map(async (postId) => {
          const post = await Post.find({
            isArchived: false,
            _id: postId,
          })
            .populate("postedBy", "_id name profilePictureURL")
            .populate("comments.commentedBy", "_id name profilePictureURL");
          return post[0];
        })
      );
      res.json({ posts });
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { draftPosts: postId } },
      { new: true }
    );
    const post = await Post.findById(postId)
      .populate("postedBy", "_id name profilePictureURL")
      .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { draftPosts: postId } },
      { new: true }
    );

    res.json({ postId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserArchivedPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const user = await User.findById(postedBy);
    if (user == undefined) {
      res.json({ posts: [] });
    } else {
      const posts = await Promise.all(
        user?.archivedPosts?.map(async (postId) => {
          const post = await Post.find({
            _id: postId,
          })
            .populate("postedBy", "_id name profilePictureURL")
            .populate("comments.commentedBy", "_id name profilePictureURL");
          return post[0];
        })
      );

      res.json({ posts });
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToArchived = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { archivedPosts: postId } },
      { new: true }
    );

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          isArchived: true,
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name profilePictureURL")
      .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromArchived = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { archivedPosts: postId } },
      { new: true }
    );
    await Post.findByIdAndUpdate(postId, {
      $set: {
        isArchived: false,
      },
    });
    res.json({ postId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllUserBookmarkedPost = async (req, res) => {
  try {
    const postedBy = req.user.id;
    const user = await User.findById(postedBy);
    if (user == undefined) {
      res.json({ posts: [] });
    } else {
      const posts = await Promise.all(
        user?.bookmarkedPosts?.map(async (postId) => {
          const post = await Post.find({
            isArchived: false,
            _id: postId,
          })
            .populate("postedBy", "_id name profilePictureURL")
            .populate("comments.commentedBy", "_id name profilePictureURL");
          return post[0];
        })
      );
      res.json({ posts });
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const addPostToBookmarked = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookmarkedPosts: postId } },
      { new: true }
    );
    const post = await Post.findById(postId)
      .populate("postedBy", "_id name profilePictureURL")
      .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ post });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removePostFromBookmarked = async (req, res) => {
  try {
    const { postId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { bookmarkedPosts: postId } },
      { new: true }
    );

    res.json({ postId });
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
        { isArchived: false },
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({ isArchived: false })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    console.log(err);
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllPostByUserId = async (req, res) => {
  try {
    const { search } = req.query;
    let { postedBy } = req.params;
    const userInfo = await User.findOne({ _id: postedBy });
    let posts;
    if (search)
      posts = await Post.find(
        {
          isArchived: false,
          postId: { $in: [postedBy, userInfo.following] },
        },

        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        isArchived: false,
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllTrendingUserPost = async (req, res) => {
  try {
    const { search } = req.query;
    const { postedBy } = req.params;

    const userInfo = await User.findOne({ _id: postedBy });
    let posts;
    if (search)
      posts = await Post.find(
        {
          isArchived: false,
          postedBy: { $in: [postedBy, userInfo.following] },
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ likes: -1, score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        isArchived: false,
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ likes: -1, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
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
          isArchived: false,
          postedBy: { $in: [postedBy, userInfo.following] },
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ updatedAt: order, score: { $meta: "textScore" } })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        isArchived: false,
        postedBy: { $in: [postedBy, userInfo.following] },
      })
        .sort({ updatedAt: order })
        .populate("postedBy")
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
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
          isArchived: false,
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ likes: -1, score: { $meta: "textScore" }, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        isArchived: false,
      })
        .sort({ likes: -1, updatedAt: -1 })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
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
          isArchived: false,
        },
        {
          $text: { $search: search },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ updatedAt: order, score: { $meta: "textScore" } })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    else
      posts = await Post.find({
        isArchived: false,
      })
        .sort({ updatedAt: order })
        .populate("postedBy", "_id name profilePictureURL")
        .populate("comments.commentedBy", "_id name profilePictureURL");
    res.json({ posts });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllPostByHashTags = async (req, res) => {
  const { hashtag } = req.params;
  try {
    const posts = await Post.find({
      isArchived: false,
      hashTags: { $in: hashtag },
    })
      .sort({ updatedAt: -1 })
      .populate("postedBy", "_id name profilePictureURL")
      .populate("comments.commentedBy", "_id name profilePictureURL");
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
