"use client";

const API_URL = "http://localhost:5000/teacher";

const getToken = () => localStorage.getItem("loginWithToken");

//  統一 處理
const fetchAPI = async (url, method = "GET", body = null) => {
  try {
    const options = { method, headers: {} };
    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(` API 錯誤 (${method} ${url}):`, error);
    return null;
  }
};

//  自動附帶 `Authorization`
const fetchAuthAPI = async (url, method = "GET", body = null) => {
  const token = getToken();
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);
  return fetchAPI(url, method, body);
};


export const updateCourse = async (id, formData) =>
  fetchAuthAPI(`${API_URL}/mycourse/${id}`, "PUT", formData);