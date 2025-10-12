import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: "https://ats-analyzer-resume.onrender.com/api",
});
// pages/apiClient.js
export function createAnalysisResponse(success, data, message) {
  return { success, data, message };
}

export function createHistoryResponse(success, data, message) {
  return { success, data, message };
}
