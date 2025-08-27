"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "@/styles/modules/fontHotelHome.module.css";
import GoogleMapComponent from "../../components/hotel/GoogleMapComponent";
import Link from "next/link";
import {
  ratingAv,
  getAllTags,
  getHotelPriceRange,
  getGlobalPriceRange,
  getAllRoomTypes,
} from "@/services/hotelService";
import "nouislider/dist/nouislider.css";
import PriceSlider from "@/app/components/hotel/PriceSlider";

export default function SideBar({
  hotelId,
  onSearch,
  onClear,
  searchParams = {},
}) {
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]); //所有房型
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [hotels, setHotels] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [isSearching, setIsSearching] = useState(true);
  const priceSliderRef = useRef(null);
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    fetchTags();
    fetchRatings();
    fetchPriceRange();
    fetchRoomTypes();

    const loadRoomTypes = async () => {
      try {
        const types = await getAllRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error("獲取房型失敗:", error);
      }
    };

    loadRoomTypes();
  }, []);
  const fetchHotels = async () => {
    try {
      if (isFiltered) return; //  如果已經在篩選，不要載入全部飯店

      const response = await fetch(`http://localhost:5000/api/hotels`);
      if (!response.ok) throw new Error("無法獲取飯店");

      const data = await response.json();
      setHotels(Array.isArray(data) ? data : []);
      if (onSearch) {
        onSearch(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("獲取時發生錯誤:", error);
      setHotels([]);
    }
  };

  useEffect(() => {
    if (!isFiltered) {
      fetchHotels();
    }
  }, [isFiltered]);

  const fetchTags = async () => {
    try {
      const allTags = await getAllTags();
      setTags(Array.isArray(allTags) ? allTags : []);
    } catch (error) {
      console.error("獲取標籤失敗:", error);
      setTags([]);
    }
  };

  const fetchRatings = async () => {
    try {
      const ratingList = await ratingAv();
      setRatings(ratingList || []);
    } catch (error) {
      console.error("獲取評分失敗:", error);
    }
  };
  const fetchRoomTypes = async () => {
    try {
      const types = await getAllRoomTypes();
      setRoomTypes(Array.isArray(types) ? types : []);
    } catch (error) {
      console.error("獲取失敗:", error);
      setRoomTypes([]);
    }
  };

  const fetchPriceRange = async () => {
    try {
      let priceData = hotelId
        ? await getHotelPriceRange(hotelId)
        : await getGlobalPriceRange();
      if (priceData) {
        setMinPrice(priceData.min_price ?? 0);
        setMaxPrice(priceData.max_price ?? 10000);
        if (priceSliderRef.current?.noUiSlider) {
          priceSliderRef.current.noUiSlider.set([
            priceData.min_price,
            priceData.max_price,
          ]);
        }
      }
    } catch (error) {
      console.error("獲取價格範圍失敗:", error);
    }
  };
  const handleFilterChange = (filter = {}) => {
    console.log(" 側邊篩選條件變更:", filter);
    onSearch(filter);
  };

  const toggleFacilities = () => {
    setShowAllFacilities((prev) => !prev);
  };
  const handleTagChange = (tagId) => {
    if (!tagId && tagId !== 0) return;

    const numericTagId = Number(tagId); // 確保是數字
    if (isNaN(numericTagId)) return; // 過濾非數字的值

    setSelectedTags((prev) => {
      return prev.includes(numericTagId)
        ? prev.filter((t) => t !== numericTagId)
        : [...prev, numericTagId];
    });
  };
  const handleApplyFilters = async () => {
    setIsFiltered(true);

    const filterParams = {
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? 10000,
      rating: selectedRating ?? null,
      roomType: selectedRoomType ?? null,
      tags: selectedTags.length > 0 ? selectedTags.map(Number) : [],
    };
    // console.log(filterParams);
    try {
      await onSearch(filterParams, true);
      setIsSearching(false);
    } catch (error) {
      console.error("Sidebar 篩選 API 錯誤:", error);
    }
  };

  const handleClear = async () => {
    setIsFiltered(false);

    if (onClear) {
      onClear();
    }

    setSelectedRoomType("");
    setSelectedTags([]);
    setSelectedRating("");
    setIsSearching(true);

    await fetchPriceRange();

    if (priceSliderRef.current?.noUiSlider) {
      const globalPrice = await getGlobalPriceRange();
      priceSliderRef.current.noUiSlider.set([
        globalPrice.min_price,
        globalPrice.max_price,
      ]);
    }

    await fetchHotels();
  };
  const handlePriceUpdate = (newMinPrice, newMaxPrice) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };

  // console.log(selectedRating);
  return (
    <>
      {/* 桌機 */}
      <div className="d-none d-md-block">
        {/* 固定 */}
        <aside className={`container ${styles.suSidebar}`}>
          {/* 地圖區塊 */}
          <div className={styles.suMapCard}>
            {!showGoogleMaps ? (
              <>
                <button
                  className={`btn ${styles.suMapBtn}`}
                  onClick={() => setShowGoogleMaps(true)}
                >
                  📍 於地圖上顯示
                </button>
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=台灣&zoom=7&size=300x200&maptype=roadmap&key=AIzaSyDfCdeVzmet4r4U6iU5M1C54K9ooF3WrV4`}
                  alt="地圖縮圖"
                  className={styles.suMapImage}
                />
              </>
            ) : (
              <>
                <button
                  className={`btn ${styles.suMapBtn}`}
                  onClick={() => setShowGoogleMaps(false)}
                >
                  返回縮圖
                </button>
                {/*  使用 Google Maps 動態地圖 */}
                <GoogleMapComponent hotels={hotels} />
              </>
            )}
          </div>

          {/* 優質住宿篩選 */}
          <div className={styles.suFilterGroup}>
            <h6 className={styles.suFilterTitle}>飯店評分</h6>
            <select
              className={`form-select ${styles.selects}`}
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">全部</option>
              {[4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} &#9733; 以上
                </option>
              ))}
            </select>
          </div>

          {/* 設施篩選 */}
          <div className={styles.suFilterGroup}>
            <h6 className={styles.suFilterTitle}>設施</h6>

            {/* 根據 showAllFacilities 來決定顯示數量 */}
            {tags.slice(0, showAllFacilities ? tags.length : 5).map((tag) => (
              <div className="form-check ms-1 mb-3" key={tag.id}>
                <input
                  className={`form-check-input ${styles.suCheckbox}`}
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <label
                  className={`form-check-label ${styles.suLabels}`}
                  htmlFor={`tag-${tag.id}`}
                >
                  {tag.name}
                </label>
              </div>
            ))}

            {/* 只有當標籤數超過 5 個時，才顯示切換按鈕 */}
            {tags.length > 5 && (
              <span
                className={styles.suShowMore}
                onClick={() => setShowAllFacilities(!showAllFacilities)}
              >
                {showAllFacilities ? (
                  <>
                    {" "}
                    顯示更少<i className="bi bi-caret-up-fill"></i>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    更多<i className="bi bi-caret-down-fill"></i>{" "}
                  </>
                )}
              </span>
            )}
          </div>
          {/* 房型篩選 */}
          <div className={styles.suFilterGroup}>
            <h6 className={styles.suFilterTitle}>房型篩選</h6>
            <select
              className={`form-select ${styles.selects}`}
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
            >
              <option value="">全部</option>
              {roomTypes.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          {/* 價格篩選 */}
          <div className={styles.suFilterGroup}>
            <h6 className={styles.suFilterTitle}>價格篩選</h6>
            <div className={styles.suPriceInputGroup}>
              <div className={styles.suPriceInput}>
                <label htmlFor="filterMin">最少</label>
                <span>{minPrice} 元</span>
              </div>
              <div className={styles.suPriceInput}>
                <label htmlFor="filterMax">最多</label>
                <span>{maxPrice} 元</span>
              </div>
            </div>

            <PriceSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              onUpdate={handlePriceUpdate}
            />

            {/* 搜尋 / 清除篩選 按鈕 */}
            <button
              className={`btn btn-sm mt-5 ${styles.suClearFilterBtn}`}
              onClick={isSearching ? handleApplyFilters : handleClear}
            >
              {isSearching ? "搜尋" : "清除篩選"}
            </button>
          </div>

          {/* 廣告圖片 */}
          <Link className="text-center" href="#">
            <figure>
              <img
                src="/hotel/hotel-images/page-image/hotelad2.png"
                alt="廣告"
                // className="mx-4"
              />
            </figure>
          </Link>
        </aside>
      </div>
      {/* 手機 */}
      <button
        className={`btn d-md-none ${styles.rightIcon}`}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#filterOffcanvas"
        aria-expanded="false"
        aria-controls="filterOffcanvas"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="filterOffcanvas"
        aria-labelledby="filterOffcanvasLabel"
      >
        <div className="offcanvas-header">
          {/* <h5 className="offcanvas-title" id="filterOffcanvasLabel">
              篩選
            </h5> */}
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div
          className={`offcanvas-body ${styles.offcanvasBody} ${styles.scrollOrg}`}
        >
          <aside className={`container ${styles.suSidebar}`}>
            {/* 地圖區塊 */}
            <div className={styles.suMapCard}>
              {!showGoogleMaps ? (
                <>
                  <button
                    className={`btn ${styles.suMapBtn}`}
                    onClick={() => setShowGoogleMaps(true)}
                  >
                    📍 於地圖上顯示
                  </button>
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=台灣&zoom=7&size=300x200&maptype=roadmap&key=AIzaSyDfCdeVzmet4r4U6iU5M1C54K9ooF3WrV4`}
                    alt="地圖縮圖"
                    className={styles.suMapImage}
                  />
                </>
              ) : (
                <>
                  <button
                    className={`btn ${styles.suMapBtn}`}
                    onClick={() => setShowGoogleMaps(false)}
                  >
                    返回縮圖
                  </button>
                  {/*  使用 Google Maps 動態地圖 */}
                  <GoogleMapComponent hotels={hotels} />
                </>
              )}
            </div>

            {/* 優質住宿篩選 */}
            <div className={`row mx-2 ${styles.suFilterGroup}`}>
              <h6 className={styles.suFilterTitle}>飯店評分</h6>
              <div className="col-12">
                <select
                  className={`form-select ${styles.selects}`}
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="">全部</option>
                  {[4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} ⭐ 以上
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 設施篩選 */}
            <div className={`row mx-2 ${styles.suFilterGroup}`}>
              <h6 className={styles.suFilterTitle}>設施</h6>

              {/* 根據 showAllFacilities 來決定顯示數量 */}
              {tags.slice(0, showAllFacilities ? tags.length : 5).map((tag) => (
                <div className="col-6 form-check mb-3" key={tag.id}>
                  <input
                    className={`form-check-input ${styles.suCheckbox}`}
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                    {tag.name}
                  </label>
                </div>
              ))}

              {/* 只有當標籤數超過 5 個時，才顯示切換按鈕 */}
              {tags.length > 5 && (
                <span
                  className={styles.suShowMore}
                  onClick={() => setShowAllFacilities(!showAllFacilities)}
                >
                  {/* {showAllFacilities ? "收起 ▲" : "更多 ▼"} */}
                  {showAllFacilities ? (
                    <>
                      {" "}
                      顯示更少<i className="bi bi-caret-up-fill"></i>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      更多<i className="bi bi-caret-down-fill"></i>{" "}
                    </>
                  )}
                </span>
              )}
            </div>
            {/* 房型篩選 */}
            <div className={`row mx-2 ${styles.suFilterGroup}`}>
              <h6 className={styles.suFilterTitle}>房型篩選</h6>
              <div className="col-12">
                <select
                  className={`form-select ${styles.selects}`}
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                >
                  <option value="">全部</option>
                  {roomTypes.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* 價格篩選 */}
            <div className={`row mx-2 ${styles.suFilterGroup}`}>
              <h6 className={styles.suFilterTitle}>價格篩選</h6>
              <div className={styles.suPriceInputGroup}>
                <div className={styles.suPriceInput}>
                  <label htmlFor="filterMin">最少</label>
                  <span>{minPrice} 元</span>
                </div>
                <div className={styles.suPriceInput}>
                  <label htmlFor="filterMax">最多</label>
                  <span>{maxPrice} 元</span>
                </div>
              </div>

              <PriceSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                onUpdate={handlePriceUpdate}
              />
              {/* 搜尋 / 清除篩選 按鈕 */}
              <button
                className={`btn btn-sm mt-5 ${styles.suClearFilterBtn}`}
                onClick={isSearching ? handleApplyFilters : handleClear}
              >
                {isSearching ? "搜尋" : "清除篩選"}
              </button>
            </div>

            {/* 廣告圖片 */}
            <Link className="d-none d-md-block" href="#">
              <figure>
                <img
                  src="/hotel/hotel-images/page-image/hotelad2.png"
                  alt="廣告"
                  className="mx-auto"
                />
              </figure>
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
