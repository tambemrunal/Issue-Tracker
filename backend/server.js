const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const geocodeRoutes = require("./routes/geocode");

const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // your frontend dev server
}));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/geocode", geocodeRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
