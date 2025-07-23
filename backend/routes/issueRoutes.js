// routes/issueRoutes.js
const express = require("express");
const router = express.Router();
const upload=require("../middlewares/uploadMiddleware");
const { storage } = require("../config/cloudinary");


const {
  createIssue,
  getAllIssues,
  getIssueById,
  toggleUpvote,
} = require("../controllers/issueController");

router.post("/", upload.single("image"), createIssue);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.patch("/:id/upvote", toggleUpvote);

module.exports = router;
