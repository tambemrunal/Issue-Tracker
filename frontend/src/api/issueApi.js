// src/api/issueApi.js

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

    const response = await fetch("/api/issues", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Issue creation failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error - createIssue:", error);
    throw error;
  }
};
