const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    required: false,
  },
  emailVerified: {
    type : Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploads: [
    {
      type: Schema.Types.ObjectId,
      ref: "userUploads",
    },
  ],
});

// Method to generate hashed password
userSchema.statics.generateHashPassword = function (password) {
  const saltRounds = 10;
  try {
    const hashedPassword = bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error(err.message);
  }
};

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
