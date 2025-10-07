import { api } from "./apiConfig";

export const getProduct = async () => {
  const res = await api.get("./product");
  return res.data;
};
export const addProduct = async (products) => {
  const res = await api.post("./product", products);
  return res.data;
};
export const deleteProduct = async (id) => {
  const res = await api.delete(`./product/${id}`);
  return res.data;
};
