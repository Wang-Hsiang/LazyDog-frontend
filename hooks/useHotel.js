import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useHotel(operatorId = null) {
  const { user, loading: authLoading } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelImages, setHotelImages] = useState([]); // 旅館圖片
  const [roomImages, setRoomImages] = useState([]); // 房型圖片
  const [token, setToken] = useState(
    typeof window !== "undefined" && localStorage.getItem("loginWithToken")
  );

  const [roomTypes, setRoomTypes] = useState([]); // 房型類型
  const [rooms, setRooms] = useState([]); // 房型資料
  useEffect(() => {
    // console.log("operatorId:", operatorId);
    // console.log("authLoading:", authLoading);
    // console.log("user:", user);

    if (authLoading || !user || !operatorId) return;

    const fetchHotelData = async () => {
      try {
        const token = localStorage.getItem("loginWithToken");
        if (!token) throw new Error("未登入，請重新登入");

        const hotelRes = await fetch(
          `http://localhost:5000/api/hotels/operator/${operatorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!hotelRes.ok) {
          const errorData = await hotelRes.json();
          throw new Error(
            `無法獲取旅館資訊，錯誤碼: ${hotelRes.status}, 錯誤訊息: ${errorData.message}`
          );
        }

        const hotelResult = await hotelRes.json();
        const hotelData = Array.isArray(hotelResult)
          ? hotelResult[0]
          : hotelResult;

        if (!hotelData || !hotelData.id) throw new Error("找不到旅館資料");
        setHotel(hotelData);

        await fetchHotelImages(hotelData.id, token);

        const roomTypeRes = await fetch(
          `http://localhost:5000/api/hotel_room_types/room-types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let roomTypeData = [];
        if (roomTypeRes.ok) {
          const roomTypeResult = await roomTypeRes.json();
          roomTypeData = roomTypeResult.data || [];
          setRoomTypes(roomTypeData);
        }

        const roomImageRes = await fetch(
          `http://localhost:5000/api/hotel_room_types/hotel/${hotelData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let roomImageData = [];
        if (roomImageRes.ok) {
          const roomImageResult = await roomImageRes.json();

          if (roomImageResult && Array.isArray(roomImageResult.data)) {
            roomImageData = roomImageResult.data;
          } else {
            console.warn("房型圖片資料格式不正確:", roomImageResult);
            roomImageData = []; // 確保 roomImageData 是陣列
          }
          setRoomImages(roomImageData);
        }

        const roomRes = await fetch(
          `http://localhost:5000/api/hotel_room_types/operator/${operatorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!roomRes.ok)
          throw new Error(`無法獲取房型，錯誤碼: ${roomRes.status}`);

        const roomResult = await roomRes.json();

        if (roomResult.status == "success" && Array.isArray(roomResult.data)) {
          const mappedRooms = roomResult.data.map((room) => {
            const matchingImage = roomImageData.find(
              (image) => image.room_type_id === room.room_type_id
            );

            return {
              ...room,
              room_type_name:
                roomTypeData.find((rt) => rt.id == room.room_type_id)?.name ||
                "未知房型",
              image_url: matchingImage
                ? `${matchingImage.image_url}?t=${new Date().getTime()}`
                : "/lazydog.png",
            };
          });

          setRooms(mappedRooms);
        } else {
          console.warn("未獲取到房型資料:", roomResult);
        }
      } catch (err) {
        console.error("useHotel API 錯誤:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [operatorId, user, authLoading, token]);

  const fetchHotelImages = async (hotelId, token) => {
    try {
      const hotelImageRes = await fetch(
        `http://localhost:5000/api/hotel_images/hotel/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!hotelImageRes.ok) {
        const errorData = await hotelImageRes.json();
        throw new Error(
          `無法獲取旅館圖片，錯誤碼: ${hotelImageRes.status}, 錯誤訊息: ${errorData.message}`
        );
      }

      const hotelImageResult = await hotelImageRes.json();

      if (hotelImageResult && Array.isArray(hotelImageResult.data)) {
        setHotelImages(hotelImageResult.data);
      } else {
        console.warn(" 旅館圖片資料格式不正確:", hotelImageResult);
      }
    } catch (error) {
      console.error(" 獲取旅館圖片錯誤:", error);
    }
  };

  return {
    hotel,
    loading,
    error,
    hotelImages,
    roomImages,
    roomTypes,
    rooms,
    setRooms,
  };
}
