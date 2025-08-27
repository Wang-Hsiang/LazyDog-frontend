import React from "react";
import Link from "next/link"; // 如果你使用的是 Next.js 的 Link 元件
import couponStyles from "./userCoupon.module.css";

const Product = ({ orders }) => {
  //過濾出商品類型的訂單
  const productOrders = orders.filter((order) => order.orderID);
  console.log(productOrders);

  return (
    <>
      {productOrders.map((order) => (
        <div
          key={order.orderID}
          className={`mt-2 ${couponStyles.suCouponCard}`}
        >
          <Link href="">
            <img
              src={`/product/img/${order.imageResult[0].name}${
                order.imageResult[0].lg_img.split(",")[0]
              }`}
              // style={{
              // width: "180px",
              // maxHeight: "100",
              // objectFit: "cover",
              // }}
              alt={order.orderID}
            />
          </Link>
          <div className={couponStyles.suDetails}>
            <Link href="" style={{ color: "#ff9538" }}>
              訂單編號 : {order.orderID}
            </Link>
            <p className="text-muted">
              訂購時間 : {order.created_at.split("T")[0]}
            </p>
          </div>
          <span className={couponStyles.suPrice}>
            NT$ {Math.floor(order.final_amount).toLocaleString()}
          </span>
        </div>
      ))}
    </>
  );
};

export default Product;
