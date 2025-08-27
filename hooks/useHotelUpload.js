"use client";
import { useRef, useState } from "react";
import { createHotel, updateHotel } from "@/services/hotelService";

export const usePhotoUpload = (
  defaultAvatar = "/hotel/hotel-images/page-image/Dog5.png"
) => {
  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const uploadPhoto = () => {
    fileInputRef.current.click();
  };

  const fileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);

      // 預覽第一張圖片
      const reader = new FileReader();
      reader.onload = () => {
        if (avatarRef.current) {
          avatarRef.current.src = reader.result;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // 送出飯店資訊（新增或更新）
  const submitHotel = async (hotelData, hotelId = null) => {
    const formData = new FormData();
    formData.append("name", hotelData.name);
    formData.append("location", hotelData.location);
    selectedFiles.forEach((file) => formData.append("images", file)); // 把選擇的圖片放入 FormData

    try {
      let response;
      if (hotelId) {
        response = await updateHotel(hotelId, formData);
      } else {
        response = await createHotel(formData);
      }

      if (response.success) {
        console.log("成功:", response);
      } else {
        console.error("失敗:", response.message);
      }
    } catch (error) {
      console.error("API 錯誤", error);
    }
  };

  // 刪除已選擇的圖片
  const deletePhoto = () => {
    if (avatarRef.current) {
      avatarRef.current.src = defaultAvatar;
    }
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    avatarRef,
    uploadPhoto,
    fileChange,
    deletePhoto,
    submitHotel,
  };
};
