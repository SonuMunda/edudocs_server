const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendVerificationMail = require("../utils/sendVerificationMail");
const jwt = require("jsonwebtoken");

const home = (req, res) => {
  res.send("Hello");
};

const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    if (!username || !firstName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already in use" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    await Promise.all([user.save(), sendVerificationMail(user)]);

    return res
      .status(201)
      .json({ message: "Verification email sent to your email" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = signup;

const verifyMail = async (req, res) => {
  const { id, token } = req.params;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Before update:", user);

    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Oops Something went wrong!" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Signin Successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = getUserDetails;

module.exports = { home, signup, verifyMail, signin, getUserDetails };
