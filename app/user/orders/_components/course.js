import React from "react";
import Link from "next/link";
import couponStyles from "./userCoupon.module.css";

const Course = ({ courseOrders }) => {
  console.log(courseOrders);

  return (
    <>
      {courseOrders.map((order) => {
        // const imageUrl = order.main_pic
        // ? order.main_pic.startsWith("http")
        //   ? order.main_pic
        //   : `http://localhost:5000${order.main_pic}`
        // : "/course/course_default.jpg"; // 預設圖片路徑

        return (
          <div key={order.id} className={`mt-2 ${couponStyles.suCouponCard}`}>
            <Link href="">
              <img
                src={`/course/img/${order.main_pic}`}
                // src="	http://localhost:5000/api/articles/image4.jpg"
                style={{
                  // width: "100%",
                  // height: "100%",
                  objectFit: "cover",
                }}
                alt={`課程訂單 ${order.id}`}
              />
            </Link>
            <div className={couponStyles.suDetails}>
              <Link href="" style={{ color: "#ff9538" }}>
                {order.name}
              </Link>
              <p className="text-muted">
                建立時間 : {order.order_date.split("T")[0]}
              </p>
            </div>
            <span className={couponStyles.suPrice}>
              NT$ {Number(order.total_price).toLocaleString()}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default Course;
