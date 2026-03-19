import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const uploadEegFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchBlockchain = async () => {
  const response = await axios.get(`${API_BASE_URL}/blocks`);
  return response.data;
};
