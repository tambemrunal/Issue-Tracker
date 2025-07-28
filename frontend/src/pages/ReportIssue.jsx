import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { createIssue } from "../api/issueApi";
import { useNavigate } from "react-router-dom";

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user ? user._id : "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: {
      lat: "",
      lng: "",
      address: "",
    },
    createdBy: currentUserId,
  });

  const [manualAddress, setManualAddress] = useState({
    address: "",
    pincode: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const categories = [
    { value: "Infrastructure", icon: "🏗️" },
    { value: "Environment", icon: "🌱" },
    { value: "Public Safety", icon: "🚨" },
    { value: "Transportation", icon: "🚌" },
    { value: "Utilities", icon: "⚡" },
    { value: "Health & Sanitation", icon: "🏥" },
    { value: "Education", icon: "🎓" },
    { value: "Other", icon: "📝" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddressToCoords = async () => {
    const { address, pincode } = manualAddress;
    const fullAddress = `${address}, ${pincode}`;

    // if (!address || !pincode) {
    //   setLocationError("Please enter both address and pincode.");
    //   return;
    // }

    setLoadingLocation(true);
    setLocationError("");

    try {
      const res = await fetch("http://localhost:5000/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullAddress }),
      });

      const data = await res.json();
      console.log(data.lat, data.lng);
      if (data.lat && data.lng) {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: data.lat,
            lng: data.lng,
            address: fullAddress,
          },
        }));
      } else {
        setLocationError("Could not fetch coordinates. Try again.");
      }
    } catch (error) {
      setLocationError("Error reaching the geocoding service.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const updatedData = {
        ...formData,
        createdBy: currentUserId,
        imageFile: selectedImage,
      };

      await createIssue(updatedData);
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        category: "",
        location: { lat: "", lng: "", address: "" },
        createdBy: currentUserId,
      });
      setSelectedImage(null);
      setImagePreview(null);
      setManualAddress({ address: "", pincode: "" });
    } catch (err) {
      setError("Failed to create issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToHome}
            className="group flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="text-gray-600 group-hover:text-gray-800 font-medium">
              Back to Home
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-4">
              Report Community Issue
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Help to make your community better by reporting issues that need
              attention.
            </p>
            <span className="font-semibold text-red-500 text-lg">
              Your voice matters!
            </span>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-800">
                Issue reported successfully!
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Detailed description of the issue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: cat.value }))
                    }
                    className={`p-4 border-2 rounded-xl ${
                      formData.category === cat.value
                        ? "border-blue-400 bg-blue-50 text-blue-700 shadow"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-sm">{cat.value}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Address & Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter full address"
                className="w-full border p-2 rounded mb-2"
                value={manualAddress.address}
                onChange={(e) =>
                  setManualAddress((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter pincode"
                className="w-full border p-2 rounded mb-2"
                value={manualAddress.pincode}
                onChange={(e) =>
                  setManualAddress((prev) => ({
                    ...prev,
                    pincode: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={handleAddressToCoords}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Get Coordinates from Address
              </button>
              {locationError && (
                <p className="text-red-500 mt-2 text-sm">{locationError}</p>
              )}
              {loadingLocation && (
                <p className="text-blue-500 mt-2 text-sm">
                  Fetching location...
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto mb-4 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <span className="text-blue-600 font-medium">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIssuePage;
