// routes/issueRoutes.js
const express = require("express");
const router = express.Router();
const upload=require("../middlewares/uploadMiddleware");
const { storage } = require("../config/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware=require("../middlewares/adminMiddleware");


const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  toggleUpvote,
} = require("../controllers/issueController");


router.post("/",authMiddleware, upload.single("image"), createIssue);
router.get("/",authMiddleware, getAllIssues);
router.get("/:id",authMiddleware, getIssueById);
router.patch("/:id/upvote",authMiddleware, toggleUpvote);
router.patch("/:id/status",authMiddleware,adminMiddleware,updateIssueStatus);



module.exports = router;
