"use client";

import React, { useRef } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

import styles from "../courseId.module.css";

export default function SimilarCourseCard({ simiCourse }) {
  const swiperRef = useRef(null);

  return (
    <>
      <div className={styles.similarCourses}>
        <div className={`${styles.similarCourse}`}>
          <h2 className={styles.sTitle}>相關課程</h2>
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
              {/* <span className={styles.arrowLeft}>
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className={styles.icon}
                />
              </span>
              <span className={styles.arrowLeft}>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  className={styles.icon}
                />
              </span> */}
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
              {simiCourse?.map((simi) => (
                <SwiperSlide key={simi.courseId}>
                  <Link
                    className={`col-6 col-lg-3 ${styles.sCard}`}
                    href={`/course/${simi.courseId}`}
                  >
                    <img
                      className={styles.cardImg}
                      src={`/course/img/${simi?.img_url}`}
                      alt={simi.courseName}
                    />
                    <h5 className={styles.cardName}>{simi.courseName}</h5>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
