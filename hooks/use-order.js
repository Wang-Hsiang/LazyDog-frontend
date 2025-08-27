// hooks/use-order.js
"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify"; // 確保有引入 toast

export function useOrder() {
  const [orders, setOrders] = useState([]); // 儲存訂單資料
  const [isLoading, setIsLoading] = useState(false); // 是否正在載入資料
  const [error, setError] = useState(null); // 錯誤訊息
  const [hotelOrders, setHotelOrders] = useState([]);
  const [courseOrders, setCourseOrders] = useState([]);
  // 創建商品訂單的函數
  const createProductOrder = async (orderData) => {
    setIsLoading(true); // 開始載入資料
    setError(null); // 清空錯誤訊息

    try {
      const res = await fetch("http://localhost:5000/order/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setIsLoading(false); // 請求失敗時停止載入
        throw new Error(errorData.message || "創建訂單失敗");
      }

      const result = await res.json();
      if (result.status === "error") {
        setIsLoading(false); // 請求失敗時停止載入
        throw new Error(result.message);
      }

      console.log("訂單創建成功:", result);
      toast.success("訂單創建成功");
      setIsLoading(false); // 請求成功時停止載入
    } catch (err) {
      console.error("創建訂單錯誤:", err);
      setError(err.message);
      toast.error(`創建訂單失敗: ${err.message}`);
      setIsLoading(false);
    }
  };

  //創建旅館訂單的函數
  const createHotelOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/order/hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setIsLoading(false);
        throw new Error(errorData.message || "創建旅館訂單失敗");
      }

      const result = await res.json();
      if (result.status === "error") {
        setIsLoading(false);
        throw new Error(result.message);
      }

      console.log("旅館訂單創建成功:", result);
      toast.success("旅館訂單創建成功");
      setIsLoading(false);
    } catch (err) {
      console.error("創建旅館訂單錯誤:", err);
      setError(err.message);
      toast.error(`創建旅館訂單失敗: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 創建課程訂單的函數
  const createCourseOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/order/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setIsLoading(false);
        throw new Error(errorData.message || "創建課程訂單失敗");
      }

      const result = await res.json();
      if (result.status === "error") {
        setIsLoading(false);
        throw new Error(result.message);
      }

      console.log("課程訂單創建成功:", result);
      toast.success("課程訂單創建成功");
      setIsLoading(false);
    } catch (err) {
      console.error("創建課程訂單錯誤:", err);
      setError(err.message);
      toast.error(`創建課程訂單失敗: ${err.message}`);
      setIsLoading(false);
    }
  };


  // 
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // 開始載入資料
      setError(null); // 清空錯誤訊息

      // 從 localStorage 取得 token
      const token = localStorage.getItem("loginWithToken");

      // 如果沒有 token，表示使用者未登入
      if (!token) {
        console.log("使用者未登入，無法獲取訂單資訊。");
        setIsLoading(false); // 停止載入
        return; // 停止執行後續程式碼
      }

      let userId;
      try {
        const decoded = jwtDecode(token); // 解碼 token
        userId = decoded.id; // 取得 userId
        // console.log(userId);
      } catch (err) {
        console.log(err);
        setError("token錯誤"); // 設定錯誤訊息
        setIsLoading(false); // 停止載入
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/order/productOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 在 Authorization header 中傳送 token (should be modified to use bearer)
          },
        });

        if (!res.ok) {
          setIsLoading(false);
          throw new Error("無法取得訂單資料"); // 如果請求失敗，拋出錯誤
        }

        const result = await res.json();
        if (result.status === "error") {
          setIsLoading(false);
          throw new Error(result.message); // 如果API回傳狀態是error，拋出錯誤
        }
        // console.log(result.orders[0].imageResult);

        // 將 productID_list, price_list, amount_list 轉換為陣列
        // const formattedOrders = result.orders.map((order) => ({
        //   ...order,
        //   productID_list: order.productID_list
        //     ? order.productID_list.split(",")
        //     : [],
        //   price_list: order.price_list
        //     ? order.price_list.split(",").map(Number)
        //     : [],
        //   amount_list: order.amount_list
        //     ? order.amount_list.split(",").map(Number)
        //     : [],
        // }));
        // console.log(formattedOrders);
        setOrders(result.orders);
        // setOrders(formattedOrders); // 更新訂單資料
        // setIsLoading(false); // 結束載入 (成功)
      } catch (err) {
        setError(err.message); // 設定錯誤訊息
        setIsLoading(false); // 結束載入 (失敗)
      }
    };
    const fetchHotelOrders = async () => {
      setIsLoading(true);
      setError(null);

      // 從 localStorage 取得 token
      const token = localStorage.getItem("loginWithToken");

      // 如果沒有 token，表示使用者未登入
      if (!token) {
        console.log("使用者未登入，無法獲取酒店訂單資料。");
        setIsLoading(false); // 停止載入
        return; // 停止執行後續程式碼
      }

      let userId;
      try {
        const decoded = jwtDecode(token); // 解碼 token
        userId = decoded.id; // 取得 userId
      } catch (err) {
        console.log(err);
        setError("token錯誤"); // 設定錯誤訊息
        setIsLoading(false); // 停止載入
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/order/hotelOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 在 Authorization header 中傳送 token
          },
        });

        if (!res.ok) {
          setIsLoading(false);
          throw new Error("無法取得訂單資料");
        }

        const result = await res.json();
        if (result.status === "error") {
          setIsLoading(false);
          throw new Error(result.message);
        }
        // console.log(result.hotelImages);

        setHotelOrders(result.orders); // 更新酒店訂單資料
        setIsLoading(false); // 結束載入 (成功)
      } catch (err) {
        setError(err.message); // 設定錯誤訊息
        setIsLoading(false); // 結束載入 (失敗)
      }
    };
    const fetchCourseOrders = async () => {
      setIsLoading(true);
      setError(null);
  
      const token = localStorage.getItem("loginWithToken");
  
      if (!token) {
        console.log("使用者未登入，無法獲取課程訂單資料。");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/order/courseOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          setIsLoading(false);
          throw new Error("無法取得課程訂單資料");
        }
  
        const result = await res.json();
        if (result.status === "error") {
          setIsLoading(false);
          throw new Error(result.message);
        }
        setCourseOrders(result.orders);
      } catch (err) {
        setError(err.message);
      }finally {
        setIsLoading(false);
      }
    };
    fetchCourseOrders();
    fetchHotelOrders();
    fetchOrders();
  }, []); // dependency array 為空，確保只執行一次

  return {
    orders,
    hotelOrders,
    courseOrders,
    isLoading,
    error,
    createProductOrder,
    createHotelOrder,
    createCourseOrder,
  }; // 回傳訂單資料、載入狀態和錯誤訊息 ,createOrder
}
