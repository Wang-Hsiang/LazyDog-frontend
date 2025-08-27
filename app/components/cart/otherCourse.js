"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/cart/css/otherCourse.module.css";
import Link from "next/link";
// import Slider from "react-slick";

export default function OtherCourse() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/course/`)
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.data.latest);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);
  // console.log(latest);

  return (
    <>
      <div className={styles.similarCourse}>
        {/* <h2 className={styles.sTitle}>近期開課</h2> */}
        {/* <div className={styles.sBars}>
          <div className={styles.sbar} />
          <div className={styles.btns}>
            <img
              className={styles.arrowLeft}
              src="/course/img/arrow-left.png"
              alt={`往左箭頭`}
            />
            <img
              className={styles.arrowRight}
              src="/course/img/arrow-right.png"
              alt={`往右箭頭`}
            />
          </div>
        </div> */}
        <div className={`row gy-5 ${styles.sCards}`}>
          {latest?.slice(0, 4).map((la) => (
            <Link
              className={`col-6 col-lg-3 p-0 ${styles.sCard}`}
              key={la.courseId}
              href={`/course/${la.courseId}`}
            >
              <img
                className={styles.cardImg}
                src={`/course/img/${la.img_url}`}
                alt={la.courseName}
              />
              <h5 className={styles.cardName}>{la.courseName}</h5>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
