"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import Swal from "sweetalert2"; // 導入 SweetAlert
import "../../../../html/hotel-coupon/css/fontHotelHome.css";
import hotelStyles from "../../../../styles/modules/fontHotelDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { useGoogleMap } from "@/hooks/useGoogleMap";
import {
  getHotelById,
  getHotelRoomById,
  getRoomInventory,
} from "@/services/hotelService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addHotelFavorite,
  removeHotelFavorite,
  getHotelFavorites,
} from "@/services/allFavoriteService";
import Header from "../../../components/layout/header";
import Breadcrumb from "../../../components/teacher/breadcrumb";
import RoomSelection from "../../../components/hotel/roomSelection";
import { useAuth } from "@/hooks/use-auth";
import useSafeData from "@/hooks/useSafeData";
import styles from "../../../course/_components/courseId.module.css";
export default function HotelDetailPage({ params }) {
  const { id } = params;
  const [favoriteId, setFavoriteId] = useState(null); // 存收藏的 ID

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  // 從 URL 中提取 checkIn 和 checkOut
  const initialCheckInDate = searchParams.get("checkInDate") || "";
  const initialCheckOutDate = searchParams.get("checkOutDate") || "";
  const initialQuantity = searchParams.get("quantity") || 1;

  // 狀態管理
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);
  const didFetch = useRef(false);

  const checkInDateFromUrl = useMemo(
    () => searchParams.get("checkInDate") || "",
    [searchParams]
  );
  const checkOutDateFromUrl = useMemo(
    () => searchParams.get("checkOutDate") || "",
    [searchParams]
  );
  const quantityFromUrl = useMemo(
    () => searchParams.get("quantity") || 1,
    [searchParams]
  );
  // 確保 state 也更新
  useEffect(() => {
    if (checkInDate !== checkInDateFromUrl) setCheckInDate(checkInDateFromUrl);
    if (checkOutDate !== checkOutDateFromUrl)
      setCheckOutDate(checkOutDateFromUrl);
    if (quantity !== quantityFromUrl) setQuantity(quantityFromUrl);
  }, [checkInDateFromUrl, checkOutDateFromUrl, quantityFromUrl]);

  // 獲取旅館資料
  useEffect(() => {
    if (id && !didFetch.current) {
      didFetch.current = true;
      fetchHotelData();
    }
  }, [id]);

  const fetchFavoriteId = async () => {
    if (!id || !user || !token) {
      console.error(" Hotel ID、用戶或 token 未定義，無法獲取收藏");
      return;
    }

    try {
      const result = await getHotelFavorites();

      if (result.success && Array.isArray(result.data)) {
        const favorite = result.data.find(
          (item) => Number(item.hotel_id) === Number(id)
        );

        if (favorite) {
          setFavoriteId(favorite.id);
          setIsFavorite(true);
        } else {
          setFavoriteId(null);
          setIsFavorite(false);
        }
      } else {
        setFavoriteId(null);
        setIsFavorite(false);
      }
    } catch (error) {
      setFavoriteId(null);
      setIsFavorite(false);
    }
  };
  // 獲取旅館資料的函數
  const fetchHotelData = async () => {
    setLoading(true);
    try {
      const hotelData = await getHotelById(id);
      if (!hotelData) {
        console.error("Hotel data is null");
        return;
      }
      setHotel(hotelData);

      // 更新經緯度
      if (hotelData.latitude && hotelData.longitude) {
        setLat(parseFloat(hotelData.latitude));
        setLng(parseFloat(hotelData.longitude));
      }

      // 取得 RoomType
      const roomTypes = await getHotelRoomById(id);
      if (!Array.isArray(roomTypes) || roomTypes.length === 0) {
        console.warn("無房型資料");
        setRooms([]);
        return;
      }

      // 取得房間價格
      const roomData = await Promise.all(
        roomTypes.map(async (room) => {
          const inventory = await getRoomInventory(room.id);
          return {
            ...room,
            price: inventory.length ? inventory[0].price : room.price_per_night,
            available: inventory.length ? inventory[0].available_quantity : 0,
          };
        })
      );
      setRooms(roomData);
    } catch (error) {
      console.error("獲取旅館資訊失敗:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋邏輯
  const handleSearch = async (newParams) => {
    const updatedParams = {
      checkInDate,
      checkOutDate,
      quantity,
      ...newParams,
    };

    // 更新 URL 參數
    const paramsString = new URLSearchParams(
      Object.entries(updatedParams)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : String(value),
        ])
    ).toString();

    router.push(`/hotel-coupon/fonthotelHome?${paramsString}`);
  };

  // 獲取收藏狀態
  useEffect(() => {
    if (id && user?.id && token) {
      console.log("用戶已登入，開始獲取收藏資料");
      fetchFavoriteId();
    }
  }, [id, user, token]);

  // 處理收藏邏輯
  const handleFavorite = async () => {
    if (!user || !user.id) {
      await Swal.fire({
        icon: "warning",
        title: "請先登入",
        text: "您需要登入才能收藏旅館！",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    try {
      if (isFavorite) {
        Swal.fire({
          icon: "info",
          title: "已收藏",
          text: "旅館已在您的收藏清單內！",
        });
        return;
      }
      const response = await addHotelFavorite(id, user.id);
      if (response?.success) {
        setIsFavorite(true);
        setFavoriteId(response.data?.id || null);
        setFavoriteId((prev) => prev);

        Swal.fire({
          icon: "success",
          // title: "收藏成功！",
          text: response.message || "旅館已加入您的收藏清單！",
          showConfirmButton: false,
          timer: 950,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "收藏失敗",
          // text: response?.message || "請稍後再試",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      }
    } catch (error) {
      console.error("收藏操作失敗:", error);
      Swal.fire({
        icon: "error",
        title: "操作失敗",
        // text: error.message || "請稍後再試！",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
    }
  };

  useEffect(() => {
    if (id) {
      const storedFavorite = localStorage.getItem(`favorite_${id}`);
      if (storedFavorite) {
        setIsFavorite(JSON.parse(storedFavorite));
      }
    }
  }, [id]);

  useEffect(() => {
    if (!didFetch.current && id && user?.id && token) {
      didFetch.current = true;
      fetchFavoriteId();
    }
  }, [id, user, token]);

  useEffect(() => {
    if (favoriteId !== null) {
      localStorage.setItem(`favorite_${id}`, JSON.stringify(isFavorite));
    }
  }, [isFavorite]);

  const mapRef = useRef(null);
  useGoogleMap(lat, lng, mapRef);

  return (
    <>
      <Header />
      <div style={{ marginTop: "80px" }}>
        {/* 簡介 */}
        <div className={`container mt-5 ${hotelStyles.container}`}>
          <Breadcrumb
            links={[
              { label: "首頁 ", href: "/" },
              { label: "旅館列表", href: "/hotel-coupon/fonthotelHome" },
              {
                label: "旅館介紹",
                href: `/hotel-coupon/fonthotelDetail/${id}`,
                active: true,
              },
            ]}
          />
          {loading ? (
            <p className="text-center mt-5">載入中...</p>
          ) : hotel ? (
            <>
              <div className="mt-5 row">
                <div className="col-lg-6">
                  <img
                    src={hotel?.main_image_url || "/hotel/location.png"}
                    alt={hotel?.name || "飯店圖片"}
                    className={hotelStyles.suHotelImage}
                  />
                </div>
                <div
                  className={`col-lg-6 ps-5 ${hotelStyles.suHotelDescription}`}
                >
                  <h3 className="mb-5 text-center">
                    {hotel.name}
                    <div
                      onClick={handleFavorite}
                      className={`me-5 `}
                      style={{
                        cursor: "pointer",
                        float: "right",
                        color: "#ff9538",
                      }}
                    >
                      {isFavorite ? (
                        <FaHeart className="fs-4" />
                      ) : (
                        <FaRegHeart className="fs-4" />
                      )}
                    </div>
                  </h3>
                  {/* <p>入住時間: {checkInDate}</p>
                <p>退房時間: {checkOutDate}</p>
                <p>數量: {quantity}</p> */}
                  {/* 測試用 */}
                  <p className={hotelStyles.suIntroduce}>
                    {hotel.introduce || "暫無介紹"}
                  </p>
                </div>
              </div>

              {/* 房型選擇 */}
              <RoomSelection
                hotelId={id}
                checkIn={checkInDate}
                checkOut={checkOutDate}
              />
            </>
          ) : (
            <p className="text-center">飯店不存在</p>
          )}
        </div>
        {/* 我們的努力 */}
        <div style={{ width: "100%" }}>
          <img
            style={{ width: "100%" }}
            className=""
            src="/teacher-img/rice.png"
            alt=""
          />
        </div>
        <div className={hotelStyles.suEffortSection}>
          <div className={`container text-center ${hotelStyles.container}`}>
            <h2 className={`mb-4 ${hotelStyles.suEffortTitle}`}>
              我們的努力，看的見
            </h2>
            <p className={`mb-5 ${hotelStyles.suEffortSubtitle}`}>
              每一次陪伴、每一小時的付出，都為毛孩創造更快樂、更健康的生活！
            </p>
            <div className={`${hotelStyles.suEffortStats}`}>
              {[
                { img: "Dog2.png", text: "總服務時數：8,520+ 小時" },
                { img: "Dog5.png", text: "服務狗狗：1,200+ 隻" },
                { img: "Mask group.png", text: "滿意度：98.7%" },
              ].map((item, index) => (
                <div key={index} className={hotelStyles.suStatItem}>
                  <Image
                    className={`mb-4 ${hotelStyles.suStatImage}`}
                    src={`/hotel/hotel-images/page-image/${item.img}`}
                    alt={item.text}
                    width={150}
                    height={150}
                  />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <div className={`mt-4 ${hotelStyles.suEffortButtons}`}>
              <button
                className={`btn ${hotelStyles.suBtnPrimary}`}
                onClick={() => router.push("/hotel-coupon/fonthotelHome")}
              >
                立即預約
              </button>
              <button
                className={`btn ${hotelStyles.suBtnOutlineLight}`}
                onClick={() => router.push("/")}
              >
                了解更多
              </button>
            </div>
          </div>
        </div>
        {/* Google 地圖 */}
        <div className={hotelStyles.suMapContainer}>
          {lat && lng ? (
            <div ref={mapRef} style={{ height: "500px", width: "100%" }}></div>
          ) : (
            <p className="text-center">
              無法載入地圖，請確認旅館是否有經緯度數據。
            </p>
          )}
        </div>
      </div>
    </>
  );
}
