const express = require("express");
const { auth } = require("../middlewares");
const {
  fetchAllPostByUserId,
  fetchAllUserPost,
  fetchAllUserArchivedPost,
  fetchAllUserBookmarkedPost,
  fetchAllUserDraftPost,
  addPostToArchived,
  addPostToDraft,
  addPostToBookmarked,
  removePostFromArchived,
  removePostFromBookmarked,
  removePostFromDraft,
  sortAllUserPostByDate,
  fetchAllTrendingUserPost,
} = require("../controllers/postController");
const { followUser, unFollowUser } = require("../controllers/followController");
const { getUserInfo } = require("../controllers/authController");
const router = express.Router();

router.get("/posts", auth, fetchAllUserPost);
router.get("/profile/:id", auth, getUserInfo);
router.get("/posts/archived", auth, fetchAllUserArchivedPost);
router.get("/posts/bookmarked", auth, fetchAllUserBookmarkedPost);
router.get("/posts/draft", auth, fetchAllUserDraftPost);
router.put("/posts/archived/:postId", auth, addPostToArchived);
router.put("/posts/bookmarked/:postId", auth, addPostToBookmarked);
router.put("/posts/draft/:postId", auth, addPostToDraft);
router.delete("/posts/archived/:postId", auth, removePostFromArchived);
router.delete("/posts/bookmarked/:postId", auth, removePostFromBookmarked);
router.delete("/posts/draft/:postId", auth, removePostFromDraft);
router.get("/:postedBy/posts", auth, fetchAllPostByUserId);
router.get("/posts/sortBy=date", auth, sortAllUserPostByDate);
router.get("/posts/trending", auth, fetchAllTrendingUserPost);
router.put("/follow/:followingId", auth, followUser);
router.put("/unfollow/:followingId", auth, unFollowUser);

module.exports = router;
