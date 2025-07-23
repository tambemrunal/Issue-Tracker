// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const issueRoutes = require("./routes/issueRoutes");

dotenv.config();
const app = express();
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
app.use(cors());
app.use(express.json()); // for parsing application/json

app.use("/api/issues", issueRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
