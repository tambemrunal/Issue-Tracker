// routes/geocode.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// POST /api/geocode
router.post("/", async (req, res) => {
  try {
    const { fullAddress } = req.body;

    if (!fullAddress) {
      return res.status(400).json({
        error: "Full address is required including region and pincode",
        example: "123 Main St, Bangalore 560001, Karnataka, India",
      });
    }

    // OpenStreetMap Nominatim API request
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${fullAddress}, India`, // Explicitly add country
          format: "json",
          addressdetails: 1,
          countrycodes: "in", // Restrict to India
          limit: 1,
        },
        headers: {
          "User-Agent": "sabale9322@gmail.com", // Required header
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        error: "No results found",
        suggestion:
          "Try format: 'Landmark, Village, Pincode' like 'Dharodi, Parner 414305'",
      });
    }

    const result = response.data[0];

    // Verify essential data
    if (!result.lat || !result.lon) {
      throw new Error("Invalid coordinate data received");
    }

    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      pincode: result.address?.postcode || "Not found",
      source: "OpenStreetMap",
    });
  } catch (error) {
    console.error("Geocode Error:", error);

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error ||
      "Try a simpler address like 'Parner 414305'";

    res.status(statusCode).json({
      error: errorMessage,
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
});

module.exports = router;
