// controllers/issueController.js
const Issue = require("../models/Issue");

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, location, createdBy } = req.body;

    const imageUrl = req.file?.path;

    const issue = new Issue({
      title,
      description,
      category,
      location: typeof location === "string" ? JSON.parse(location) : location,
      createdBy,
      image: imageUrl || " ",
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error("❌ Error in createIssue:", err);
    res.status(500).json({ error: "Issue creation failed" });
  }
};



exports.getAllIssues = async (req, res) => {
  try {
    const filters = req.query; // e.g., ?category=road
    const issues = await Issue.find(filters).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issue" });
  }
};

exports.toggleUpvote = async (req, res) => {
  try {
    console.log("Upvote toggle request received");
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      console.log("Issue not found");
      return res.status(404).json({ error: "Not found" });
    }

    const userId = req.body.userId;
    if (!userId) {
      console.log("No userId in request body");
      return res.status(400).json({ error: "Missing userId" });
    }

    const index = issue.upvotes.indexOf(userId);

    if (index > -1) {
      console.log("Removing upvote");
      issue.upvotes.splice(index, 1);
    } else {
      console.log("Adding upvote");
      issue.upvotes.push(userId);
    }

    await issue.save();
    console.log("Upvote updated successfully");
    res.json(issue);
  } catch (err) {
    console.error("Error in toggleUpvote:", err);
    res.status(500).json({ error: "Upvote failed" });
  }
};

exports.updateIssueStatus= async (req, res) => {
  const { status, remarks, estimatedFixTime } = req.body;

  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (status) issue.status = status;
    if (remarks) issue.remarks = remarks;
    if (estimatedFixTime) issue.estimatedFixTime = estimatedFixTime;

    await issue.save();

    res.status(200).json({ message: "Issue updated successfully", issue });
  } catch (err) {
    res.status(500).json({ message: "Failed to update issue", error: err });
  }
};
