const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: isURL } = require("validator/lib/isURL");
const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [5, "Name should be atleast of 5 characters."],
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      unique: [true, "Email is already taken."],
      required: [true, "Email is required."],
      validate: (value) => isEmail(value),
    },
    profilePictureURL: {
      type: String,
      default: "https://i.pravatar.cc/150",
      validate: (value) => isURL(value),
    },
    bio: {
      type: String,
      default: "",
    },
    portfolioUrl: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password length must be 6 atleast."],
    },
    token: {
      type: String,
    },
    followings: {
      type: [Schema.Types.ObjectId],
    },
    followers: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      return user;
    } else {
      throw Error("Wrong password");
    }
  } else {
    throw Error("Incorrect email");
  }
};
userSchema.statics.signup = async function (name, email, password) {
  const isUserExist = await this.findOne({ email });
  if (isUserExist) {
    throw Error("User already exist. Please login");
  }

  const user = await this.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  const token = jwt.sign(
    { id: user._id, email: email.toLowerCase() },
    process.env.JWT_TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  user.token = token;
  return user;
};

module.exports = User = model("user", userSchema);
