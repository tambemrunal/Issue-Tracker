// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  createdBy: {
    type: String, // or ObjectId if you link to a User
    required: true,
  },
  upvotes: {
    type: [String], // store user IDs
    default: [],
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "resolved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
