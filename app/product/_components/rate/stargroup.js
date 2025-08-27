"use client";

import React, { useState, useEffect } from "react";
import styles from "./rate.module.css";

import * as motion from "motion/react-client";

export default function RatecardStarbar({
  rate = "",
  rateUpdate = false,
  newRate = 1,
  setNewRate = () => {},
}) {
  let int, dec;
  if (rate) {
    [int, dec] = rate.split(".");
    if (!dec) dec = 0;
  }
  const [hover, setHover] = useState(rate);
  // console.log(newRate);
  return (
    <>
      {int && !rateUpdate && (
        <div className={styles.StarGroup}>
          {int > 0 &&
            int <= 5 &&
            [...Array(Number(int))].map((v, i) => (
              <img
                key={`starFill${i}`}
                src="/product/font/star-fill.png"
                alt=""
              />
            ))}
          {int < 5 && (
            <img
              src={`/product/font/${
                dec > 7 ? "star-fill" : dec > 2 ? "star-half" : "star"
              }.png`}
              alt=""
            />
          )}
          {int < 4 &&
            [...Array(4 - Number(int))].map((v, i) => (
              <img key={`star${i}`} src="/product/font/star.png" alt="" />
            ))}
        </div>
      )}
      {rate && rateUpdate && (
        <div className={styles.StarGroup}>
          {[...Array(5)].map((v, i) => (
            <motion.img
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(newRate)}
              onClick={() => setNewRate(i + 1)}
              key={`starFill${i}`}
              src={`/product/font/${
                i < hover
                  ? "star-fill"
                  : i < newRate && hover == newRate
                  ? "star-fill"
                  : "star"
              }.png`}
              alt=""
            />
          ))}
        </div>
      )}
    </>
  );
}
