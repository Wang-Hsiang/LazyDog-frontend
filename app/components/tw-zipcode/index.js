import { useEffect, useState } from "react";
import { countries, townships, postcodes } from "./data-townships";
import styles from "@/app/user/menu.module.css";

export default function TWZipCode({
  initPostcode = "",
  initCounty = "", // 新增 initCounty
  initDistrict = "", // 新增 initDistrict
  onPostcodeChange = (country, township, postcode) => {},
}) {
  //console.log(countries, townships, postcodes)

  // 記錄陣列的索引值，預設值是-1，相當於"請選擇xxx"
  const [countryIndex, setCountryIndex] = useState(-1);
  const [townshipIndex, setTownshipIndex] = useState(-1);

  // 郵遞區號使用字串(數字字串)
  const [postcode, setPostcode] = useState("");

  // 利用傳入時的initPostcode初始化用
  useEffect(() => {
    // console.log(initCounty);

    if (initCounty || initDistrict) {
      const countyIndex = countries.indexOf(initCounty);
      if (countyIndex !== -1) {
        setCountryIndex(countyIndex);
        const districtIndex = townships[countyIndex].indexOf(initDistrict);
        if (districtIndex !== -1) {
          setTownshipIndex(districtIndex);
          setPostcode(postcodes[countyIndex][districtIndex]);
        }
      }
    }
  }, [initCounty, initDistrict]);

  // 當countryIndex, townshipIndex均有值時，設定postcode值
  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex]);
    }
  }, [countryIndex, townshipIndex]);

  // 當使用者改變的countryIndex, townshipIndex，使用onPostcodeChange回傳至父母元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      );
    }
  }, [postcode]);

  return (
    <>
      <select
        value={countryIndex}
        onChange={(e) => {
          // 將字串轉成數字
          setCountryIndex(+e.target.value);
          // 重置townshipIndex的值
          setTownshipIndex(-1);
          // 重置postcode的值
          setPostcode("");
        }}
        className={styles.selects}
      >
        <option value="-1">選擇縣市</option>
        {countries.map((value, index) => (
          <option key={index} value={index}>
            {value}
          </option>
        ))}
      </select>
      <select
        style={{ marginBottom: "10px" }}
        value={townshipIndex}
        onChange={(e) => {
          // 將字串轉成數字
          setTownshipIndex(+e.target.value);
        }}
        className={styles.selects}
      >
        <option value="-1">選擇區域</option>
        {countryIndex > -1 &&
          townships[countryIndex].map((value, index) => (
            <option key={index} value={index}>
              {value}
            </option>
          ))}
      </select>
    </>
  );
}
