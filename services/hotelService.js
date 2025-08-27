"use client";

const API_URL = "http://localhost:5000/api/hotels";
const HOTEL_TAGS_URL = "http://localhost:5000/api/hotel_tags";
const HOTEL_ROOM_TYPES_URL = "http://localhost:5000/api/hotel_room_types";
const ROOM_BASE_PRICE_URL = "http://localhost:5000/api/room_base_price";
const ROOM_TYPES_URL = "http://localhost:5000/api/read/room_types";
const ROOM_INVENTORY_URL = "http://localhost:5000/api/room_inventory";
const HOTEL_IMAGES_URL = "http://localhost:5000/api/hotel_images";
const HOTEL_ORDERS_URL = "http://localhost:5000/api/hotel_orders";
const ORDER_DOGS_URL = "http://localhost:5000/api/order_dogs";
const HOTEL_FAVORITES_URL = "http://localhost:5000/api/hotel_favorites";
const HOTEL_REVIEW_URL = "http://localhost:5000/api/hotel_review";

const getToken = () => localStorage.getItem("loginWithToken");

// 統一處理 API 請求
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
    console.error(`API 錯誤 (${method} ${url}):`, error);
    return null;
  }
};

// 自動附帶 `Authorization`
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
// 所有 C
// 取得所有飯店
export const getAllHotels = async (sortOption = "") => {
  let query = "";
  if (sortOption == "review") query = "?sort=review";
  if (sortOption == "rating") query = "?sort=rating";
  return fetchAPI(`${API_URL}${query}`);
};

// 取得特定飯店
export const getHotelById = async (id) => fetchAPI(`${API_URL}/${id}`);

// 取得飯店總數
export const fetchHotelsCount = async () => fetchAPI(`${API_URL}/count`);

// 取得分頁飯店
export const getPaginatedHotels = async (page = 1, limit = 10) =>
  fetchAPI(`${API_URL}/paginated?limit=${limit}&offset=${(page - 1) * limit}`);

// 篩選飯店
export const getFilteredHotelsS = async (filters) =>
  fetchAPI(`${API_URL}/filter`, "POST", filters);

// 取得負責人飯店
export const getOperatorHotels = async (id) =>
  fetchAuthAPI(`${API_URL}/operator/${id}`);

// 新增飯店
export const createHotel = async (formData) =>
  fetchAuthAPI(API_URL, "POST", formData);

// 更新飯店
export const updateHotel = async (id, formData) =>
  fetchAuthAPI(`${API_URL}/${id}`, "PATCH", formData);

// 軟刪除飯店
export const softDeleteHotel = async (hotelId) =>
  fetchAuthAPI(`${API_URL}/${hotelId}/soft-delete`, "PATCH");

// 更新主圖片
export const updateMainImage = async (hotelId, imageId) =>
  fetchAuthAPI(`${API_URL}/${hotelId}/main-image/${imageId}`, "PATCH");

// 刪除飯店圖片
export const deleteHotelImage = async (hotelId, imageId) =>
  fetchAuthAPI(`${API_URL}/${hotelId}/images/${imageId}`, "DELETE");
// 取得所有標籤
export const getAllTags = async () => fetchAPI(`${HOTEL_TAGS_URL}/tags`);

// 取得飯店標籤
export const getHotelTags = async (hotelId) =>
  fetchAPI(`${HOTEL_TAGS_URL}/${hotelId}`);

// 移除飯店標籤
export const removeHotelTag = async (hotelId, tagId) =>
  fetchAuthAPI(`${HOTEL_TAGS_URL}/${hotelId}/${tagId}`, "PATCH");
//價格
// 取得所有飯店的價格範圍
export const getGlobalPriceRange = async () =>
  fetchAPI(`http://localhost:5000/api/hotels/price-range/all`);
export const getRoomBasePrices = async () => fetchAPI(`${ROOM_BASE_PRICE_URL}`);
export const getHotelPriceRange = async (hotelId) =>
  fetchAPI(`http://localhost:5000/api/hotels/price-range/${hotelId}`);
//房型跟庫存
// 取得所有房型
export const getAllRoomTypes = async () => fetchAPI(ROOM_TYPES_URL);

// 取得飯店房型
export const getHotelRoomById = async (hotelId) =>
  fetchAPI(`${HOTEL_ROOM_TYPES_URL}/hotel/${hotelId}`);

// 新增飯店房型
export const createHotelRoom = async (roomData) =>
  fetchAuthAPI(HOTEL_ROOM_TYPES_URL, "POST", roomData);

// 更新飯店房型
export const updateHotelRoom = async (roomId, updateData) =>
  fetchAuthAPI(`${HOTEL_ROOM_TYPES_URL}/${roomId}`, "PATCH", updateData);

// 刪除飯店房型
export const deleteHotelRoom = async (roomId) =>
  fetchAuthAPI(`${HOTEL_ROOM_TYPES_URL}/${roomId}`, "DELETE");

// 取得房間庫存
export const getRoomInventory = async (hotelId) =>
  fetchAPI(`${ROOM_INVENTORY_URL}/${hotelId}`);

// 更新房間庫存
export const updateRoomInventory = async (roomInventoryId, updateData) =>
  fetchAuthAPI(`${ROOM_INVENTORY_URL}/${roomInventoryId}`, "PATCH", updateData);

//hotel的圖C
export const getAllHotelImages = async () => fetchAPI(HOTEL_IMAGES_URL);
export const getByHotelId = async (hotelId) =>
  fetchAPI(`${HOTEL_IMAGES_URL}/hotel/${hotelId}`);

// 取得所有訂單
export const getAllHotelOrders = async () => fetchAuthAPI(HOTEL_ORDERS_URL);

// 取得特定訂單
export const getOrderById = async (orderId) =>
  fetchAuthAPI(`${HOTEL_ORDERS_URL}/${orderId}`);

// 新增訂單
export const createNewOrder = async (orderData) =>
  fetchAuthAPI(HOTEL_ORDERS_URL, "POST", orderData);

// 更新訂單
export const updateOrder = async (orderId, updateData) =>
  fetchAuthAPI(`${HOTEL_ORDERS_URL}/${orderId}`, "PATCH", updateData);

// 更新訂單狀態
export const changeOrderStatus = async (orderId, status) =>
  fetchAuthAPI(`${HOTEL_ORDERS_URL}/${orderId}/status`, "PATCH", { status });

// 更新訂單付款狀態
export const updateOrderPayment = async (orderId, paymentStatus) =>
  fetchAuthAPI(`${HOTEL_ORDERS_URL}/${orderId}/payment`, "PATCH", {
    paymentStatus,
  });

// 軟刪除訂單
export const softDeleteOrder = async (orderId) =>
  fetchAuthAPI(`${HOTEL_ORDERS_URL}/${orderId}/soft-delete`, "PATCH");

//訂單裡面狗的資料
export const getAllOrderDogs = async () => fetchAuthAPI(ORDER_DOGS_URL);

export const getOrderDogs = async (orderId) =>
  fetchAuthAPI(`${ORDER_DOGS_URL}/${orderId}`);

export const createOrderDog = async (dogData) =>
  fetchAuthAPI(ORDER_DOGS_URL, "POST", dogData);

export const updateOrderDog = async (dogId, updateData) =>
  fetchAuthAPI(`${ORDER_DOGS_URL}/${dogId}`, "PATCH", updateData);

export const deleteOrderDog = async (dogId) =>
  fetchAuthAPI(`${ORDER_DOGS_URL}/${dogId}`, "DELETE");
//END



// 取得使用者收藏
export const getUserFavorites = async () => fetchAuthAPI(HOTEL_FAVORITES_URL);

// 新增收藏
export const addHotelToFavorites = async (hotelId) => {
  const token = localStorage.getItem("token"); // 假設 Token 存在 localStorage

  if (!token) {
    throw new Error("未登入，無法收藏旅館");
  }

  const response = await fetch("http://localhost:5000/api/hotel_favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 加入 Token
    },
    body: JSON.stringify({ hotelId }),
  });

  if (!response.ok) {
    throw new Error(`收藏旅館失敗: ${response.statusText}`);
  }

  return response.json();
};


// 移除收藏
export const removeHotelToFavorites = async (hotelId) =>
  fetchAuthAPI(`${HOTEL_FAVORITES_URL}/${hotelId}`, "DELETE");

// 取得飯店評價
export const getHotelReviews = async (hotelId) =>
  fetchAPI(`${HOTEL_REVIEW_URL}/${hotelId}`);

// 新增評價
export const addHotelReview = async (hotelId, reviewData) =>
  fetchAuthAPI(HOTEL_REVIEW_URL, "POST", { hotelId, ...reviewData });

// 回覆評價
export const replyHotelReview = async (reviewId, replyContent) =>
  fetchAuthAPI(`${HOTEL_REVIEW_URL}/${reviewId}/reply`, "POST", {
    reply: replyContent,
  });

// 刪除評價
export const deleteHotelReview = async (reviewId) =>
  fetchAuthAPI(`${HOTEL_REVIEW_URL}/${reviewId}`, "DELETE");

// 取得平均評價
export const ratingAv = async () => fetchAPI(`${HOTEL_REVIEW_URL}/average`);