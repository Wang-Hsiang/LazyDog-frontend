"use client";

import React, { useState, useEffect } from "react";
import styles from "../courseList.module.css";
import Link from "next/link";

export default function SideBar({ types, places, filters, setFilters }) {
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1000);

  // 搜尋關鍵字
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setFilters((prev) => ({ ...prev, keyword: e.target.value }));
  };

  // 更新課程類別篩選
  const handleTypeChange = (id) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(id)
        ? prev.types.filter((t) => t !== id)
        : [...prev.types, id],
    }));
  };

  // 更新地點篩選
  const handlePlaceChange = (id) => {
    setFilters((prev) => ({
      ...prev,
      places: prev.places.includes(id)
        ? prev.places.filter((p) => p !== id)
        : [...prev.places, id],
    }));
  };

  // 更新價格範圍
  const handlePriceChange = (e, type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: Number(e.target.value),
    }));
  };

  return (
    <>
      {/* 篩選 */}
      <aside className={`col-12 col-md-4 col-lg-3  ${styles.sidebar}`}>
        {/* 桌機版直接顯示篩選列 */}
        <div className="d-none d-md-block">
          {/* 搜尋 */}
          <div className={styles.searchGroup}>
            <img
              className={styles.searchIcon}
              src="/course/img/searchIcon.png"
              alt={`搜尋課程內容`}
            />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="搜尋課程"
              value={keyword}
              onChange={handleKeywordChange}
            />
            <img
              className={styles.xIcon}
              src="/course/img/x.png"
              alt={`清除搜尋內容`}
              onClick={() => {
                setKeyword("");
                setFilters((prev) => ({ ...prev, keyword: "" }));
              }}
            />
          </div>
          {/* 課程類別 */}
          <div className={styles.filterGroup}>
            <div className={styles.bar}>
              <h6 className={styles.filterTitle}>課程類別</h6>
            </div>
            <div className={styles.filter}>
              {types?.map((t) => (
                <div key={t.type_id} className={`form-check ${styles.checks}`}>
                  <input
                    className={`form-check-input ${styles.checkbox}`}
                    type="checkbox"
                    checked={filters.types.includes(t.type_id)}
                    onChange={() => handleTypeChange(t.type_id)}
                  />
                  <label
                    className={`form-check-label ${styles.labels}`}
                    htmlFor={t.type_id}
                  >
                    {t.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* 上課地點 */}
          <div className={styles.filterGroup}>
            <div className={styles.bar}>
              <h6 className={styles.filterTitle}>上課地點</h6>
              {/* <img
              className={styles.arrowDown}
              src="/course/img/arrow-down.png"
              alt={`點選看更多 上課地點`}
            /> */}
            </div>
            <div className={styles.filter}>
              {places?.map((p) => (
                <div key={p.id} className={`form-check ${styles.checks}`}>
                  <input
                    className={`form-check-input ${styles.checkbox}`}
                    type="checkbox"
                    checked={filters.places.includes(p.id)}
                    onChange={() => handlePlaceChange(p.id)}
                  />
                  <label
                    className={`form-check-label ${styles.labels}`}
                    htmlFor={p.id}
                  >
                    {p.region}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* 清除按鈕 */}
          <button
            id="resetFilter"
            className={styles.clearFilterBtn}
            onClick={() =>
              setFilters({
                keyword: "",
                types: [],
                places: [],
                minPrice: 600,
                maxPrice: 8000,
              })
            }
          >
            清除搜尋
          </button>
          {/* 廣告 */}
          <Link href="/product/list" className={`sm-none ${styles.ad}`}>
            <p className={styles.adWords}>
              最新商品
              <br />
              優惠中!
            </p>
            <button className={styles.buynow}>BUY NOW</button>
            <img
              className={styles.girlPic}
              src="/course/img/girlPic.png"
              alt={`最新課程優惠中`}
            />
          </Link>
        </div>

        {/* 手機版顯示 Offcanvas 按鈕 */}
        <button
          className={`btn d-md-none ${styles.filterIcon}`} // 只在小螢幕上顯示
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#filterOffcanvas"
          aria-expanded="false"
          aria-controls="filterOffcanvas"
        >
          <i className="bi bi-chevron-right"></i>
          {/* <span className={styles.filterIconWord}>{"Filter"}</span> */}
        </button>
        {/* Offcanvas 內容 */}
        <div
          className="offcanvas offcanvas-start" // 從左側彈出
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
            {/* 搜尋 */}
            <div className={styles.searchGroup}>
              <img
                className={styles.searchIcon}
                src="/course/img/searchIcon.png"
                alt={`搜尋課程內容`}
              />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜尋課程"
                value={keyword}
                onChange={handleKeywordChange}
              />
              <img
                className={styles.xIcon}
                src="/course/img/x.png"
                alt={`清除搜尋內容`}
                onClick={() => {
                  setKeyword("");
                  setFilters((prev) => ({ ...prev, keyword: "" }));
                }}
              />
            </div>
            {/* 課程類別 */}
            <div className={styles.filterGroup}>
              <div className={styles.bar}>
                <h6 className={styles.filterTitle}>課程類別</h6>
                {/* <img
              className={styles.arrowDown}
              src="/course/img/arrow-down.png"
              alt={`點選看更多 課程類別`}
            /> */}
              </div>
              <div className={styles.filter}>
                {types?.map((t) => (
                  <div
                    key={t.type_id}
                    className={`form-check ${styles.checks}`}
                  >
                    <input
                      className={`form-check-input ${styles.checkbox}`}
                      type="checkbox"
                      checked={filters.types.includes(t.type_id)}
                      onChange={() => handleTypeChange(t.type_id)}
                    />
                    <label
                      className={`form-check-label ${styles.labels}`}
                      htmlFor={t.type_id}
                    >
                      {t.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* 上課地點 */}
            <div className={styles.filterGroup}>
              <div className={styles.bar}>
                <h6 className={styles.filterTitle}>上課地點</h6>
                {/* <img
              className={styles.arrowDown}
              src="/course/img/arrow-down.png"
              alt={`點選看更多 上課地點`}
            /> */}
              </div>
              <div className={styles.filter}>
                {places?.map((p) => (
                  <div key={p.id} className={`form-check ${styles.checks}`}>
                    <input
                      className={`form-check-input ${styles.checkbox}`}
                      type="checkbox"
                      checked={filters.places.includes(p.id)}
                      onChange={() => handlePlaceChange(p.id)}
                    />
                    <label
                      className={`form-check-label ${styles.labels}`}
                      htmlFor={p.id}
                    >
                      {p.region}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* 清除按鈕 */}
            <button
              id="resetFilter"
              className={styles.clearFilterBtn}
              onClick={() =>
                setFilters({
                  keyword: "",
                  types: [],
                  places: [],
                  minPrice: 600,
                  maxPrice: 8000,
                })
              }
            >
              清除搜尋
            </button>
            {/* 廣告 */}
            <div className={`d-none ${styles.ad}`}>
              <p className={styles.adWords}>最新課程優惠中!</p>
              <button className={styles.buynow}>BUY NOW</button>
              <Link href="/product/list">
                <img
                  className={styles.girlPic}
                  src="/course/img/girlPic.png"
                  alt={`最新課程優惠中`}
                />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
