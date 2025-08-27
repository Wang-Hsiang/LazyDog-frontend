"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../courseList.module.css";
// import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

export default function News() {
  // const [newest, setNewest] = useState(null);

  // useEffect(() => {
  //   fetch(`http://localhost:5000/api/course/`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setNewest(data.data.newest);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching data:", err);
  //     });
  // }, []);
  // console.log(newest);

  return (
    <>
      <div className={` d-none d-lg-block ${styles.new}`}>
        {/* 影片slide */}
        <Swiper
          spaceBetween={0}
          // centeredSlides={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          // navigation={true}
          modules={[Autoplay, Pagination]}
          className={`mySwiper `}
        >
          <SwiperSlide className={styles.newCard}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.newVideoDogs}
            >
              <source src="/course/video/sunshine.mp4" type="video/mp4" />
            </video>
          </SwiperSlide>
          <SwiperSlide className={styles.newCard}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.newVideoPeople}
            >
              <source src="/course/video/highfive.mp4" type="video/mp4" />
            </video>
          </SwiperSlide>
        </Swiper>

        {/* 照片slide */}
        {/* <Swiper
          slidesPerView={3}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          // navigation={true}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        > 
          {newest?.map((news)=>(
              <SwiperSlide className={styles.newCard} key={news.courseId}>
                <img className={styles.newImg} src={`/course/img/${news.img_url}`} alt={`課程圖片`} />
                <div className={styles.bottom}>
                  <div className={styles.date}>{new Date(news.startdate).toISOString().split('T')[0]}</div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper> */}

        {/* 純影片 */}
        {/* <video autoPlay loop muted playsInline className={styles.newImg}>
          <source src="/course/img/dogplay.mp4" type="video/mp4"/>
        </video>
        <video className={styles.newImg}>
          <source src="/course/img/peopleWdog.mp4"/>
        </video> */}
      </div>
    </>
  );
}
