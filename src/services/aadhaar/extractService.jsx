// src/services/extractService.js

import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // change if needed

export const extractAadhaar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await axios.post(
      `${API_BASE}/extract-aadhaar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Extract Service Error:", error);
    throw error;
  }
};