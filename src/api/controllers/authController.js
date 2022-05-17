const { User } = require("../models");
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    if (user) {
      res.json({
        user,
      });
    }
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.signup(name, email, password);
    res.json({
      user,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const getUserInfo = async (req, res) => {
  let { id } = req.params;
  try {
    const profile = await User.findById(id).select(
      "-password -draftPosts -archivedPosts -bookmarkedPosts"
    );
    res.json({
      profile,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const updateUserProfile = async (req, res) => {
  let { id } = req.params;
  let { name, bio, portfolioUrl, profilePictureURL, coverPictureURL } =
    req.body;
  try {
    const profile = await User.findByIdAndUpdate(
      id,
      {
        name,
        bio,
        portfolioUrl,
        profilePictureURL,
        coverPictureURL,
      },
      { new: true }
    ).select("-password -draftPosts -archivedPosts -bookmarkedPosts");
    res.json({
      profile,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
module.exports = {
  loginController,
  signupController,
  getUserInfo,
  updateUserProfile,
};
