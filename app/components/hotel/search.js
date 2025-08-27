import React, { useState } from "react";
import styles from "../../../styles/modules/fontHotelHome.module.css";
import { useDatePicker } from "@/hooks/useDatePicker";

const HotelSearchBar = ({
  location,
  locationModalRef,
  openModal,
  city,
  district,
  closeModal,
  confirmLocation,
  clearLocation,
  quantity,
  setQuantity,
  onSearch,
  onClear,
}) => {
  const { dateRef, selectedDate, setSelectedDate, clearDate } = useDatePicker();
  const [isSearching, setIsSearching] = useState(true);

  const handleSearchBarSubmit = async () => {
    confirmLocation(); // 確保地區更新
    let checkInDate = null;
    let checkOutDate = null;
    const searchParams = {
      city: city ?? null,
      district: district ?? null,
      quantity: quantity ?? 1,
      checkInDate: checkInDate ?? null,
      checkOutDate: checkOutDate ?? null,
      minPrice: 0,
      maxPrice: 10000,
      rating: null,
      roomType: null,
      tags: [],
    };

    // 解析日期
    if (selectedDate.includes(" 至 ")) {
      const [checkInDate, checkOutDate] = selectedDate.split(" 至 ");
      searchParams.checkInDate = checkInDate.trim() || null;
      searchParams.checkOutDate = checkOutDate.trim() || null;
    } else {
      console.warn("日期格式錯誤，請選擇完整的入住和退房日期");
      searchParams.checkInDate = null;
      searchParams.checkOutDate = null;
    }

    console.log("🔍 SearchBar 送出篩選 API:", searchParams);

    try {
      if (onSearch) {
        onSearch(searchParams); // 將搜尋參數傳遞到父組件
      }
      setIsSearching(false);
    } catch (error) {
      console.error("搜尋 API 錯誤:", error);
    }
  };

  const handleClearSearch = () => {
    console.log("🧹 清除搜尋條件");

    clearLocation();
    clearDate();
    setQuantity(1);

    const resetParams = {
      city: null,
      district: null,
      checkInDate: null,
      checkOutDate: null,
      quantity: 1,
      minPrice: 0,
      maxPrice: 10000,
      rating: null,
      roomType: null,
      tags: [],
    };

    if (onSearch) {
      onSearch({ ...resetParams }); // 將重置參數傳遞到父組件
    }

    setIsSearching(true);
  };

  return (
    <div className="container mt-4">
      <div className={styles.suSearchBar}>
        <div className={styles.suSearchGroup}>
          <img
            className={styles.suIcon}
            src="/hotel/hotel-images/page-image/icon-search.png"
            alt=""
          />
          <button className={styles.suSearchInput} onClick={openModal}>
            {city ? `${city} ${district || ""}` : "選擇地區"}
          </button>
        </div>
        <div className={styles.suSearchGroup}>
          <img
            className={styles.suIcon}
            src="/hotel/hotel-images/page-image/icon-Calendar.png"
            alt=""
          />
          <input
            type="text"
            ref={dateRef}
            className={styles.suSearchDate}
            placeholder="入住日期  →  退房日期"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className={styles.suSearchGroup}>
          <img
            className={styles.suIcon}
            src="/hotel/hotel-images/page-image/Icon-mimi.png"
            alt=""
          />
          <span className="text">數量</span>
          <button
            className={styles.suQuantityBtn}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className={styles.suQuantityNumber}>{quantity}</span>
          <button
            className={styles.suQuantityBtn}
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>

        {/* 搜尋按鈕 */}
        <button
          className={styles.suSearchBtn}
          onClick={isSearching ? handleSearchBarSubmit : handleClearSearch}
        >
          {isSearching ? "搜尋" : "清除篩選"}
        </button>

        {/* 地區選擇 Modal */}
        <div
          className={`modal fade ${styles.regionModal}`}
          ref={locationModalRef}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">選擇地區</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="d-flex justify-content-center gap-2 my-2"
                  id="twzipcode"
                >
                  <select className={`county ${styles.selectsRegion}`}></select>
                  <select
                    className={`district ${styles.selectsRegion}`}
                  ></select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className={styles.suSearchBtn2}
                  onClick={confirmLocation}
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchBar;
