const express = require("express");
const { auth } = require("../middlewares");
const {
  fetchAllPostByUserId,
  fetchAllUserPost,
  fetchAllUserArchivedPost,
  fetchAllUserBookmarkedPost,
  fetchAllUserDraftPost,

  sortAllUserPostByDate,
  fetchAllTrendingUserPost,
} = require("../controllers/postController");
const { followUser, unFollowUser } = require("../controllers/followController");
const { getUserInfo } = require("../controllers/authController");
const router = express.Router();

router.get("/posts", auth, fetchAllUserPost);
router.get("/", auth, getUserInfo);
router.get("/posts/archived", auth, fetchAllUserArchivedPost);
router.get("/posts/bookmarked", auth, fetchAllUserBookmarkedPost);
router.get("/posts/draft", auth, fetchAllUserDraftPost);
router.get("/:id/posts", auth, fetchAllPostByUserId);
router.get("/posts/sortBy=date", auth, sortAllUserPostByDate);
router.get("/posts/trending", auth, fetchAllTrendingUserPost);
router.put("/follow/:followingId", auth, followUser);
router.put("/unfollow/:followingId", auth, unFollowUser);

module.exports = router;
