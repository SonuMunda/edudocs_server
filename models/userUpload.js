const mongoose = require("mongoose");
const { Schema } = mongoose;

const uploadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
