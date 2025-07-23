const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
// Manually check if env variables are present
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error(
    "❌ Cloudinary config variables are missing. Please check your .env file."
  );
  process.exit(1); // stop the server
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // optional but recommended
});

module.exports = { cloudinary };
