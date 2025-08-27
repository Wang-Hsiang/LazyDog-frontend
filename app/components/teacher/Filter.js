"use client";

import React, { useState, useEffect } from "react";
import styles from "../../teacher/list/list.module.css";
import Link from "next/link";

export default function Filter({ filterChange }) {

  const [searchText, setSearchText] = useState("");
  const [selectCategories, setselectCategories] = useState([]);
  const [selectGenders, setselectGenders] = useState([]);

  const searchChange = (e) => {
    setSearchText(e.target.value);
  };

  const categories = [
    { id: "train", label: "寵物訓練" },
    { id: "eat", label: "寵膳食育" },
    { id: "salon", label: "寵物美容" },
    { id: "beef", label: "寵物照護" },
    { id: "bussiness", label: "商業思維與專業培訓" },
  ];

  const genders = [
    { id: "male", label: "男", value:1 },
    { id: "female", label: "女",value:2 },
  ];

  // 處理分類選擇
  const categoryChange = (category) => {
    setselectCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // 處理性別選擇
  const genderChange = (gender) => {
    setselectGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  // 清除篩選
  const clearFilters = () => {
    setSearchText("");
    setselectCategories([]);
    setselectGenders([]);
    filterChange("", [], []);
  };


   // 一進入頁面就顯示所有老師
   useEffect(() => {
    filterChange([], []);
  }, []); // 只執行一次

  // 當篩選條件改變時，通知父元件 
  useEffect(() => {
    filterChange(searchText, selectCategories, selectGenders);
  }, [searchText, selectCategories, selectGenders]);

  
  return (
    <aside className={`mt-4 ${styles["pdFilter"]}`}>
      <table className={styles.pdFilterTable}>
        <thead>
          <tr>
            <td className={`${styles.tdTable} ${styles.searchTable}`}>
              <img src="/product/font/search.png" alt="" />
              <input
                className={styles.searchP}
                type="text"
                placeholder="搜尋老師"
                value={searchText}
                onChange={searchChange}
              />
            </td>
          </tr>
          <tr>
            <td className={`${styles.tdTable} ${styles.menuTable}`}>
              <h5 className="my-3">課程類別</h5>
              {/* <img src="./img/font/down.png" alt="" /> */}
            </td>
          </tr>
          {/* <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="train" type="checkbox" />
              <label htmlFor="train">寵物訓練</label>
            </td>
          </tr> */}
           {categories.map((category) => (
            <tr key={category.id}>
              <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
                <input
                  id={category.id}
                  type="checkbox"
                  checked={selectCategories.includes(category.label)}
                  onChange={() => categoryChange(category.label)}
                />
                <label htmlFor={category.id} className={styles.checkboxLabel}>
                  {category.label}
                </label>
              </td>
            </tr>
          ))}
          {/* <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="eat" type="checkbox" />
              <label htmlFor="eat" className={styles.checkboxLabel}>
                寵膳食育
              </label>
            </td>
          </tr>
          <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="salon" type="checkbox" />
              <label htmlFor="salon" className={styles.checkboxLabel}>
                寵物美容
              </label>
            </td>
          </tr>
          <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="beef" type="checkbox" />
              <label htmlFor="beef" className={styles.checkboxLabel}>
                寵物照護
              </label>
            </td>
          </tr>
          <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="bussiness" type="checkbox" />
              <label htmlFor="bussiness" className={styles.checkboxLabel}>
                商業思維與專業培訓
              </label>
            </td>
          </tr> */}
          <tr>
            <td className={`${styles.tdTable} ${styles.menuTable}`}>
              <h5 className="my-3">老師性別</h5>
              {/* <img src="./img/font/down.png" alt="" /> */}
            </td>
          </tr>
          {/* <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="male" type="checkbox" />
              <label htmlFor="male" className={styles.checkboxLabel}>
                男
              </label>
            </td>
          </tr>
          <tr>
            <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
              <input id="female" type="checkbox" />
              <label htmlFor="female" className={styles.checkboxLabel}>
                女
              </label>
            </td>
          </tr> */}
           {genders.map((gender) => (
            <tr key={gender.id}>
              <td className={`${styles.tdTable} ${styles.checkboxTable}`}>
                <input
                  id={gender.id}
                  type="checkbox"
                  checked={selectGenders.includes(gender.value)}
                  onChange={() => genderChange(gender.value)}
                />
                <label htmlFor={gender.id} className={styles.checkboxLabel}>
                  {gender.label}
                </label>
              </td>
            </tr>
           ))}
          <tr>
            <td className={`mt-5 ${styles.tdTable} ${styles.checkboxTable}`}>
              <button className={styles.clear} onClick={clearFilters}>
                清除搜尋
              </button>
            </td>
          </tr>
        </thead>
      </table>
      {/* <div className={styles.con1}>廣告</div> */}
      <figure>
        <Link href="/product/list">
          <img
            src="/product/DM/DM_aside.png"
            alt="廣告"
            className={`${styles.imgFluid}`}
          />
        </Link>
      </figure>
    </aside>
  );
}
