import axios from "axios";

const api = axios.create({
  //baseURL: "https://localhost:7160/api",
  baseURL: "https://mcri-studentportal-api.onrender.com/api",
});

export default api;
