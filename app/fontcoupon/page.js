"use client";

import React, { useState } from "react";
import styles from "../../styles/modules/fontCoupon.module.css";
import Image from "next/image";
import Header from "../components/layout/header";
import { claimCoupon } from "@/services/couponService";
import Swal from "sweetalert2";

export default function CouponPage() {
  // 儲存 API 回傳的優惠券資訊
  const [selectedCoupon, setSelectedCoupon] = useState({
    name: "",
    code: "",
    expiry: "",
  });

  const handleClaimCoupon = async (couponId) => {
    try {
      const response = await claimCoupon(couponId);
      console.log("領取 API 回應：", response);

      if (!response || !response.success) {
        throw new Error(response?.message || "領取失敗");
      }

      const coupon = response.coupon;
      if (!coupon || !coupon.name || !coupon.code || !coupon.expiry) {
        throw new Error("回傳的優惠券資料有誤");
      }

      // 更新優惠券資訊
      setSelectedCoupon({
        name: coupon.name,
        code: coupon.code,
        expiry: coupon.expiry,
      });

      // 使用 SweetAlert 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "🎉 領取優惠券成功！",
        html: `
          <p class="fs-5 fw-bold text-primary">${coupon.name}</p>
          <p class="text-danger">優惠券代碼：${coupon.code}</p>
          <p class="text-muted">有效期限：${coupon.expiry}</p>
        `,
        confirmButtonText: "確認",
      });
    } catch (error) {
      console.error("領取優惠券失敗", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "發生錯誤，請稍後再試",
      });
    }
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "90px" }}>
        {/* 第一個優惠券區塊 */}
        <div className={`container-fluid ${styles.suCouponContainer}`}>
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-Y.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 全館優惠</div>
                    <div className={styles.suCouponCode}>NA5W5I9Q4C</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/07/05
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("40")}
                  >
                    點我領取
                  </button>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-Y.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 全館優惠</div>
                    <div className={styles.suCouponCode}>AC5K3K0C3J</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/04/17
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("68")}
                  >
                    點我領取
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二個區塊 (促銷圖片 + 3 張優惠券) */}
        <div className={`container-fluid ${styles.suSecondSection}`}>
          <div className="container">
            <div className="row align-items-center justify-content-between">
              {/* 左側圖片 */}
              <div className="col-lg-5 col-md-5 col-sm-12 text-center">
                <img
                  src="/hotel/hotel-images/page-image/coupon/ADS product.png"
                  alt="促銷圖片"
                  style={{ width: "100%", maxWidth: "430px", height: "auto" }}
                />
              </div>
              {/* 右側 3 張優惠券 */}
              <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-B.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 商品優惠</div>
                    <div className={styles.suCouponCode}>現折500元</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/06/30
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("8")}
                  >
                    點我領取
                  </button>
                </div>
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-B.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 商品優惠</div>
                    <div className={styles.suCouponCode}>現折200元</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/06/06
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("7")}
                  >
                    點我領取
                  </button>
                </div>
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-B.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 商品優惠</div>
                    <div className={styles.suCouponCode}>現折300元</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/05/05
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("10")}
                  >
                    點我領取
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第三個區塊 */}
        <div className={`container-fluid ${styles.suThirdSection}`}>
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-5 col-md-5 col-sm-12 mt-5 text-center">
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-Y.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 課程折扣優惠</div>
                    <div className={styles.suCouponCode}>DN3Z9Y7U7J</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/04/30
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("42")}
                  >
                    點我領取
                  </button>
                </div>

                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-Y.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 課程超值優惠</div>
                    <div className={styles.suCouponCode}>QX6P9W5Z3Z</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/07/18
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("33")}
                  >
                    點我領取
                  </button>
                </div>

                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-Y.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 課程限時優惠</div>
                    <div className={styles.suCouponCode}>XN8P4P5X8R</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/04/01
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("36")}
                  >
                    點我領取
                  </button>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                <img
                  src="/hotel/hotel-images/page-image/coupon/ADS-1.png"
                  alt="第二張促銷DM"
                  style={{
                    width: "100%",
                    maxWidth: "550px",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 第四個區塊 */}
        <div className={`container-fluid ${styles.suForthSection}`}>
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-5 col-md-5 col-sm-12 text-center">
                <video
                  className="coupon-video"
                  src="/hotel/hotel-images/page-image/coupon/ADS-7.mp4"
                  style={{ width: "100%", maxWidth: "550px", height: "auto" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onEnded={(e) => e.target.play()}
                ></video>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-G.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 旅館專屬優惠</div>
                    <div className={styles.suCouponCode}>HL2B5L5M7L</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/07/16
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("101")}
                  >
                    點我領取
                  </button>
                </div>

                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-B.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 限時旅館優惠</div>
                    <div className={styles.suCouponCode}>HL4X1W9H5X</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/04/10
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("136")}
                  >
                    點我領取
                  </button>
                </div>

                <div className={styles.suCoupon}>
                  <Image
                    src="/hotel/hotel-images/page-image/coupon/coupon-G.png"
                    alt="優惠券背景"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className={styles.img}
                  />
                  <div className={styles.suCouponContent}>
                    <div className={styles.suCouponName}>🐶 超激旅館優惠</div>
                    <div className={styles.suCouponCode}>DP6G3G0K9M</div>
                    <div className={styles.suCouponExpiry}>
                      有效期限：2025/04/26
                    </div>
                  </div>
                  <button
                    className={styles.suCouponButton}
                    type="button"
                    onClick={() => handleClaimCoupon("137")}
                  >
                    點我領取
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第五個區塊 */}
        <div className={`container-fluid ${styles.suFifthSection}`}>
          <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className={`user-event ${styles.suEvent}`}>
                  <h4 className={`mt-3 ${styles.suEventTitle}`}>首購會員</h4>
                  <h2 className={`mt-3 ${styles.suEventDiscount}`}>現折50</h2>
                  <p className={`mt-3 ${styles.suEventDesc}`}>
                    單筆消費滿 $500 即可使用
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className={styles.suEvent}>
                  <div className={styles.suEventIcon}>
                    <img
                      src="/hotel/hotel-images/page-image/coupon/shipping-fast.png"
                      alt="滿額免運"
                    />
                  </div>
                  <h5 className={`mt-1 ${styles.suEventTitle1}`}>滿額免運</h5>
                  <p className={`mt-3 ${styles.suEventDesc}`}>
                    超取 $1,500 / 宅配 $2,000
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className={styles.suEvent}>
                  <div className={styles.suEventIcon}>
                    <img
                      src="/hotel/hotel-images/page-image/coupon/coins-dollar-line.png"
                      alt="購物金回饋"
                    />
                  </div>
                  <h5 className={`mt-1 ${styles.suEventTitle1}`}>購物金回饋</h5>
                  <p className={`mt-3 ${styles.suEventDesc}`}>
                    會員最高享 <span className="text-danger">8%</span> 回饋
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}