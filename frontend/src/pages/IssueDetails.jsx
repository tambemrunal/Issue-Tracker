// src/pages/IssueDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIssueById } from "../api/issueApi";
import MapView from "../components/MapView";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    const getIssue = async () => {
      try {
        const data = await fetchIssueById(id);
        setIssue(data);
        setUpvoteCount(data.upvotes?.length || 0);
        // Check if current user has upvoted (you might need to implement user auth)
        // setIsUpvoted(data.upvotes?.includes(currentUserId));
      } catch (err) {
        setError("Failed to fetch issue details.");
      }
    };
    getIssue();
  }, [id]);

  const handleUpvote = async () => {
    if (isUpvoting) return;

    setIsUpvoting(true);
    try {
      // Add your upvote API call here
      // await upvoteIssue(id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isUpvoted) {
        setUpvoteCount((prev) => prev - 1);
        setIsUpvoted(false);
      } else {
        setUpvoteCount((prev) => prev + 1);
        setIsUpvoted(true);
      }
    } catch (err) {
      console.error("Failed to upvote:", err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-200 shadow-amber-100";
      case "in progress":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 shadow-blue-100";
      case "resolved":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200 shadow-emerald-100";
      case "rejected":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border-slate-200 shadow-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "in progress":
        return "🔄";
      case "resolved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📋";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "infrastructure":
        return "🏗";
      case "safety":
        return "🚨";
      case "environment":
        return "🌿";
      case "transportation":
        return "🚗";
      case "utilities":
        return "⚡";
      default:
        return "📋";
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "infrastructure":
        return "from-orange-400 to-red-500";
      case "safety":
        return "from-red-400 to-pink-500";
      case "environment":
        return "from-green-400 to-emerald-500";
      case "transportation":
        return "from-blue-400 to-indigo-500";
      case "utilities":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-slate-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-12 max-w-lg text-center backdrop-blur-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Unable to Load Issue
          </h3>
          <p className="text-slate-600 text-lg mb-8">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Loading Issue Details
          </h3>
          <p className="text-slate-600 text-lg">
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Go Back Button */}
              <button
                onClick={handleGoBack}
                className="group flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium">Back</span>
              </button>

              <div
                className={`w-20 h-20 bg-gradient-to-br ${getCategoryColor(
                  issue.category
                )} rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500`}
              >
                <span className="text-3xl">
                  {getCategoryIcon(issue.category)}
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  {issue.title}
                </h1>
                <div className="flex items-center space-x-8 text-slate-600">
                  <span className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="font-semibold">#{id}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 10V7a2 2 0 012-2h4a2 2 0 012 2v10m-6 0a2 2 0 002 2h4a2 2 0 002-2m-6 0h8"
                      />
                    </svg>
                    <span>{formatDate(issue.createdAt)}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      By <strong>{issue.createdBy}</strong>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Upvote Button */}
              <button
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                  isUpvoted
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-200"
                    : "bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-2 border-slate-200 hover:border-purple-200"
                } ${isUpvoting ? "opacity-75 scale-95" : ""}`}
              >
                <div
                  className={`relative ${isUpvoting ? "animate-pulse" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isUpvoted ? "scale-110" : "group-hover:scale-110"
                    }`}
                    fill={isUpvoted ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  {isUpvoting && (
                    <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <span className="text-lg">{upvoteCount}</span>
                <span>{isUpvoted ? "Upvoted" : "Upvote"}</span>
              </button>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-lg font-bold border-2 shadow-lg ${getStatusColor(
                  issue.status
                )}`}
              >
                <span className="text-2xl drop-shadow-sm">
                  {getStatusIcon(issue.status)}
                </span>
                <span className="capitalize tracking-wide">{issue.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-160px)]">
          {/* Left Panel - Enhanced Issue Details */}
          <div className="bg-gradient-to-br from-white to-slate-50 border-r border-slate-200/50">
            <div className="h-full overflow-y-auto">
              <div className="p-8 space-y-8">
                {/* Enhanced Stats Cards with Animations */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="group bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-3xl p-8 border-2 border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(
                          issue.category
                        )} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      >
                        <span className="text-2xl">
                          {getCategoryIcon(issue.category)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">
                          Category
                        </p>
                        <p className="text-2xl font-bold text-blue-900 capitalize">
                          {issue.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 rounded-3xl p-8 border-2 border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-1">
                          Community Support
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          {upvoteCount} upvotes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Description Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 border-b border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span>Issue Description</span>
                    </h2>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-700 leading-relaxed text-lg font-medium">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Enhanced Location Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-rose-100 p-8 border-b border-red-200/50">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span>Location Details</span>
                    </h2>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200/50">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                        Address
                      </p>
                      <p className="text-slate-900 text-xl font-semibold">
                        {issue.location.address}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200/50">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                          Latitude
                        </p>
                        <p className="text-slate-900 font-mono text-lg">
                          {issue.location.lat.toFixed(6)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200/50">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                          Longitude
                        </p>
                        <p className="text-slate-900 font-mono text-lg">
                          {issue.location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Photo Evidence Card */}
                {issue.image && (
                  <div className="group bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-8 border-b border-green-200/50">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span>Photo Evidence</span>
                      </h2>
                    </div>
                    <div className="p-8">
                      <div className="rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                        <img
                          src={issue.image}
                          alt="Issue evidence"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Timeline Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-100 p-8 border-b border-amber-200/50">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span>Timeline</span>
                    </h2>
                  </div>
                  <div className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <span className="font-bold text-slate-900 text-lg">
                            Issue Created
                          </span>
                        </div>
                        <span className="text-slate-600 font-semibold bg-white px-4 py-2 rounded-xl">
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                      {issue.updatedAt &&
                        issue.updatedAt !== issue.createdAt && (
                          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              </div>
                              <span className="font-bold text-slate-900 text-lg">
                                Last Updated
                              </span>
                            </div>
                            <span className="text-slate-600 font-semibold bg-white px-4 py-2 rounded-xl">
                              {formatDate(issue.updatedAt)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Panel - Interactive Map */}
          <div className="bg-gradient-to-br from-white to-slate-50">
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 via-white to-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Interactive Location Map
                    </span>
                    <p className="text-sm text-slate-600 font-normal mt-2 flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Precise location visualization with interactive controls
                      </span>
                    </p>
                  </div>
                </h2>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none z-10"></div>
                <MapView
                  lat={issue.location.lat}
                  lng={issue.location.lng}
                  address={issue.location.address}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
