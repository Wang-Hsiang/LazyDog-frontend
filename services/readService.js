"use client";

const READ_API_URL = "http://localhost:5000/api/read";

const getToken = () => localStorage.getItem("loginWithToken");

// 查詢優惠券的限制條件
export const fetchCouponRestriction = async (couponId) => {
  const res = await fetch(`${READ_API_URL}/coupon_restrictions/${couponId}`, {
    method: "GET",
  });
  return await res.json();
};

// 查詢所有標籤
export const fetchAllTags = async () => {
  const res = await fetch(`${READ_API_URL}/tags`, { method: "GET" });
  return await res.json();
};

// 查詢某個飯店的標籤
export const fetchHotelTag = async (hotelId) => {
  const res = await fetch(`${READ_API_URL}/hotel_tags/${hotelId}`, {
    method: "GET",
  });
  return await res.json();
};
