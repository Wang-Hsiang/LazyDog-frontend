import { useRef, useState } from "react";

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

  const deletePhoto = () => {
    if (avatarRef.current) {
      avatarRef.current.src = defaultAvatar;
    }
    setSelectedFiles([]); // 清空文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    avatarRef,
    selectedFiles,
    uploadPhoto,
    fileChange,
    deletePhoto,
  };
};

export default usePhotoUpload;