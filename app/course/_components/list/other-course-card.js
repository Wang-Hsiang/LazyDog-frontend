"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import styles from "../courseList.module.css";

export default function OtherCourseCard() {
  const [latest, setLatest] = useState([]);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

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

  // const nextSlide = () => {
  //   setCurrentIndex((prev) => {
  //     const newIndex = prev + 1;
  //     return newIndex >= latest.length ? 0 : newIndex;
  //   });
  // };

  // const prevSlide = () => {
  //   setCurrentIndex((prev) => {
  //     const newIndex = prev - 1;
  //     return newIndex < 0 ? latest.length - 1 : newIndex;
  //   });
  // };
  const swiperRef = useRef(null);

  return (
    <>
      <div className={styles.similarCourse}>
        <h2 className={styles.sTitle}>近期開課</h2>
        <div className={styles.sBars}>
          <div className={styles.sbar} />
          <div className={styles.btns}>
            <button
              type="button"
              className={styles.arrowLeft}
              // onClick={prevSlide}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FaArrowLeftLong className="fs-5" />
            </button>
            <button
              type="button"
              className={styles.arrowRight}
              // onClick={nextSlide}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FaArrowRightLong className="fs-5" />
            </button>
          </div>
        </div>

        <div className={`row gy-5 ${styles.sCards}`}>
          <Swiper
            className={styles.swiperGroup}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={2} // 手機顯示2張
            loop={true}
            breakpoints={{
              992: { slidesPerView: 4 },
            }}
            // navigation={{ clickable: true }}
            // pagination={{ clickable: true }}
            autoplay={{ delay: 2800, disableOnInteraction: true }}
            onSwiper={(swiper) => (swiperRef.current = swiper)} // 綁定 Swiper
          >
            {latest?.map((la) => (
              <SwiperSlide key={la.courseId}>
                <Link className={styles.sCard} href={`/course/${la.courseId}`}>
                  <img
                    className={styles.cardImg}
                    src={`/course/img/${la.img_url}`}
                    alt={la.courseName}
                  />
                  <h5 className={styles.cardName}>{la.courseName}</h5>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* <div className={`row gy-5 ${styles.sCards}`}>
          {latest?.map((la) => (
            <Link
              className={`col-6 col-lg-3 m-0 ${styles.sCard}`}
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
        </div> */}
      </div>
    </>
  );
}
