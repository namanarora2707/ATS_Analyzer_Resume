import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: "https://ats-analyzer-resume.onrender.com/api",
});
