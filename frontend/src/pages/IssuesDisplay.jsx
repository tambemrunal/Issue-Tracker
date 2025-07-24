import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, User, Filter,Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const IssuesDisplay = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const navigate = useNavigate();
  
const { user } = useAuth();
const currentUser = user?._id; // Or null if not logged in

console.log("currentUser ",currentUser)

  const categories = [
    { value: '', label: 'All Issues' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Public Safety', label: 'Public Safety' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Health & Sanitation', label: 'Health & Sanitation' },
    { value: 'Education', label: 'Education' },

    { value: 'Other', label: 'Other' }
  ];

  // Fetch issues from API
  const fetchIssues = async (category = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const url = category 
        ? `/api/issues?category=${encodeURIComponent(category)}`
        : '/api/issues';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIssues(data);
      console.log("issues  ",data);
    } catch (err) {
      setError(err.message || 'Failed to fetch issues');
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle upvote
  const toggleUpvote = async (issueId) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/upvote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser }),
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setIssues(prevIssues => 
        prevIssues.map(issue => {
          if (issue._id === issueId) {
            const hasUpvoted = issue.upvotes.includes(currentUser);
            return {
              ...issue,
              upvotes: hasUpvoted 
                ? issue.upvotes.filter(id => id !== currentUser)
                : [...issue.upvotes, currentUser]
            };
          }
          return issue;
        })
      );
    } catch (err) {
      console.error('Error toggling upvote:', err);
      // You could show a toast notification here
    }
  };

  // Toggle read more/less
  const toggleExpanded = (issueId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  // Handle filter change
  const handleFilterChange = (category) => {
    setActiveFilter(category);
    fetchIssues(category);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status styling
  const getStatusStyle = (status) => {
    const styles = {
      'pending': 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-800',
      'in progress': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
      'resolved': 'bg-gradient-to-r from-green-400 to-green-500 text-white',
      'rejected': 'bg-gradient-to-r from-red-400 to-red-500 text-white'
    };
    return styles[status] || styles.pending;
  };

  // Initialize component
  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-5">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-4"></div>
          <span className="text-white text-xl">Loading issues...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => fetchIssues(activeFilter)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          {/* Create Issue Button */}
          <div className=" absolute top-0 right-0 z-50 m-4">
            <button
              onClick={() => navigate('/createIssue')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg backdrop-blur-sm border border-white/20"
            >
              <Plus className="w-5 h-5" />
              Create Issue
            </button>
          </div>
          
          {/* Header Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Community Issues
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Help make your community better by reporting and upvoting issues
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleFilterChange(category.value)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 backdrop-blur-md ${
                activeFilter === category.value
                  ? 'bg-white/20 border-white/80 text-white shadow-lg transform -translate-y-1'
                  : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/20 hover:border-white/50 hover:transform hover:-translate-y-1'
              }`}
            >
              <Filter className="inline w-4 h-4 mr-2" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Issues Grid */}
        {issues.length === 0 ? (
          <div className="text-center text-white text-xl">
            <p>No issues found for the selected category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => {
              const isExpanded = expandedCards.has(issue._id);
              const isUpvoted = issue.upvotes.includes(currentUser);
              const shouldTruncate = issue.description.length > 150;

              return (
                <div
                  key={issue._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  {/* Image and Status */}
                  <div className="relative">
                    {issue.image ? (
                      <img
                        src={issue.image}
                        alt={issue.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=200&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusStyle(issue.status)}`}>
                      {issue.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-3 capitalize">
                      {issue.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {issue.title}
                    </h3>

                    {/* Description */}
                    <div className="text-gray-600 mb-4 leading-relaxed">
                      {shouldTruncate && !isExpanded
                        ? `${issue.description.substring(0, 150)}...`
                        : issue.description
                      }
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-blue-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{issue.location?.address || 'Location not specified'}</span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(issue.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {issue.createdBy?.name || 'Unknown User'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* Upvote Button */}
                      <button
                        onClick={() => toggleUpvote(issue._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                          isUpvoted
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-pink-500 shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400 hover:text-pink-500 hover:transform hover:-translate-y-1'
                        }`}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isUpvoted ? 'fill-current scale-110' : ''
                          }`} 
                        />
                        <span className="font-medium">{issue.upvotes.length}</span>
                      </button>

                      {/* Read More Button */}
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpanded(issue._id)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg font-medium"
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesDisplay;