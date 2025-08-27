import { useState, useCallback } from "react";

const useComment = () => {
  const [loading, setLoading] = useState(false); // 加載狀態
  const [error, setError] = useState(null); // 錯誤訊息
  const [data, setData] = useState(null); // 返回的資料
  const [comments, setComments] = useState([]); // 存儲根據使用者 ID 獲取的留言

  // 創建留言
  const createComment = async (commentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData), 
      });
      if (!response.ok) {
        throw new Error(response.statusText || "留言創建失敗");
      }

      const result = await response.json(); // 將響應數據轉換為 JSON
      console.log(result);
      setData(result.article); // 保存返回的資料
      return result; // 返回資料供組件使用
    } catch (err) {
      setError(err.message || "留言創建失敗"); // 設置錯誤訊息
      throw err; // 拋出錯誤供組件處理
    } finally {
      setLoading(false); // 結束加載
    }
  };

  // 刪除留言
  const deleteComment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText || "留言刪除失敗");
      }

      const result = await response.json(); // 將響應數據轉換為 JSON
      setData(result.article); // 保存返回的資料
      return result; // 返回資料供組件使用
    } catch (err) {
      setError(err.message || "留言刪除失敗"); // 設置錯誤訊息
      throw err; // 拋出錯誤供組件處理
    } finally {
      setLoading(false); // 結束加載
    }
  };

  // 根據使用者 ID 獲取留言
  const getComments = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/comment/author/${userId}`);
  
      if (!response.ok) {
        throw new Error(response.statusText || "獲取留言失敗");
      }
  
      const result = await response.json();
      setComments(result);
      return result.length === 0 ? -1 : result; // 如果沒有留言，回傳 -1
    } catch (err) {
      setError(err.message || "獲取留言失敗");
      return -1; // 錯誤時回傳 -1
    } finally {
      setLoading(false);
    }
  };
  

  return {
    createComment,
    deleteComment,
    getComments,
    loading,
    error,
    data,
    comments, // 返回根據使用者 ID 獲取的留言
  };
};

export default useComment;
