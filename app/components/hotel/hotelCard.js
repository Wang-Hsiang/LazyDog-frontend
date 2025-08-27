import React from "react";
import styles from "../../../styles/modules/fontHotelHome.module.css";
import { useRouter } from "next/navigation";
import { bottom } from "@popperjs/core";

const HotelCard = ({ image, hotel }) => {
  const router = useRouter();

  // 確保 `image` 存在
  const imageUrl = image ? image : "/hotel/loding.jpg";

  const goToDetail = () => {
    if (!hotel || !hotel.id) return;
    router.push(`/hotel-coupon/fonthotelDetail/${hotel.id}/`);
  };
  return (
    <div className={styles.suCards}>
      <div className={styles.suHotelCard} onClick={goToDetail}>
        <div className="col-4 col-xl-3 text-center">
          <img
            src={hotel?.main_image_url || "/hotel/loding.jpg"}
            alt={hotel?.name || "飯店圖片"}
          />
        </div>
        <div className={`col-6 col-xl-6  ${styles.suHotelInfo}`}>
          <h6 className={styles.hotelName}>{hotel.name}</h6>
          <p>{hotel.introduce}</p>
        </div>
        <div className={`col-12 col-xl-3 ${styles.suPriceBox}`}>
          <div className={`${styles.suReview}`}>
            <img
              className={styles.starIcon}
              src="/product/font/star-fill.png"
              // style={{ width: "20px", height: "20px" }}
            />{" "}
            {hotel?.avg_rating ?? "無評分"}
          </div>
          <div className={styles.suReviewCount}>
            {" "}
            {hotel.review_count ?? 0}則評論
          </div>
          <div className="justify-end me-2">
            <button
              className={` ${styles.suBookBtn}`}
              onClick={() => hotel?.id && goToDetail()}
            >
              查看價格
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
