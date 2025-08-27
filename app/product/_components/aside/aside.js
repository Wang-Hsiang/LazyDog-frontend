"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./aside.module.css";
import "nouislider/dist/nouislider.css";
import noUiSlider from "nouislider";
import FilterGroup from "./filtergroup";
import FilterLinkGroup from "./filterlinkgroup";
import Link from "next/link";
import { useAsideFetch } from "@/hooks/product/use-fetch";

import { MoonLoader } from "react-spinners";

export default function Aside({
  changeUrl = () => {},
  keyword = {},
  setKeyword = () => {},
  minPrice = 0,
  maxPrice = 30000,
  setMaxPrice = () => {},
  setMinPrice = () => {},
  sortName = "條件排序",
}) {
  const {
    category,
    categoryName,
    categoryClass,
    i,
    pathname,
    query,
    mutate,
    isLoading,
    error,
  } = useAsideFetch({
    changeUrl,
    keyword,
    setKeyword,
    minPrice,
    maxPrice,
    setMaxPrice,
    setMinPrice,
    sortName,
  });
  const priceSliderRef = useRef(null);

  const handleMinPriceChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setMinPrice(""); // 清空
      return;
    }

    value = Number(value);
    if (isNaN(value)) return;
    if (value < 0) value = 0;
    if (value > maxPrice) value = maxPrice;

    setMinPrice(value);

    // 滑桿不會影響使用者輸入
    if (priceSliderRef.current?.noUiSlider) {
      priceSliderRef.current.noUiSlider.set([value, maxPrice]);
    }
  };
  const handleMaxPriceChange = (e) => {
    let value = e.target.value;
    if (value == "") {
      setMaxPrice(""); // 清空
      return;
    }

    setMaxPrice((prevMax) => {
      let newValue = Number(value);
      if (isNaN(newValue)) return prevMax;
      if (newValue < minPrice) newValue = minPrice;
      return newValue;
    });

    if (priceSliderRef.current?.noUiSlider) {
      priceSliderRef.current.noUiSlider.set([minPrice, value]);
    }
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!priceSliderRef.current) return;

    // 初始化滑桿
    noUiSlider.create(priceSliderRef.current, {
      start: [minPrice, maxPrice],
      connect: true,
      range: { min: 0, max: maxPrice },
      step: 100,
    });

    // 滑桿更新時同步 `state`
    priceSliderRef.current.noUiSlider.on("change", (values) => {
      setMinPrice(parseFloat(values[0]));
      setMaxPrice(parseFloat(values[1]));
    });

    return () => {
      if (priceSliderRef.current?.noUiSlider) {
        priceSliderRef.current.noUiSlider.destroy();
      }
    };
  }, [priceSliderRef.current]);

  const [clearSearch, setClearSearch] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  // console.log(isChecked);

  return (
    <>
      {isLoading ? (
        <aside
          className={`${styles.Sidebar} col`}
          style={{
            width: "242px",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoonLoader color="#f5842b" speedMultiplier={1} />
        </aside>
      ) : (
        <aside className={`${styles.Sidebar}`}>
          <div className={styles.SearchTable}>
            <img src="/product/font/search.png" alt="" />
            <input
              type="text"
              value={clearSearch}
              onChange={(e) => {
                setClearSearch(e.target.value);
                setIsChecked(false);
              }}
              placeholder="搜尋商品"
              onKeyUp={(e) => {
                changeUrl(
                  `http://localhost:5000/api/products/search?${
                    query.get("category")
                      ? `category=${query.get("category")}&`
                      : ""
                  }keyword=${e.target.value}${
                    sortName == "依商品名稱排序"
                      ? "&sort=name"
                      : sortName == "依商品價格排序"
                      ? "&sort=price"
                      : sortName == "依上架時間排序"
                      ? "&sort=update"
                      : ``
                  }`
                );
              }}
            />
          </div>
          {/* <HotSaleGroup /> */}
          {pathname.includes("category")
            ? categoryClass[i]?.map((value, index) => (
                <FilterGroup
                  key={`FilterGroup${index}`}
                  name={value}
                  category={category[categoryName[i]]}
                  keyword={keyword}
                  setKeyword={setKeyword}
                  setClearSearch={setClearSearch}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                />
              ))
            : categoryName?.map((v, i) => (
                <FilterLinkGroup
                  key={`FilterLinkGroup${i}`}
                  name={v}
                  category={category[v]}
                />
              ))}
          <div className={`text-center ${styles.PriceFilterContainer}`}>
            <h5
              className={styles.FilterTitle}
              style={{ justifyContent: "center" }}
            >
              價格篩選
            </h5>
            <div className="d-flex justify-content-center gap-3">
              <div className={styles.PriceInput}>
                <label htmlFor="filterMin">$</label>
                <input
                  id="filterMin"
                  type="number"
                  placeholder="最少"
                  value={minPrice === "" ? "" : minPrice}
                  onChange={handleMinPriceChange}
                  onBlur={() => {
                    if (minPrice === "" || isNaN(minPrice)) {
                      setMinPrice(0);
                      priceSliderRef.current?.noUiSlider.set([0, maxPrice]);
                    }
                  }}
                />
                <span>元</span>
              </div>
              <div className={styles.PriceInput}>
                <label htmlFor="filterMax">$</label>
                <input
                  id="filterMax"
                  type="number"
                  placeholder="最多"
                  value={maxPrice === "" ? "" : maxPrice}
                  onChange={handleMaxPriceChange}
                  onBlur={() => {
                    if (maxPrice === "" || isNaN(maxPrice)) {
                      setMaxPrice(maxPrice);
                      priceSliderRef.current?.noUiSlider.set([
                        minPrice,
                        maxPrice,
                      ]);
                    }
                  }}
                />
                <span>元</span>
              </div>
            </div>
            <div id="priceRange" ref={priceSliderRef} className="mt-3"></div>
            <button
              className={`btn btn-outline-danger mt-3 ${styles.ClearFilterBtn}`}
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(5000);
                if (priceSliderRef.current?.noUiSlider) {
                  priceSliderRef.current.noUiSlider.set([0, maxPrice]);
                }
              }}
            >
              清除搜尋
            </button>
          </div>

          <Link href="" className="d-none d-lg-block">
            <figure>
              <img
                src="/product/DM/DM_aside.png"
                alt="廣告"
                className="img-fluid"
              />
            </figure>
          </Link>
        </aside>
      )}
    </>
  );
}
