const express = require("express");
const { auth } = require("../middlewares");

const {
  fetchPost,
  addPost,
  deletePost,
  updatePost,
  fetchAllPostByHashTags,
  fetchAllTrendingPost,
  sortAllPostByDate,
  fetchAllPost,
} = require("../controllers/postController");
const {
  addComment,
  removeComment,
} = require("../controllers/commentController");
const { likePost, dislikePost } = require("../controllers/likeController");
const {
  fetchAllReply,
  removeReply,
  addReply,
} = require("../controllers/replyController");

const router = express.Router();

router.post("/", auth, addPost);
router.get("/", auth, fetchAllPost);
router.get("/hashtag/:id", auth, fetchAllPostByHashTags);
router.get("/trending/", auth, fetchAllTrendingPost);
router.get("/sortBy=date", auth, sortAllPostByDate);
router.delete("/:postId", auth, deletePost);
router.get("/:postId", auth, fetchPost);
router.put("/:postId", auth, updatePost);
router.put("/:postId/comments/add", auth, addComment);
router.put("/:postId/comments/remove", auth, removeComment);
router.get("/:postId/comments", auth, fetchAllReply);
router.post("/:postId/comments", auth, addReply);
router.delete("/:postId/comments", auth, removeReply);
router.put("/:postId/like", auth, likePost);
router.put("/:postId/dislike", auth, dislikePost);

module.exports = router;
