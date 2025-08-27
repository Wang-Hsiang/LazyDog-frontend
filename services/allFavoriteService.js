"use client";

const PRODUCTS_FAVORITE_URL = "http://localhost:5000/api/products/favorite";
const HOTEL_FAVORITE_URL = "http://localhost:5000/api/hotel_favorites";
const COURSE_FAVORITE_URL = "http://localhost:5000/api/course_favorites";

const getToken = () => localStorage.getItem("loginWithToken");

export const getId = async (productId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    if (!res.ok) throw new Error("獲取商品詳細資訊失敗");
    return await res.json();
  } catch (error) {
    return null;
  }
};
// 取得用戶收藏的產品
export const getProductFavorites = async () => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  try {
    const res = await fetch(`${PRODUCTS_FAVORITE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("獲取產品收藏失敗");

    const response = await res.json();
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 移除用戶產品收藏

export const deleteProductFavorite = async () => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  try {
    const res = await fetch(`${PRODUCTS_FAVORITE_URL}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("移除產品收藏失敗");
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 取得用戶收藏
export const getHotelFavorites = async () => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  if (!userId) return { success: false, error: "無法獲取用戶 ID" };

  try {
    const res = await fetch(`${HOTEL_FAVORITE_URL}?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("獲取hotel收藏失敗");
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 新增收藏
export const addHotelFavorite = async (hotelId) => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  try {
    const res = await fetch(HOTEL_FAVORITE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hotel_id: hotelId }),
    });

    const result = await res.json();

    // **確保讀取到最內層的 success**
    if (result.success && result.data?.success) {
      return { success: true, message: result.data.message || "收藏成功" };
    }

    throw new Error(result.message || "新增 hotel 收藏失敗");
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 移除收藏
export const removeHotelFavorite = async (id) => {
  if (!id) {
    console.error("無效的收藏 ID");
    return { success: false, error: "無效的收藏 ID" };
  }

  const token = getToken();
  if (!token) {
    console.error("未登入，無法刪除收藏");
    return { success: false, error: "請先登入" };
  }

  console.log("Removing favorite for hotel ID:", id);
  console.log("Token used for request:", token);

  try {
    const res = await fetch(`${HOTEL_FAVORITE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message || "移除收藏失敗");
    }

    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 取得用戶收藏的課程
export const getCourseFavorites = async (userId) => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  try {
    const res = await fetch(`${COURSE_FAVORITE_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("獲取課程收藏失敗");

    const response = await res.json();
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 新增課程收藏
export const addCourseFavorite = async (courseId) => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  try {
    console.log("新增收藏，課程 ID:", courseId);

    const res = await fetch(COURSE_FAVORITE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId, course_id: courseId }),
    });

    const result = await res.json();
    console.log("API 返回:", result);

    if (!res.ok) throw new Error(result.message || "新增課程收藏失敗");

    return { success: true, message: "收藏成功", data: result };
  } catch (error) {
    console.error("收藏課程失敗:", error.message);
    return { success: false, error: error.message };
  }
};

// 移除課程收藏
export const removeCourseFavorite = async (favoriteId) => {
  const token = getToken();
  if (!token) return { success: false, error: "請先登入" };

  if (!favoriteId) {
    return { success: false, error: "找不到收藏 ID" };
  }

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  try {
    const res = await fetch(
      `${COURSE_FAVORITE_URL}/${favoriteId}?user_id=${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: "移除收藏" };
    }

    throw new Error(result.message || "移除課程收藏失敗");
  } catch (error) {
    console.error("移除收藏失敗:", error.message);
    return { success: false, error: error.message };
  }
};
