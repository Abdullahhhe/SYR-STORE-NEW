import { api } from "./apiConfig";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const getUsers = async () => {
  const res = await api.get("./users");
  return res.data;
};
export const addUsers = async (usersData) => {
  const res = await api.post("./users", usersData);
  return res.data;
};
export const deleteUsers = async (id) => {
  const res = await api.delete(`./users/${id}`);
  return res.data;
};

import axios from "axios";

export const loginUser = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);

  try {
    const res = await axios.post(
      `${apiUrl}/users/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Login response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${apiUrl}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateUser = async (id, updatedData) => {
  try {
    const res = await api.put(`./users/${id}`, updatedData);
    return res.data;
  } catch (err) {
    console.error("خطأ في التحديث:", err);
    throw err;
  }
};
