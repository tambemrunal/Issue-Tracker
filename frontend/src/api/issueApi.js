// src/api/issueApi.js
import axiosInstance from './axiosInstance';

export const createIssue = async ({
  title,
  description,
  category,
  location,
  createdBy,
  imageFile,
}) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("createdBy", createdBy);

    formData.append(
      "location",
      JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        address: location.address,
      })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axiosInstance.post("/issues", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error - createIssue:", error);
    throw error;
  }
};
