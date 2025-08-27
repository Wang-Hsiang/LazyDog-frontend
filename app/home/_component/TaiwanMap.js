"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./TaiwanMap.module.css";

// 縣市對應的推薦旅館資訊
const recommendedHotels = {
  台北: {
    name: "黑鼻子寵物旅館",
    image: "/hotel/hotel-uploads/8-outside.png",
    link: "/hotel-coupon/fonthotelDetail/8",
    mobile: true,
  },
  台中: {
    name: "英倫王子",
    image: "/hotel/hotel-uploads/5-outside.png",
    link: "/hotel-coupon/fonthotelDetail/5",
    mobile: true,
  },
  高雄: {
    name: "毛絨絨澡堂x貓茸茸旅",
    image: "/hotel/hotel-uploads/39-outside.png",
    link: "/hotel-coupon/fonthotelDetail/39",
    mobile: false,
  },
  台南: {
    name: "想見妮寵物旅館",
    image: "/hotel/hotel-uploads/45-outside.png",
    link: "/hotel-coupon/fonthotelDetail/45",
    mobile: false,
  },
  花蓮: {
    name: "捲捲毛寵物旅館",
    image: "/hotel/hotel-uploads/35-outside.png",
    link: "/hotel-coupon/fonthotelDetail/35",
    mobile: true,
  },
  桃園: {
    name: "小森林寵物美容旅館",
    image: "/hotel/hotel-uploads/68-.jpg",
    link: "/hotel-coupon/fonthotelDetail/68",
    mobile: false,
  },
  苗栗: {
    name: "捲捲毛寵物沙龍",
    image: "/hotel/hotel-uploads/62-outside.png",
    link: "/hotel-coupon/fonthotelDetail/62",
    mobile: false,
  },
  新竹: {
    name: "汪得福寵物漢方生活館",
    image: "/hotel/hotel-uploads/63-outside.png",
    link: "/hotel-coupon/fonthotelDetail/63",
    mobile: false,
  },
};

// 各縣市標記位置
const regionPositions = {
  台北: { top: "10%", left: "75%" },
  桃園: { top: "11%", left: "50%" },
  新竹: { top: "23%", left: "50%" },
  台中: { top: "35%", left: "30%" },
  高雄: { top: "70%", left: "30%" },
  台南: { top: "67%", left: "15%" },
  花蓮: { top: "45%", left: "66%" },
  苗栗: { top: "25%", left: "40%" },
};

export default function RegionMap() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // 監聽螢幕大小
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.mapContainer}>
      {/* 手機版：顯示所有旅館的資訊卡 */}
      {isMobile ? (
        <div className={styles.mobileHotelList}>
          {Object.keys(recommendedHotels)
            .filter((region) => recommendedHotels[region].mobile)
            .map((region) => (
              <div
                key={region}
                className={styles.mobileHotelCard}
                onClick={() => {
                  if (recommendedHotels[region]?.link) {
                    router.push(recommendedHotels[region].link);
                  }
                }}
              >
                <h3>{recommendedHotels[region].name}</h3>
                <img
                  src={recommendedHotels[region].image}
                  alt={recommendedHotels[region].name}
                />
              </div>
            ))}
        </div>
      ) : (
        <>
          {/* 電腦版：顯示地圖和點點 */}
          {selectedRegion && recommendedHotels[selectedRegion] && (
            <div
              className={styles.hotelInfo}
              style={{
                top: `calc(${regionPositions[selectedRegion].top} + 10%)`,
                left: `calc(${regionPositions[selectedRegion].left} + 25%)`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <h3>{recommendedHotels[selectedRegion].name}</h3>
              <img
                src={recommendedHotels[selectedRegion].image}
                alt={selectedRegion}
              />
            </div>
          )}
          {/* 台灣地圖背景 */}
          <img
            className={styles.mapImage}
            src="/home/img/Group.svg"
            alt="Taiwan Map"
          />

          {/* 各縣市標記 */}
          {Object.keys(regionPositions).map((region) => (
            <div
              key={region}
              className={styles.regionMarker}
              style={{
                top: regionPositions[region].top,
                left: regionPositions[region].left,
              }}
              onMouseEnter={() => setSelectedRegion(region)}
              onMouseLeave={() => setSelectedRegion(null)}
              onClick={() => {
                if (recommendedHotels[region]?.link) {
                  router.push(recommendedHotels[region].link);
                }
              }}
            >
              <div className={styles.circle} />
              <span className={styles.label}>{region}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
