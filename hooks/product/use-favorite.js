"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import useSWR from "swr";

const FavoriteContext = createContext(null);
FavoriteContext.displayName = "FavoriteContext";
const DetailFavoriteContext = createContext(null);
DetailFavoriteContext.displayName = "DetailFavoriteContext";
const CardFavoriteContext = createContext(null);
CardFavoriteContext.displayName = "CardFavoriteContext";

export function FavoriteProvider({ children }) {
  // 辨識身份
  const { user } = useAuth();
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 宣告SWR url來源
  const favoriteAPI = "http://localhost:5000/api/products/favorite";
  // 使用SWR獲得收藏資料
  const {
    data: favoriteData,
    isLoading: favoriteLoading,
    error: favoriteError,
    mutate: favoriteMutate,
  } = useSWR(favoriteAPI, fetcher);
  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    const updateFavorite = async () => {
      // 預設寫入資料庫方式為PATCH
      let methodType = "PATCH";
      if (favoriteData?.data) {
        // 如果沒有該使用者的收藏資料則變更為POST
        if (!favoriteData?.data.find((v) => v.user_id === user?.id)) {
          methodType = "POST";
        }
      }
      // 如果使用者已登入
      if (user?.id > 0) {
        // 建立寫入資料庫用表單
        const formData = new FormData();
        formData.append("userID", user?.id);
        formData.append("productIDlist", favorite.join(","));
        let API = "http://localhost:5000/api/products/favorite";
        // 發送寫入資料庫請求
        try {
          const res = await fetch(API, {
            method: methodType,
            body: formData,
          });
          const result = await res.json();
          if (result.status != "success") throw new Error(result.message);
        } catch (error) {
          console.log(error);
          alert(error.message);
        }
      }
      // 更新收藏資料
      favoriteMutate();
    };
    updateFavorite();
  }, [favorite]);
  return (
    <FavoriteContext.Provider
      value={{
        favorite,
        setFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function DetailFavoriteProvider({ children }) {
  const query = useSearchParams();
  const product = query.get("productID");
  // 辨識身份
  const { user } = useAuth();
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 宣告SWR url來源
  const favoriteAPI = "http://localhost:5000/api/products/favorite";
  // 使用SWR獲得收藏資料
  const {
    data: favoriteData,
    isLoading: favoriteLoading,
    error: favoriteError,
    mutate: favoriteMutate,
  } = useSWR(favoriteAPI, fetcher);
  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    const updateFavorite = async () => {
      // 預設寫入資料庫方式為PATCH
      let methodType = "PATCH";
      if (favoriteData?.data) {
        // 如果沒有該使用者的收藏資料則變更為POST
        if (!favoriteData?.data.find((v) => v.user_id === user?.id)) {
          methodType = "POST";
        }
      }
      // 如果使用者已登入
      if (user?.id > 0) {
        // 建立寫入資料庫用表單
        const formData = new FormData();
        formData.append("userID", user?.id);
        formData.append("productIDlist", favorite.join(","));
        let API = "http://localhost:5000/api/products/favorite";
        // 發送寫入資料庫請求
        try {
          const res = await fetch(API, {
            method: methodType,
            body: formData,
          });
          const result = await res.json();
          if (result.status != "success") throw new Error(result.message);
        } catch (error) {
          console.log(error);
          alert(error.message);
        }
      }
      // 更新收藏資料
      favoriteMutate();
    };
    updateFavorite();
  }, [favorite]);

  const [heartHover, setHeartHover] = useState(false);
  const [heartState, setHeartState] = useState(false);
  useEffect(() => {
    // 判斷是否為收藏
    if (favorite?.includes(product)) {
      // 如果是收藏點亮愛心
      setHeartState(true);
    } else {
      // 如果不是收藏隱藏愛心
      setHeartState(false);
    }
  }, [favorite]);
  return (
    <DetailFavoriteContext.Provider
      value={{
        favorite,
        setFavorite,
        heartHover,
        setHeartHover,
        heartState,
        setHeartState,
      }}
    >
      {children}
    </DetailFavoriteContext.Provider>
  );
}

export function CardFavoriteProvider({
  children,
  productID = "",
  favorite = [],
  setFavorite = () => {},
}) {
  // 辨識身份
  const { user } = useAuth();
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 宣告SWR url來源
  const favoriteAPI = "http://localhost:5000/api/products/favorite";
  // 使用SWR獲得收藏資料
  const {
    data: favoriteData,
    isLoading: favoriteLoading,
    error: favoriteError,
    mutate: favoriteMutate,
  } = useSWR(favoriteAPI, fetcher);
  // 依據收藏資料更動後更新收藏資料確保收藏為最新資料
  useEffect(() => {
    favoriteMutate();
    if (favoriteData?.data) {
      const userFavorite = favoriteData?.data.find(
        (v) => v.user_id == user?.id
      );
      if (userFavorite?.productID_list) {
        setFavorite(userFavorite?.productID_list.split(","));
      }
    }
  }, [favoriteData]);

  const [heartHover, setHeartHover] = useState(false);
  const [heartState, setHeartState] = useState(false);
  // 判斷是否為收藏
  useEffect(() => {
    if (favorite?.includes(productID)) {
      // 如果是收藏點亮愛心
      setHeartState(true);
    } else {
      // 如果不是收藏隱藏愛心
      setHeartState(false);
    }
  }, [favorite]);
  return (
    <CardFavoriteContext.Provider
      value={{
        favorite,
        setFavorite,
        heartHover,
        setHeartHover,
        heartState,
        setHeartState,
        productID,
      }}
    >
      {children}
    </CardFavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext) || {};
export const useDetailFavorite = () => useContext(DetailFavoriteContext) || {};
export const useCardFavorite = () => useContext(CardFavoriteContext) || {};
