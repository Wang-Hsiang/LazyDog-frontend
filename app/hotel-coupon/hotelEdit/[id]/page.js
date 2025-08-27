"use client";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import styles from "../../../../styles/modules/operatorCamera.module.css";
import { useHotel } from "@/hooks/useHotel";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import hotelStyles from "../../../../styles/modules/operatorHotel.module.css";
import Header from "../../../components/layout/header";
import My from "../../../components/hotel/my";

export default function HotelEditPage() {
  const router = useRouter();
  const { id } = useParams(); // 取得旅館 ID
  const {
    hotel,
    hotelImages,
    roomImages,
    rooms: hotelRooms,
    roomTypes,
  } = useHotel(id);

  // 取得旅館資訊 + 圖片
  const imageUploadRef = useRef(null);
  const [images, setImages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomImagesState, setRoomImagesState] = useState([]); // 房型圖片
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [newRoomQuantity, setNewRoomQuantity] = useState(1);
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomImage, setNewRoomImage] = useState(null);
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomPetCapacity, setNewRoomPetCapacity] = useState("");
  const [newRoomAllowedSize, setNewRoomAllowedSize] = useState("");
  const [newRoomFoodProvided, setNewRoomFoodProvided] = useState("");

  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/hotel/hotel-images/page-image/Dog5.png");
  const [roomFormData, setRoomFormData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    county: "",
    district: "",
    address: "",
    phone: "",
    businessHours: { open: "", close: "" },
    introduce: "",
  });

  useEffect(() => {
    if (hotelImages) {
      setImages(hotelImages);
    }
  }, [hotelImages]);
  useEffect(() => {
    if (Array.isArray(hotelRooms) && hotelRooms.length > 0) {
      const updatedRooms = hotelRooms.map((room) => ({
        ...room,
        room_type_name:
          roomTypes.find((type) => type.id == room.room_type_id)?.name ||
          "未知房型",
        image_url:
          roomImages.find((img) => img.room_type_id === room.room_type_id)
            ?.image_url || "hotel/hotel-uploads/4-s-room.webp",
      }));
      setRooms([...updatedRooms]); // 確保房型名稱正確
      setRoomImagesState(roomImages); // 設定房型圖片
    }
  }, [hotelRooms, roomTypes, roomImages]); // 確保房型圖片也會觸發更新

  useEffect(() => {
    if (rooms.length > 0) {
      const initialRoomData = {};
      rooms.forEach((room) => {
        initialRoomData[room.id] = {
          quantity: room.quantity,
          price_per_night: room.price_per_night,
          image_url: room.image_url || "/lazydog.png",
          room_type_name: room.room_type_name || "未知房型",
        };
      });
      setRoomFormData(initialRoomData);
    }
  }, [rooms]);

  const handleRoomChange = (roomId, field, value) => {
    setRoomFormData((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };


  // useEffect當 hotel 有資料時，設定 formData
  useEffect(() => {
    if (hotel) {
      let parsedBusinessHours = hotel.business_hours;

      if (typeof hotel.business_hours == "string") {
        try {
          parsedBusinessHours = JSON.parse(hotel.business_hours);
          if (!parsedBusinessHours.open || !parsedBusinessHours.close) {
            parsedBusinessHours = { open: "", close: "" };
          }
        } catch (error) {
          console.error("business_hours JSON 解析失敗:", error);
          parsedBusinessHours = { open: "", close: "" };
        }
      }

      setFormData({
        name: hotel.name || "",
        county: hotel.county || "",
        district: hotel.district || "",
        address: hotel.address || "",
        phone: hotel.phone || "",
        businessHours: parsedBusinessHours || { open: "", close: "" }, 
        introduce: hotel.introduce || "",
      });
    }
  }, [hotel]);
  useEffect(() => {
    console.log("API 回傳的 roomTypes:", roomTypes);
  }, [roomTypes]);
  // 表單
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 營業時間變更
  const handleTimeChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [type]: value },
    }));
  };

  //  確保時間格式
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // 儲存 //不展示
  const handleSave = async () => {
    try {
        const token = localStorage.getItem("loginWithToken");
        if (!token) throw new Error("未登入，請重新登入");

        if (!hotel || !hotel.id) {
            throw new Error("找不到對應的旅館 ID");
        }

        let formattedBusinessHours = formData.businessHours;
        if (!formattedBusinessHours || !formattedBusinessHours.open || !formattedBusinessHours.close) {
            formattedBusinessHours = { open: "", close: "" };
        }

        const updateData = {
            ...formData,
           businessHours: formattedBusinessHours, 
        };

        console.log("送出 PATCH:", JSON.stringify(updateData, null, 2));

        const response = await fetch(
            `http://localhost:5000/api/hotels/${hotel.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            }
        );

        const data = await response.json();
        console.log("🔹 API 回應:", response.status, data);

        if (!response.ok) throw new Error(`更新失敗，錯誤碼: ${response.status}`);

        Swal.fire("成功", "旅館資料已更新", "success").then(() => {
            router.push(`/hotel-coupon/hotel/${id}`);
        });

    } catch (error) {
        console.error(" handleSave 錯誤:", error);
        Swal.fire("錯誤", error.message, "error");
    }
};


  // 設為主圖片
  const handleSetMainImage = async (imageId) => {
    if (!hotel || !hotel.id) {
      Swal.fire("錯誤", "找不到旅館 ID", "error");
      return;
    }

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        `http://localhost:5000/api/hotels/${hotel.id}/main-image/${imageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("無法更新主圖片");

      // 更新前端狀態
      setImages((prevImages) =>
        prevImages.map((img) => ({
          ...img,
          isMain: img.id == imageId, // 標記主圖片
        }))
      );

      Swal.fire("成功", "主圖片已更新", "success").then(() => {});
      router.push(`/hotel-coupon/hotel/${id}`);
    } catch (error) {
      Swal.fire("錯誤", error.message, "error");
    }
  };

  // 刪除圖片
  const handleDeleteImage = async (imageId) => {
    if (!hotel || !hotel.id) {
      Swal.fire("錯誤", "找不到旅館 ID", "error");
      return;
    }

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        `http://localhost:5000/api/hotels/${hotel.id}/image/${imageId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("刪除失敗");

      // 更新前端狀態
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));

      Swal.fire("成功", "圖片已刪除", "success");
    } catch (error) {
      Swal.fire("錯誤", error.message, "error");
    }
  };
  // 上傳圖片
  const handleHotelImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // 確保 key 是 "image"

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const hotelId = hotel?.id; // 確保這是 hotel.id
      console.log("Hotel ID:", hotelId); // 檢查 hotel.id 是否正確

      const response = await fetch(
        `http://localhost:5000/api/hotels/${hotelId}/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("圖片上傳失敗");

      const data = await response.json();
      setImages((prevImages) => [
        ...prevImages,
        { id: data.image_id, url: data.image_url, isMain: false },
      ]);

      Swal.fire("成功", "旅館圖片已上傳", "success");
    } catch (error) {
      Swal.fire("錯誤", error.message, "error");
    }
  };
  // 房型圖片上傳
  const handleRoomImageUpload = async (roomId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        `http://localhost:5000/api/hotel_room_types/${roomId}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok || !data.image_url)
        throw new Error(data.error || "圖片上傳失敗");

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, image_url: data.image_url } : room
        )
      );

      Swal.fire("成功", "房型圖片已上傳", "success");
    } catch (error) {
      Swal.fire("錯誤", error.message, "error");
    }
  };

  // 更新房型
  const handleUpdateRoom = async (roomId) => {
    if (!roomId) {
        await Swal.fire("錯誤", "找不到房型 ID", "error");
        return;
    }

    const updatedData = roomFormData[roomId];

    try {
        const token = localStorage.getItem("loginWithToken");
        if (!token) throw new Error("未登入，請重新登入");

        const formData = new FormData();

        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] !== undefined && updatedData[key] !== null && key !== "image_url") {
                formData.append(key, updatedData[key]);
            }
        });

        if (updatedData.imageFile) {
            formData.append("image", updatedData.imageFile);
        }

        const response = await fetch(
            `http://localhost:5000/api/hotel_room_types/${roomId}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "更新失敗");

        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                          ...room,
                          ...updatedData,
                          image_url: data.image_url || room.image_url,
                      }
                    : room
            )
        );

        await Swal.fire("成功", "房型已更新", "success");
    } catch (error) {
        await Swal.fire("錯誤", error.message, "error");
    }
};

  // 刪除房型
  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = await Swal.fire({
      title: "確定要刪除這個房型嗎？",
      text: "刪除後無法恢復！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    });

    if (!confirmDelete.isConfirmed) {
      console.log(" 取消刪除房型");
      return;
    }

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        `http://localhost:5000/api/hotel_room_types/${roomId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "刪除失敗");
      }

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

      await Swal.fire("成功", "房型已刪除", "success");

    } catch (error) {
      await Swal.fire("錯誤", error.message, "error");
    }
  };

  // 新增房型
  const handleAddRoom = async () => {
    if (!selectedRoomType) {
      Swal.fire("錯誤", "請先選擇房型", "error");
      return;
    }

    if (!newRoomPrice || newRoomPrice <= 0) {
      Swal.fire("錯誤", "請輸入有效的價格", "error");
      return;
    }

    if (!newRoomQuantity || newRoomQuantity <= 0) {
      Swal.fire("錯誤", "請輸入有效的房間數量", "error");
      return;
    }
    if (!newRoomImage) {
      Swal.fire("錯誤", "請上傳房型圖片", "error");
      return;
    }
    const formData = new FormData();
    formData.append("hotel_id", hotel?.id); // 必填
    formData.append("room_type_id", selectedRoomType); // 必填
    formData.append("quantity", newRoomQuantity); // 必填
    formData.append("price_per_night", newRoomPrice); // 必填
    formData.append(
      "description",
      newRoomDescription ? newRoomDescription : "無描述"
    );
    formData.append(
      "pet_capacity",
      newRoomPetCapacity && !isNaN(newRoomPetCapacity)
        ? parseInt(newRoomPetCapacity, 10)
        : 0
    );
    formData.append(
      "allowed_pet_size",
      newRoomAllowedSize ? newRoomAllowedSize : "無限制"
    );
    formData.append(
      "default_food_provided",
      newRoomFoodProvided ? newRoomFoodProvided : "否"
    );

    if (newRoomImage) {
      formData.append("image", newRoomImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        "http://localhost:5000/api/hotel_room_types",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "新增房型失敗");
      }

      setRooms((prevRooms) => [
        ...prevRooms,
        {
          id: data.room_id,
          room_type_id: selectedRoomType,
          room_type_name:
            roomTypes.find((type) => type.id == selectedRoomType)?.name ||
            "未知房型",
          quantity: newRoomQuantity,
          price_per_night: newRoomPrice,
          description: newRoomDescription,
          pet_capacity: newRoomPetCapacity,
          allowed_pet_size: newRoomAllowedSize,
          default_food_provided: newRoomFoodProvided,
          image_url: data.image_url || "hotel/loding.jpg",
        },
      ]);

      const updatedRoomsResponse = await fetch(
        `http://localhost:5000/api/hotel_room_types`
      );
      const updatedRooms = await updatedRoomsResponse.json();
      setSelectedRoomType("");
      setNewRoomQuantity(1);
      setNewRoomPrice("");
      setNewRoomDescription("");
      setNewRoomPetCapacity("");
      setNewRoomAllowedSize("");
      setNewRoomFoodProvided("");
      setNewRoomImage(null);
      setRooms(updatedRooms);
      Swal.fire("成功", "房型已新增", "success");
    } catch (error) {
      console.error("新增房型失敗:", error);
      Swal.fire("錯誤", error.message, "error");
    }
  };
  const handleUpdateHotel = async (hotelId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/hotel/${hotelId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire("成功", "旅館資料已更新", "success");
      } else {
        Swal.fire("錯誤", result.error, "error");
      }
    } catch (error) {
      console.error("更新錯誤:", error);
      Swal.fire("錯誤", "更新失敗，請稍後再試", "error");
    }
  };
 

  return (
    <>
      <Header />
      <div className={`container my-5 ${styles.wrapper} `}>
        <div className="row">
          <My />

          <div className="col-12 col-md-9 mx-auto">
            <h3 className="mb-3">編輯旅館資訊</h3>
            <form
              id="editForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateHotel();
              }}
            >
              <div className={`section ${hotelStyles.suSection}`}>
                <h5 className="mb-3">基本資訊</h5>
                <div className="mb-3">
                  <label className="mb-2">
                    旅館名稱 <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${hotelStyles.suFormControl}`}
                  />
                </div>

                {/*  地址輸入：分為 縣市、區、詳細地址 */}
                <div className="mb-3">
                  <label className="mb-2">縣市</label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className={`form-control ${hotelStyles.suFormControl}`}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2">區</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`form-control ${hotelStyles.suFormControl}`}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2">詳細地址</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-control ${hotelStyles.suFormControl}`}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2">
                    電話 <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${hotelStyles.suFormControl}`}
                  />
                </div>
              </div>

              {/* 旅館圖片：從 API 獲取 */}
              <div className={`section ${hotelStyles.suSection}`}>
                <h5 className="mb-3">旅館圖片</h5>
                <div className="d-flex flex-wrap gap-3 mb-2">
                  {images.length > 0 ? (
                    images.map((img, index) => (
                      <div
                        key={index}
                        className={`${hotelStyles.suImageCard} position-relative`}
                      >
                        {/* 圖片顯示 */}
                        <img
                          src={img.url}
                          alt={`旅館圖片 ${index + 1}`}
                          className={`img-thumbnail ${hotelStyles.suThumbnail}`}
                          style={{
                            maxWidth: "120px",
                            border:
                              img.id == hotel.main_image_id
                                ? "2px solid blue"
                                : "1px solid #ddd",
                          }}
                        />

                        {/* 主圖片標記 */}
                        {hotel.main_image_id == img.id && (
                          <span
                            className={`badge position-absolute top-0 start-0 m-2 ${styles.btn3}`}
                          >
                            主圖片
                          </span>
                        )}

                        {/* 操作按鈕 */}
                        <div className="d-flex flex-column align-items-center mt-2">
                          {hotel.main_image_id !== img.id && (
                            <button
                              type="button"
                              className={`btn btn-sm ${hotelStyles.suMainImageBtn} ${styles.btn3}`}
                              onClick={() => handleSetMainImage(img.id)}
                            >
                              設為主圖片
                            </button>
                          )}

                          <button
                            type="button"
                            className={`btn btn-danger btn-sm mt-1 ${hotelStyles.suDeleteBtn}`}
                            onClick={() => handleDeleteImage(img.id)}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">無圖片可顯示</p>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    ref={imageUploadRef}
                    className="form-control d-none"
                    accept="image/*"
                    onChange={handleHotelImageUpload}
                  />
                  <button
                    type="button"
                    className={`btn btn-sm ${hotelStyles.suUploadBtn} ${styles.btn}`}
                    onClick={() => imageUploadRef.current.click()} // 觸發文件選擇
                  >
                    + 上傳旅館圖片
                  </button>
                </div>
              </div>
              <div className={`card p-3 mb-4 section ${hotelStyles.suSection}`}>
                <h5 className="mb-3">房型管理</h5>

                {/*  顯示現有房型 */}
                {rooms.map((room, index) => (
                  <div
                    key={room.id || index}
                    className="border p-3 mb-2 rounded"
                  >
                    <div className="d-flex align-items-center">
                      {/* 顯示房型圖片 */}
                      <img
                        src={`${room.image_url}?t=${new Date().getTime()}`} // 加上時間戳
                        alt="房型圖片"
                        className="img-thumbnail me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-1">
                          <strong>{room.room_type_name || "未知房型"}</strong>
                          （數量：
                          <input
                            type="number"
                            value={
                              roomFormData[room.id]?.quantity || room.quantity
                            }
                            onChange={(e) =>
                              handleRoomChange(
                                room.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="form-control d-inline-block ms-1"
                            style={{ width: "70px" }}
                          />
                          ）
                        </p>
                        <p className="mb-1">
                          價格：
                          <input
                            type="number"
                            value={
                              roomFormData[room.id]?.price_per_night ||
                              room.price_per_night
                            }
                            onChange={(e) =>
                              handleRoomChange(
                                room.id,
                                "price_per_night",
                                e.target.value
                              )
                            }
                            className="form-control d-inline-block ms-1"
                            style={{ width: "100px" }}
                          />{" "}
                          元
                        </p>
                        <input
                          type="file"
                          className="form-control mt-2"
                          accept="image/*"
                          onChange={(e) => handleRoomImageUpload(room.id, e)}
                        />
                        <div className="mt-2">
                          <button
                            className={`btn btn-sm me-2 ${styles.btn}`}
                            onClick={() => handleUpdateRoom(room.id)}
                          >
                            更新房型
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${styles.btn2}`}
                            onClick={async () =>
                              await handleDeleteRoom(room.id)
                            }
                          >
                            刪除房型
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/*  新增房型 */}
                <hr />
                <h5 className="mb-3">新增房型</h5>

                <label className="mb-2">房型</label>
                <select
                  className="form-control mb-3"
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                >
                  <option value="">請選擇房型</option>
                  {roomTypes.length > 0 &&
                    roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>

                {selectedRoomType && (
                  <>
                    <label>數量</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      value={newRoomQuantity}
                      onChange={(e) => setNewRoomQuantity(e.target.value)}
                    />

                    <label>價格</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(e.target.value)}
                    />

                    <label>描述</label>
                    <textarea
                      className="form-control mb-3"
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      rows="3"
                      placeholder="請輸入房型描述"
                    ></textarea>

                    <label>寵物容納數量</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      value={newRoomPetCapacity}
                      onChange={(e) => setNewRoomPetCapacity(e.target.value)}
                    />

                    <label>允許的寵物大小</label>
                    <select
                      className="form-control mb-3"
                      value={newRoomAllowedSize}
                      onChange={(e) => setNewRoomAllowedSize(e.target.value)}
                    >
                      <option value="">請選擇允許的寵物大小</option>
                      <option value="小型">小型</option>
                      <option value="中型">中型</option>
                      <option value="大型">大型</option>
                    </select>

                    <label>是否提供預設飼料</label>
                    <select
                      className="form-control mb-3"
                      value={newRoomFoodProvided}
                      onChange={(e) => setNewRoomFoodProvided(e.target.value)}
                    >
                      <option value="是">是</option>
                      <option value="否">否</option>
                    </select>

                    <label>上傳圖片</label>
                    <input
                      type="file"
                      className="form-control mb-3"
                      onChange={(e) => setNewRoomImage(e.target.files[0])}
                    />

                    {newRoomImage && (
                      <div className="mb-3">
                        <img
                          src={URL.createObjectURL(newRoomImage)}
                          alt="預覽圖片"
                          className="img-thumbnail"
                          style={{
                            maxWidth: "150px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                    )}

                    <button
                      className="btn btn-primary w-100"
                      onClick={handleAddRoom}
                    >
                      新增房型
                    </button>
                  </>
                )}
              </div>
              {/* 營業時間（統一顯示為一組） */}
              <div className={`section ${hotelStyles.suSection}`}>
                <h5 className="mb-3">營業時間 (適用於星期一到星期日)</h5>
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2" style={{ width: "120px" }}>
                    開門時間
                  </label>
                  <input
                    type="time"
                    name="open"
                    value={formatTime(formData.businessHours.open)}
                    onChange={(e) => handleTimeChange("open", e.target.value)}
                    className="form-control me-2"
                    step="3600"
                    style={{ width: "150px" }}
                  />
                  <span className="me-2">至</span>
                  <input
                    type="time"
                    name="close"
                    value={formatTime(formData.businessHours.close)}
                    onChange={(e) => handleTimeChange("close", e.target.value)}
                    className="form-control"
                    step="3600"
                    style={{ width: "150px" }}
                  />
                </div>
              </div>

              {/* 旅館簡介 */}
              <div className={`section ${hotelStyles.suSection}`}>
                <h5 className="mb-3">旅館簡介</h5>
                <textarea
                  name="introduce"
                  value={formData.introduce}
                  onChange={handleChange}
                  rows="3"
                  className={`form-control ${hotelStyles.suFormControl}`}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className={`btn btn-sm px-4 ${hotelStyles.suBtnSecondary}`}
                  onClick={() => router.push(`/hotel-coupon/hotel/${id}`)}
                >
                  返回
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 ${hotelStyles.suBtnSuccess}`}
                  onClick={handleSave}
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
