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

    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const isUserExists = await User.findOne({ $or: [{ email }, { username }] });
    if (isUserExists) {
      return res
        .status(400)
        .json({ message: "Username or Email already in use" });
    }

    const hashedPassword = await User.generateHashPassword(password);

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    await sendVerificationMail(user);

    const token = generateToken(user);
    res.status(201).json({
      message: "Account created Successfully",
      user: user.username,
      token: token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyMail = async (req, res) => {
  const { id, token } = req.params;

  // res.send("Hello");
  // console.log(id);

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
    const updatedUser = await user.save();

    console.log("After update:", updatedUser);

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
      return res
        .status(401)
        .json({ message: "Authentication failed. Wrong password." });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Signin Successful",
      user: user.username,
      token: token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { home, signup, verifyMail, signin };
