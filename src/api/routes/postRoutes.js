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

router.get("/", fetchAllPost);
router.post("/comments/:commentId", auth, addReply);
router.delete("/replies/:replyId", auth, removeReply);
router.get("/comments/:commentId", auth, fetchAllReply);
router.post("/:postId", auth, addPost);
router.get("/hashtag/:id", auth, fetchAllPostByHashTags);
router.get("/trending/", auth, fetchAllTrendingPost);
router.get("/sortBy=date", auth, sortAllPostByDate);
router.delete("/:postId", auth, deletePost);
router.get("/:postId", auth, fetchPost);
router.put("/:postId", auth, updatePost);
router.put("/:postId/comments/add", auth, addComment);
router.put("/:postId/comments/remove", auth, removeComment);
router.put("/:postId/like", auth, likePost);
router.put("/:postId/dislike", auth, dislikePost);

module.exports = router;
