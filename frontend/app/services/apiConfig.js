import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${apiUrl}`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
