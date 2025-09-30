"use client";

import React, { useState, useEffect } from "react";
import styles from "../courseId.module.css";

export default function Breadcrumb({ course }) {
  const c = course?.[0];

  return (
    <>
      <nav className={`px-4 ${styles.breadcrumbs}`}>
        <ul className={styles.ul}>
          <li>
            <a className={styles.home} href={`/home`}>
              首頁
            </a>
          </li>
          <img src="/course/img/right.svg" alt="" />
          <li>
            <a className={styles.courseList} href={`/course/list`}>
              課程列表
            </a>
          </li>
          <img src="/course/img/right.svg" alt="" />
          <li>
            <a className={styles.courseName} href="">
              {c?.name}
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
