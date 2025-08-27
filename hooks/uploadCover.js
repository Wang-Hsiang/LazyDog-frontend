"use client"
import { useState } from 'react';
const useUploadCover = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // 確保這裡定義了 error 和 setError
  
    const uploadCover = async (file) => {
      
      if (!file) {
        setError("No file selected");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file); 
       
        const response = await fetch("http://localhost:5000/api/articles/upload/cover", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Upload failed: " + response.statusText); // 更詳細的錯誤處理
        }
  
        // 解析返回的 JSON 數據
        const data = await response.json();
        if (!data.article_img) {
          throw new Error("Invalid response from server: article_img missing");
        }
  
        // 直接回傳圖片 URL，而不包裝在物件裡
        return `${data.article_img}`;
      } catch (err) {
        setError(err.message); // 捕獲錯誤並設置錯誤訊息
        return null;
      } finally {
        setIsLoading(false);
      }
    };
  
    return { uploadCover }; // 返回 error 和 setError
  };
  
  export default useUploadCover;
  