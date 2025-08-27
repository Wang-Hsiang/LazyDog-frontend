"use client";

import React, { useState, useEffect } from "react";
import hotelStyles from "../../../styles/modules/fontHotelDetail.module.css";
import Image from "next/image";
import { getHotelRoomById, getRoomInventory } from "@/services/hotelService";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const RoomSelection = ({ hotelId, checkInDate, checkOutDate, quantity }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onAddHotel } = useCart();
  const router = useRouter();
  const loginRoute = "/login";
  const [selectedQuantities, setSelectedQuantities] = useState({});

  // 獲取房型資料
  useEffect(() => {
    if (!hotelId) {
      console.warn("錯誤: `hotelId` 為 undefined，無法載入房型");
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await getHotelRoomById(hotelId);

        if (
          !response ||
          response.status !== "success" ||
          !Array.isArray(response.data)
        ) {
          console.error("API 回傳房型格式錯誤:", response);
          setRooms([]);
          return;
        }

        const roomTypes = response.data;

        if (!Array.isArray(roomTypes) || roomTypes.length === 0) {
          console.warn("API 回傳空的房型資料");
          setRooms([]);
          return;
        }

        // 如果有提供日期，就查詢 `room_inventory`
        const roomData = await Promise.all(
          roomTypes.map(async (room) => {
            let availableRooms = room.quantity; // 預設為 `hotel_room_types.quantity`

            if (checkInDate && checkOutDate) {
              // 從 `room_inventory` 查詢可用數量
              const inventory = await getRoomInventory(
                room.id,
                checkInDate,
                checkOutDate
              );
              // console.log(`${room.room_type_name} 的庫存:`, inventory);

              if (Array.isArray(inventory) && inventory.length > 0) {
                availableRooms = inventory[0].available_quantity;
              }
            }

            return {
              ...room,
              price: room.price_per_night, // 直接用 `price_per_night`
              imageUrl:
                room.image_url && room.image_url.startsWith("http")
                  ? room.image_url
                  : "hotel/hotel-uploads/4-rooms.webp", // 預設圖片，避免 `next/image` 出錯
              available: availableRooms, // 最終可用房數
            };
          })
        );

        console.log("最終要存入 `rooms` state 的資料:", roomData);
        setRooms(roomData);
      } catch (error) {
        console.error("房型載入失敗:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId, checkInDate, checkOutDate]);
  const RoomSelection = ({ hotelId, checkInDate, checkOutDate, quantity }) => {
    useEffect(() => {
      console.log("房型選擇 - checkInDate:", checkInDate);
      console.log(" 房型選擇 - checkOutDate:", checkOutDate);
    }, [checkInDate, checkOutDate]);
  };

  // 處理數量選擇
  const handleQuantityChange = (roomId, quantity) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [roomId]: quantity,
    });
  };

  // 處理加入購物車
  const handleAddToCart = async (room) => {
    // 檢查用戶是否登入
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "請先登入",
        text: "您需要登入才能加入購物車！",
        confirmButtonText: "前往登入",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(loginRoute); // 跳轉到登入頁面
        }
      });
      return;
    }
  
    // 獲取選擇的數量
    const quantity = selectedQuantities[room.id] || 1;
    const storedParams = JSON.parse(sessionStorage.getItem("searchParams"));
    const checkIn = storedParams?.checkInDate || "未選擇";
    const checkOut = storedParams?.checkOutDate || "未選擇";
  
    // 構建要加入購物車的房間資料
    const hotelToAdd = {
      id: room.id, // 房型ID
      hotelId: hotelId, // 旅館ID
      name: room.room_type_name,
      price: room.price,
      imageUrl: room.imageUrl,
      petSize: room.allowed_pet_size,
      provideFood: room.default_food_provided,
      count: quantity,
      checkInDate: checkIn || "未設定",
      checkOutDate: checkOut || "未設定",
    };
    console.log(" 加入購物車的資料:", hotelToAdd);
  
    try {
      // 調用加入購物車的函數
      onAddHotel(hotelToAdd);
  
      // 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "加入購物車成功",
        text: `${room.room_type_name} 已成功加入購物車！`,
        showConfirmButton: false,
        timer: 1500, // 1.5 秒後自動關閉
      });
    } catch (error) {
      console.error("加入購物車失敗:", error);
      Swal.fire({
        icon: "error",
        title: "加入購物車失敗",
        text: "請稍後再試！",
      });
    }
  };

  return (
    <>
      <h4 className="my-5">房型選擇</h4>
      {loading ? (
        <p className="text-center">載入中...</p>
      ) : rooms.length > 0 ? (
        <div className="row mt-4 justify-content-center">
          {rooms.map((room, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className={`card ${hotelStyles.suRoomCard}`}>
                <Image
                  className={hotelStyles.suRoomImage}
                  src={room.imageUrl}
                  alt={room.room_type_name || "房型圖片"}
                  width={300}
                  height={200}
                  unoptimized
                />
                <div className="card-body">
                  <h3 className={`mb-4 ${hotelStyles.room}`}>
                    {room.room_type_name}
                  </h3>
                  <p className={hotelStyles.suRoomPrice}>
                    價格: {Number(room.price).toLocaleString()} 元
                  </p>
                  <p>允許寵物體型: {room.allowed_pet_size}</p>
                  <p>
                    是否提供食物: {room.default_food_provided ? "是" : "否"}
                  </p>
                  <select
                    className={`my-4 form-select ${hotelStyles.select}`}
                    onChange={(e) =>
                      handleQuantityChange(room.id, Number(e.target.value))
                    }
                  >
                    <option className={` ${hotelStyles.option}`} value="">
                      選擇數量
                    </option>
                    {[...Array(room.available).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className={hotelStyles.suRoomBookBtn}
                    disabled={room.available === 0}
                    onClick={() => handleAddToCart(room)}
                    type="button"
                  >
                    {room.available > 0 ? "訂購" : "已滿"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">暫無房型資料</p>
      )}
    </>
  );
};

export default RoomSelection;
