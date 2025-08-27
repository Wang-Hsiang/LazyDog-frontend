"use client";

import React from "react";
import Link from "next/link";
import styles from "../../../styles/modules/toggle.module.css";
import style from "../../../styles/modules/teacher.module.css";

function CourseSection() {
  return (
    <>
      <div className={`p-5  text-center ${style.teacher}`}>
        <h6 className="mb-4 fw-medium">學習與毛孩共同成長的美好過程</h6>
        <h3 className="mb-5 lumi-m-title">課堂實影</h3>
        <div className="lumi-all-wrapper">
          <Link href="/course/list">
            <img
              className={` ${styles["img1"]}`}
              src="/teacher-img/img2.webp"
              alt=""
            />
            <img
              className={` ${styles["img"]}`}
              src="/teacher-img/img1.jpeg"
              alt=""
            />
            <img
              className={` ${styles["img"]}`}
              src="/teacher-img/img3.jpg"
              alt=""
            />
            <img
              className={` ${styles["img"]}`}
              src="/teacher-img/img6.png"
              alt=""
            />
            <img
              className={`${styles["img"]}`}
              src="/teacher-img/img5.jpg"
              alt=""
            />
            <img
              className={` ${styles["img1"]}`}
              src="/teacher-img/img4.webp"
              alt=""
            />
          </Link>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <img
          style={{ width: "100%" }}
          className=""
          src="/teacher-img/rice2.png"
          alt=""
        />
      </div>
    </>
  );
}

export default CourseSection;
