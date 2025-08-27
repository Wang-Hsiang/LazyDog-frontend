"use client";

import React, { useState } from "react";
// import { useFetch } from "@/hooks/use-fetch";
import styles from "../courseList.module.css";
import Card from "./card";

export default function CourseCard({ courses = [], currentCourses, loading }) {
  return (
    <>
      <div className={`col-12 col-md-8 col-lg-9 ${styles.right}`}>
        <div className={styles.top}>
          <h2 className={styles.sTitle}>所有課程</h2>
        </div>
        <div className={`d-flex ${styles.medium}`}>
          <div className={styles.sbar}></div>
          <div className={styles.count}>
            共計 <span className={styles.countNum}>{courses?.length}</span> 堂課
          </div>
          {/* <div className={styles.hot}>
            <img src="/course/img/sort.png" alt={`依熱門程度排序`} />
            依熱門程度排序
          </div> */}
        </div>
        {loading ? (
          <p>載入中...</p>
        ) : courses.length === 0 ? (
          <p>沒有符合條件的課程</p>
        ) : (
          <div className={`row ${styles.courseGroup}`}>
            {currentCourses?.map((course) => {
              return <Card key={course.id} course={course} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}
