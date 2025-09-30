"use client";

import React, { useState, useEffect } from "react";
import styles from "../courseId.module.css";

export default function CoursePics({ imgs }) {
  // console.log("CoursePics - Img:", imgs);

  return (
    <>
      <div className={styles.left}>
        <div className={styles.pics}>
          {imgs?.slice(1).map((img) => (
            <img className={styles.img} key={img.id} src={`/course/img/${img?.url}`} alt="" />
          ))}
        </div>
      </div>
    </>
  );
}
