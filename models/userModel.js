const mongoose = require(mongoose);
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: false,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Uploads",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
