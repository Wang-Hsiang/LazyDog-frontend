"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocationSelector } from "@/hooks/useLocationSelector";
import moment from "moment";
import { getAllHotels, getFilteredHotelsS } from "@/services/hotelService";
import styles from "../../../styles/modules/fontHotelHome.module.css";
import Header from "../../components/layout/header";
import HotelCard from "@/app/components/hotel/hotelCard";
import SearchBar from "../../components/hotel/search";
import Aside from "@/app/components/hotel/sideBar";
import Page from "../../components/hotel/page";
import Breadcrumb from "../../components/teacher/breadcrumb";

export default function HotelHomePage() {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  // State 管理
  const [hotels, setHotels] = useState([]); // 所有飯店
  const [filteredHotels, setFilteredHotels] = useState([]); // 篩選後飯店
  const [quantity, setQuantity] = useState(1); // 數量
  const [currentPage, setCurrentPage] = useState(1); // 當前頁數
  const [totalPages, setTotalPages] = useState(1); // 總頁數
  const [isFiltered, setIsFiltered] = useState(false); // 是否已篩選
  const [sortOption, setSortOption] = useState(""); // 排序選項

  // 從 URL 獲取初始參數
  const initialCheckInDate = searchParamsHook.get("checkInDate") || "";
  const initialCheckOutDate = searchParamsHook.get("checkOutDate") || "";
  const initialQuantity = searchParamsHook.get("quantity") || 1;

  // 日期狀態
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);

  // 從 useLocationSelector 獲取位置相關資料
  const {
    location,
    locationModalRef,
    openModal,
    city,
    district,
    closeModal,
    confirmLocation,
    clearLocation,
  } = useLocationSelector();

  // 初始化搜尋參數
  const getInitialSearchParams = () => {
    if (typeof window !== "undefined") {
      const storedParams = sessionStorage.getItem("searchParams");
      return storedParams ? JSON.parse(storedParams) : getDefaultParams();
    }
    return getDefaultParams();
  };

  // 預設搜尋參數
  const getDefaultParams = () => ({
    city: null,
    district: null,
    checkInDate: null,
    checkOutDate: null,
    quantity: 1,
    minPrice: 0,
    maxPrice: 10000,
    roomType: null,
    tags: [],
    rating: null,
  });

  const [searchParams, setSearchParams] = useState(getInitialSearchParams);

  // 將搜尋參數存到 sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("searchParams", JSON.stringify(searchParams));
    }
  }, [searchParams]);

  // 初始化時載入飯店資料
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParams = JSON.parse(sessionStorage.getItem("searchParams"));
      if (storedParams && !isFiltered) {
        handleSearch(storedParams);
      } else if (!isFiltered) {
        fetchAllHotels();
      }
    }
  }, [isFiltered]);

  // 避免 useEffect 觸發多次篩選
  const isFirstRender = useRef(true);

  // 當 isFiltered 為 false 時載入所有飯店
  useEffect(() => {
    let isMounted = true;
    if (!isFiltered && hotels.length === 0) {
      fetchAllHotels().then((hotels) => {
        if (isMounted) setFilteredHotels(hotels || []);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isFiltered]);

  // 監聽 filteredHotels，更新分頁數
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredHotels.length / 10));
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }
  }, [filteredHotels]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  // 確保當前頁數不超過最大頁數
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  // 根據排序選項和篩選條件獲取飯店資料
  useEffect(() => {
    const controller = new AbortController();
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels(sortOption, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          if (!isFiltered) {
            setHotels(data);
          }

          const filteredData = data.filter(
            (hotel) =>
              (!searchParams.city || hotel.city === searchParams.city) &&
              (!searchParams.district ||
                hotel.district === searchParams.district) &&
              (!searchParams.minPrice ||
                hotel.min_price >= searchParams.minPrice) &&
              (!searchParams.maxPrice ||
                hotel.min_price <= searchParams.maxPrice) &&
              (!searchParams.rating || hotel.avg_rating >= searchParams.rating)
          );

          setFilteredHotels(filteredData);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("獲取資料失敗:", error);
        }
      }
    };

    fetchHotels();
    return () => controller.abort();
  }, [sortOption, isFiltered]);

  // 處理搜尋邏輯
  const handleSearch = async (newParams) => {
    await setIsFiltered(true);
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("searchParams", JSON.stringify(updatedParams));
    }
    setSearchParams(updatedParams);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("searchParams", JSON.stringify(updatedParams));
    }

    try {
      const data = await getFilteredHotelsS(updatedParams);
      if (!Array.isArray(data)) {
        console.error("API 回傳的資料格式錯誤:", data);
        setFilteredHotels([]);
      } else {
        setFilteredHotels(data);
      }

      setFilteredHotels(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("篩選錯誤:", error);
      setFilteredHotels([]);
    }
  };

  // 清除篩選條件
  const handleClearFilters = async () => {
    setIsFiltered(false);
    setSortOption("");
    clearLocation();
    const resetParams = getDefaultParams();

    setSearchParams(resetParams);
    sessionStorage.setItem("searchParams", JSON.stringify(resetParams));

    try {
      const data = await getAllHotels();
      setFilteredHotels(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("獲取篩選失敗:", error);
    }
  };

  // 計算當前頁面顯示的飯店
  const indexOfLastHotel = currentPage * 10;
  const indexOfFirstHotel = indexOfLastHotel - 10;
  const currentHotels = (filteredHotels || []).slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  const handleHotelClick = (hotelId) => {
    const storedParams =
      JSON.parse(sessionStorage.getItem("searchParams")) || {};

    const checkIn = storedParams?.checkInDate || "";
    const checkOut = storedParams?.checkOutDate || "";
    const quantity = storedParams?.quantity || 1;

    router.push(
      `/hotel-coupon/fonthotelDetail/${hotelId}?checkInDate=${checkIn}&checkOutDate=${checkOut}&quantity=${quantity}`
    );
  };

  // 獲取所有飯店資料
  const fetchAllHotels = async () => {
    try {
      const hotelData = await getAllHotels();
      setHotels(hotelData);
      setFilteredHotels(hotelData);
    } catch (error) {
      console.error("獲取飯店失敗:", error);
    }
  };
  // console.log(filteredHotels);

  return (
    <>
      <Header />
      <div className={`suBody`}>
        {/* 搜尋欄背景 */}
        <div
          className={styles.suSearchBg}
          // style={{
          //   backgroundImage: `url("/hotel/hotel-images/services-banner-dog-boarding.2203041608391.jpg")`,
          // }}
        >
          <SearchBar
            location={location}
            city={city}
            district={district}
            openModal={openModal}
            closeModal={closeModal}
            locationModalRef={locationModalRef}
            quantity={quantity}
            confirmLocation={confirmLocation}
            clearLocation={clearLocation}
            setQuantity={setQuantity}
            onSearch={handleSearch}
            onClear={handleClearFilters}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInDateChange={setCheckInDate}
            onCheckOutDateChange={setCheckOutDate}
          />
        </div>

        {/* 麵包屑導航 */}
        <div className={`lumi-all-wrapper mt-5`}>
          <div className={styles.breadSpace}>
            <Breadcrumb
              links={[
                { label: "首頁", href: "/" },
                {
                  label: "旅館列表",
                  href: "/hotel-coupon/fonthotelHome",
                  active: true,
                },
              ]}
            />
          </div>
          <div className="text-end me-5">
            {/* <span className="lumi-all-title">排序：</span> */}
            <select
              className={`form-select d-inline w-auto ${styles.selects}`}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">選擇排序方式</option>
              <option value="review">依評價總數排序</option>
              <option value="rating">依星級排序</option>
            </select>
          </div>
        </div>

        {/* 主要內容 */}
        <div className={` ${styles.rwd}`}>
          <div className="container mt-4">
            <div className="row">
              {/* 側邊篩選欄 */}
              <aside className={`col-12 col-md-4 col-lg-3 ${styles.suSidebar}`}>
                <Aside
                  searchParams={searchParams}
                  onSearch={handleSearch}
                  onClear={handleClearFilters}
                />
              </aside>

              {/* 飯店列表 */}
              <section className="col-12 col-md-8 col-lg-9 ">
                <div className="row">
                  {currentHotels.length > 0 ? (
                    currentHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        onClick={() => handleHotelClick(hotel.id)}
                      />
                    ))
                  ) : (
                    <p className="text-center">沒有符合條件的飯店</p>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* 分頁功能 */}
          <Page
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
