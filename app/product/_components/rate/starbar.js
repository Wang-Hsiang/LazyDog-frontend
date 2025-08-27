"use client";

import React, { useState, useEffect } from "react";
import styles from "./rate.module.css";

export default function RateStarbar({ rate = "", index = "" }) {
  const star = index;
  const rates = rate;
  const stars = rates.filter((e) => e == star);
  return (
    <div className={styles.StarBar}>
      <div className={styles.StarGroup}>
        {[...Array(5 - Number(index))].map((v, i) => (
          <img key={`star${i}`} src="/product/font/star.png" alt="" />
        ))}
        {[...Array(Number(index))].map((v, i) => (
          <img key={`starFill${i}`} src="/product/font/star-fill.png" alt="" />
        ))}
      </div>
      <div className={styles.BarArea}>
        <div
          className={styles.Bar}
          style={{ width: `${(stars?.length / rates?.length) * 100}%` }}
        />
      </div>
      <p className={styles.Num}>
        {((stars?.length / rates?.length) * 100).toFixed(0)}%
      </p>
    </div>
  );
}
