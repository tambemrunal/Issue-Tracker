import React, { useState, useEffect } from "react";
import {
  MapPin,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Home,
} from "lucide-react";
import { createIssue } from "../api/issueApi";
import { useNavigate } from "react-router-dom";

const CreateIssuePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: {
      lat: "",
      lng: "",
      address: "",
    },
    createdBy: "user123", // Replace with actual user ID from auth
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const address = `Lat: ${lat}, Lng: ${lng}`;
          setFormData((prev) => ({
            ...prev,
            location: {
              lat,
              lng,
              address,
            },
          }));
          setLocationLoading(false);
        },
        (error) => {
          setError("Unable to get location. Please enter manually.");
          setLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
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
      await createIssue({ ...formData, imageFile: selectedImage });
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        category: "",
        location: { lat: "", lng: "", address: "" },
        createdBy: "user123",
      });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      setError("Failed to create issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    navigate("/"); // Always redirects to home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Header */}
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Provide detailed information about the issue"
              />
            </div>

            {/* Category */}
            <div className="group">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        category: category.value,
                      }))
                    }
                    className={`p-4 border-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                      formData.category === category.value
                        ? "border-blue-400 bg-blue-50 text-blue-700 shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.value}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Refresh Location
                </button>
              </div>

              {locationLoading && (
                <p className="text-sm text-blue-500 flex items-center space-x-1">
                  <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-r-transparent rounded-full mr-2" />
                  Fetching your current location...
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="location.lat"
                  value={formData.location.lat}
                  onChange={handleInputChange}
                  placeholder="Latitude"
                  readOnly
                  className="px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="location.lng"
                  value={formData.location.lng}
                  onChange={handleInputChange}
                  placeholder="Longitude"
                  readOnly
                  className="px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Auto-filled address or coordinates"
                readOnly
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Issue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIssuePage;
