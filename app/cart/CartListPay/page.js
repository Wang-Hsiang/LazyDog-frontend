"use client";

import React, { useState, useEffect, useRef } from "react";
// import "../css/CartListPay.css";
import { isDev, apiURL } from "@/config";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart"; // 引入useCart以便取得購物車資料
import { useOrder } from "@/hooks/use-order";
import { useCoupons } from "@/hooks/use-coupon";
import Header from "../../components/layout/header";
// import input from "../../components/forms/input";
// import inputFiled from "../../components/forms/inputField";
import styles from "../css/CartList.module.css";
import Hotel from "../../components/cart/hotel";
import Course from "../../components/cart/course";
export default function CartListPayPage(props) {
  const { user } = useAuth();
  const [productOrder, setProductOrder] = useState({
    user_id: "",
    orderID: "",
    coupon_id: "",
    discount_amount: "",
    productID_list: [],
    price_list: [],
    amount_list: [],
    total_price: "",
    final_amount: "",
    created_at: "",
    is_deleted: "",
  });
  const [hotelOrder, setHotelOrder] = useState({});

  const [courseOrder, setCourseOrder] = useState({});

  // 檢查是否登入
  const { isAuth } = useAuth();
  // 建立ref，用來放置form表單
  const payFormDiv = useRef(null);
  // 建立ref，用來放置金額
  const amountRef = useRef(null);
  // 建立ref，用來放置商品名稱
  const itemsRef = useRef(null);

  // 從useCart取得購物車資料
  // 購物車資料
  const {
    productItems,
    courseItems,
    hotelItems,
    totalProductAmount,
    totalCourseAmount,
    totalHotelAmount,
  } = useCart();
  const totalAmount = totalProductAmount + totalCourseAmount + totalHotelAmount;

  // 根據購物車類型選擇 `orderTable`//看要不要拔除 //看要不要拔除
  let orderTable = "";
  if (hotelItems.length > 0) orderTable = "hotel_order";
  if (productItems.length > 0) orderTable = "yi_orderlist";
  if (courseItems.length > 0) orderTable = "course_orders";

  const {
    availableCoupons,
    selectedCoupon,
    setSelectedCoupon,
    discountAmount,
    setDiscountAmount,
    finalAmount,
    calculateDiscount,
    applyCoupon,
  } = useCoupons(
    totalAmount,
    productOrder?.orderID || hotelOrder?.orderID,
    orderTable,
    user?.token,
    user?.id
  );

  const { createProductOrder, createHotelOrder, createCourseOrder } =
    useOrder();
  // 確保商品資料正確
  const itemsValue = `
  ${productItems.map((item) => `${item.name} x ${item.count}`).join(", ")}#
  ${courseItems.map((item) => `${item.name} x ${item.count}`).join(", ")}#
  ${hotelItems.map((item) => `${item.name} x ${item.count}`).join(", ")}
`;

  // const amountValue = totalProductAmount;
  // const amountValue = totalProductAmount + totalCourseAmount + totalHotelAmount;

  const productItemsValue = productItems
    .map((item) => `${item.name} x ${item.count}`)
    .join(", ");

  // 處理課程資料
  const courseItemsValue = courseItems
    .map((item) => `${item.name} x ${item.count}`)
    .join(", ");

  // 處理旅館資料
  const hotelItemsValue = hotelItems
    .map((item) => `${item.name} x ${item.count}`)
    .join(", ");

  const createEcpayForm = (params, action) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }
    // 回傳form表單的物件參照
    return payFormDiv.current.appendChild(form);
  };

  const handleEcpay = async () => {
    if (!user || !user.id) {
      toast.error("請先登入後再進行結帳");
      return;
    }

    //  先產生訂單 ID
    const orderId = `PD${new Date().getTime()}`;

    let computedFinalAmount = totalAmount;
    if (courseItems.length > 0) {
      for (const courseItem of courseItems) {
        const newOrder = {
          course_id: courseItem.id,
          user_id: user.id,
          quanity: courseItem.count,
          total_price: courseItem.price * courseItem.count,
          payment_status: "Unpaid",
          payment_method: courseItem.payment_method || "Not Specified",
          cancellation_policy:
            courseItem.cancellation_policy || "Standard Policy",
          remark: courseItem.remark || "",
          orderTable,
        };
        await createCourseOrder(newOrder, orderTable);
      }
    }
    try {
      //  先建立訂單
      // 商品訂單
      if (productItems.length > 0) {
        const newOrder = {
          user_id: user.id,
          orderID: orderId,
          coupon_id: selectedCoupon || "",
          discount_amount: discountAmount,
          productID_list: productItems.map((item) => item.productID),
          price_list: productItems.map((item) => item.price),
          amount_list: productItems.map((item) => item.count),
          total_price: totalProductAmount,
          final_amount: totalProductAmount - discountAmount,
          created_at: new Date(),
          is_deleted: 0,
          payment_status: "Unpaid",
          orderTable,
        };
        await createProductOrder(newOrder, orderTable);
        computedFinalAmount = newOrder.final_amount;
      }
      // 課程訂單

      // 旅館訂單
      if (hotelItems.length > 0) {
        for (const hotelItem of hotelItems) {
          const newOrder = {
            room_id: hotelItem.id,
            hotel_id: hotelItem.hotelId,
            user_id: user.id,
            dog_count: hotelItem.count,
            check_in: hotelItem.checkInDate,
            check_out: hotelItem.checkOutDate,
            total_price: totalHotelAmount,
            final_amount: totalHotelAmount - discountAmount,
            payment_status: "Unpaid",
            remark: "",
            orderTable,
            coupon_id: selectedCoupon || null,
          };
          await createHotelOrder(newOrder, orderTable);
          computedFinalAmount = newOrder.final_amount;
        }
      }

      //  訂單建立完成後，再使用優惠券
      if (selectedCoupon && selectedCoupon !== "") {
        // 只有當 selectedCoupon 有值時才使用優惠券
        await applyCoupon(selectedCoupon, orderId, orderTable, user.id);
      }

      const res = await fetch(
        `http://localhost:5000/ecpay-test-only?amount=${computedFinalAmount}&items=${itemsValue}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const resData = await res.json();
      if (isDev) console.log(resData);

      if (resData.status == "success") {
        const payForm = createEcpayForm(
          resData.data.params,
          resData.data.action
        );
        if (window.confirm("確認要導向至ECPay(綠界金流)進行付款?")) {
          payForm.submit();
        }
      } else {
        toast.error("付款失敗");
      }
    } catch (error) {
      toast.error("訂單建立或優惠券應用失敗，請稍後再試");
    }
  };
  return (
    <>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <div className="cart-img">
          <img
            src="/cart/Frame 35909.png"
            alt="Cart Image"
            style={{
              display: "block" /* 使圖片成為區塊級元素 */,
              margin: "0 auto" /* 水平置中 */,
              maxWidth: "100%" /* 限制最大寬度 */,
              height: "auto" /* 保持比例 */,
            }}
          />
        </div>
        <div className={`container lumi-all-wrapper ${styles.container}`}>
          <h4 className="mb-5">購買資訊</h4>
          <form>
            <div className="row">
              <main className={`col-lg-5 col-md-auto col-auto me-5`}>
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <label htmlFor="first-name" className="form-label">
                      姓氏 <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last-name" className="form-label">
                      名字 <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                {/* 地址 */}
                <div className="mb-3">
                  <label htmlFor="adress" className="form-label">
                    地址 <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="adress"
                    name="adress"
                    className="form-control"
                    required
                  />
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    required
                  />
                </div>
                {/* 電話 */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    電話 <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    required
                  />
                </div>
              </main>
              <aside className={`col-lg-6 col-12 ${styles.list}`}>
                <div className={`aside1 ${styles.main}`}>
                  <div className={`d-flex justify-content-between mb-4 `}>
                    <span className={styles.text}>商品明細</span>
                    {/* <span>Subtotal</span> */}
                  </div>

                  {productItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {item.name} x {item.count}
                      </span>
                      <span>
                        NT$ {Number(item.price * item.count).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {courseItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {item.name} x {item.count}
                      </span>
                      <span>
                        NT$ {Number(item.price * item.count).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {hotelItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {item.name} x {item.count}
                      </span>
                      <span>
                        NT$ {Number(item.price * item.count).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="d-flex flex-column mt-4">
                    {/* 優惠券選擇 */}
                    <label className="mb-3">使用優惠券</label>
                    <select
                      className="form-select"
                      value={selectedCoupon || ""}
                      onChange={(e) =>
                        setSelectedCoupon(e.target.value || null)
                      }
                    >
                      <option value="">不使用優惠券</option>
                      {availableCoupons.map((coupon) => (
                        <option
                          key={coupon.id}
                          value={coupon.id}
                          disabled={totalAmount < coupon.min_order_value} // 低消未達標的優惠券無法選擇
                        >
                          {coupon.name} - {coupon.value}{" "}
                          {coupon.discount_type === "percentage" ? "%" : "NT$"}{" "}
                          (低消 NT$ {coupon.min_order_value})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 折扣金額與最終金額 */}
                  <div className="d-flex justify-content-between mt-4">
                    <span className="subtext">折扣金額</span>
                    <span>- NT$ {Number(discountAmount).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <span className="subtext">最終金額</span>
                    <span>NT$ {Number(finalAmount).toLocaleString()}</span>
                  </div>

                  {/* 付款按鈕 */}
                  <button
                    className={`mt-5 ${styles.btn1}`}
                    type="button"
                    onClick={handleEcpay}
                  >
                    付款
                  </button>
                </div>
              </aside>
            </div>

            <div ref={payFormDiv}></div>
          </form>
        </div>
      </div>
    </>
  );
}
