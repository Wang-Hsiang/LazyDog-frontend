"use client";

import React, { useState, useEffect } from "react";
import styles from "../courseList.module.css";
import Link from "next/link";

export default function Card({ course }) {
  return (
    <>
      <div className="col-6 col-lg-4 p-0">
        <Link className={styles.courseCard} href={`/course/${course.id}`}>
          <img
            className={styles.img}
            src={`/course/img/${course.img_url}`}
            alt={course.name}
          />
          <h5 className={styles.tag}>{course.type_name}</h5>
          <h2 className={styles.name}>{course.name}</h2>
          <p className={styles.intro}>{course.description}</p>
        </Link>
      </div>
    </>
  );
}
