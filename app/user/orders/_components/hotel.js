import React from "react";
import Link from "next/link";
import couponStyles from "./userCoupon.module.css";

const Hotel = ({ hotelOrders }) => {
  console.log(hotelOrders);

  const formatDate = (isoString) => {
    if (isoString === "") return ""; // 保留空字串
    if (!isoString) return "無效日期"; // 避免 null 或 undefined

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "無效日期"; // 避免無效日期

    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Taipei",
    })
      .format(date)
      .replace(/\//g, "-")
      .replace(",", "");
  };

  return (
    <>
      {hotelOrders.map((order) => {
        const imageUrl =
          order.images?.length > 0 && order.images[0].url
            ? order.images[0].url.startsWith("http")
              ? order.images[0].url
              : `http://localhost:5000${order.images[0].url}`
            : "/hotel/hotel-uploads/1-l-room.webp";

        return (
          <div key={order.id} className={`mt-2 ${couponStyles.suCouponCard}`}>
            <Link href="">
              <img
                src={imageUrl}
                // style={{ maxHeight: "100px", objectFit: "cover" }}
                alt={`旅館訂單 ${order.id}`}
                onError={(e) =>
                  (e.target.src = "/hotel/hotel-uploads/1-l-room.webp")
                }
              />
            </Link>
            <div className={couponStyles.suDetails}>
              <Link href="" style={{ color: "#ff9538" }}>
                旅館編號 : {order.hotel_id}
              </Link>
              <p className="text-muted">
                入住時間 : {formatDate(order.check_in)} ~{" "}
                {formatDate(order.check_out)}
              </p>
            </div>
            <span className={couponStyles.suPrice}>
              NT$ {Math.floor(order.final_amount).toLocaleString()}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default Hotel;
