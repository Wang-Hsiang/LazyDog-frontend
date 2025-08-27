"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./rate.module.css";
import StarGroup from "./stargroup";
import Swal from "sweetalert2";
import { MoonLoader } from "react-spinners";

import { useAuth } from "@/hooks/use-auth";
import useScreenSize from "@/hooks/product/use-Screen";
import { useReviewsUpdate } from "@/hooks/product/use-reviews";

export default function Ratecard({
  rateNow = false,
  history = false,
  id = "",
  productID = "",
  userName = "",
  img = "",
  rate = "",
  comment = "",
  goodNum = 0,
  date = "",
  mutate = () => {},
}) {
  const { width } = useScreenSize();
  const router = useRouter();
  const { user } = useAuth();
  const rateNum = rate ? rate.toString() : "";
  const years = date ? date.slice(0, 4) : "";
  const months = date ? date.slice(5, 7) : "";
  const days = date ? date.slice(8, 10) : "";
  const [hover, setHover] = useState(false);
  const [good, setGood] = useState(false);
  const [rateUpdate, setRateUpdate] = useState(false);
  const [newRate, setNewRate] = useState(rateNum || 1);
  const [deleteRate, setDeleteRate] = useState(false);
  const [userPic, setUserPic] = useState(`http://localhost:5000/auth/${img}`);
  const {
    formData,
    handleSubmit,
    reviewsChange,
    reviewsLoading,
    reviewsMutate,
  } = useReviewsUpdate({
    id,
    productID,
    newRate,
    comment,
    setRateUpdate,
    deleteRate,
    setDeleteRate,
    mutate,
  });
  const handleAddFavorite = async () => {
    if (!user?.id > 0) {
      Swal.fire({
        icon: "info",
        title: "請先登入",
        text: "您需要登入才能幫他人點讚！",
        showConfirmButton: true,
        confirmButtonText: "前往登入",
        confirmButtonColor: "#66c5bd", // 設定按鈕顏色
        showCancelButton: true, // 顯示取消按鈕
        cancelButtonText: "繼續逛街", // 設定取消按鈕文字
        cancelButtonColor: "#bcbcbc", // 設定取消按鈕顏色
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/user"); // 跳轉到登入頁面
        }
      });
      return;
    }
    try {
      const goodForm = {
        userID: id,
        productID: productID,
        good: goodNum,
      };
      if (!good) {
        setGood(!good);
        goodForm.good = goodNum + 1;
      } else {
        setGood(!good);
        goodForm.good = goodNum - 1;
      }
      let API = "http://localhost:5000/api/products/reviews";
      const formData = new FormData();
      for (const key in goodForm) {
        if (goodForm.hasOwnProperty(key)) {
          formData.append(key, goodForm[key]);
        }
      }
      try {
        const res = await fetch(API, {
          method: "PATCH",
          body: formData,
        });
        const result = await res.json();
        if (result.status != "success") throw new Error(result.message);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
      reviewsMutate();
      mutate();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "點讚更新失敗",
        text: "請稍後重試！",
      });
    }
  };

  return (
    <>
      {reviewsLoading ? (
        <div
          className={`${styles.RateCard}`}
          style={{
            height: "165px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoonLoader color="#f5842b" speedMultiplier={1} />
        </div>
      ) : (
        <div className={`${styles.RateCard}`}>
          {!rateUpdate && !history && (
            <>
              <div className={styles.RateCardText}>
                <div className={styles.RateCardUser}>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeout(() => {
                        router.push("/user");
                      }, 100);
                    }}
                  >
                    <img
                      src={userPic}
                      onError={() =>
                        setUserPic(`http://localhost:5000/auth/dog5.png`)
                      }
                      alt=""
                    />
                    <h6>{userName}</h6>
                    <h6>{rateNow ? "(您)" : ""}</h6>
                  </button>
                  <div className={styles.StarGroup}>
                    <StarGroup rate={rateNum} />
                  </div>
                </div>
                <p>{comment}</p>
              </div>
              <div className={styles.RateCardBtnDate}>
                <div className={styles.RateCardGood}>
                  <button
                    className={styles.RateCardBtn}
                    type="button"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => {
                      handleAddFavorite();
                    }}
                  >
                    <img
                      src={`/product/font/${
                        good || hover ? "good-fill" : "good"
                      }.png`}
                      alt=""
                    />
                  </button>
                  <p>{goodNum}</p>
                </div>
                {rateNow && (
                  <button
                    className={styles.UpdateRateBtn}
                    type="button"
                    onClick={() => setRateUpdate(true)}
                  >
                    編輯評論
                  </button>
                )}
                <p>
                  {years} {months} {days}
                </p>
              </div>
            </>
          )}
          {rateUpdate && (
            <form onSubmit={handleSubmit}>
              <div className={styles.RateCardText}>
                <div className={styles.RateCardUser}>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeout(() => {
                        router.push("/user");
                      }, 100);
                    }}
                  >
                    <img
                      src={userPic}
                      onError={() =>
                        setUserPic(`http://localhost:5000/auth/dog5.png`)
                      }
                      alt=""
                    />
                    <h6>{userName}</h6>
                    <h6 style={{ fontSize: "12px" }}>
                      {rateNow ? "(您)" : ""}
                    </h6>
                  </button>
                  <div className={styles.StarGroup}>
                    <p>評分更新：</p>
                    <StarGroup
                      rateUpdate={rateUpdate}
                      rate={rateNum}
                      newRate={newRate}
                      setNewRate={setNewRate}
                    />
                  </div>
                </div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={reviewsChange}
                />
              </div>
              <div className={styles.RateCardBtnDate}>
                <div style={{ width: "47.13px" }}>
                  <button
                    style={{ "white-space": "nowrap" }}
                    type="button"
                    className={styles.UpdateRateBtn}
                    onClick={() => {
                      setDeleteRate(true);
                    }}
                  >
                    刪除評論
                  </button>
                </div>
                {rateNow && (
                  <button type="submit" className={styles.UpdateRateBtn}>
                    更新評論
                  </button>
                )}
                <p>
                  {years} {months} {days}
                </p>
              </div>
            </form>
          )}
          {history && (
            <form onSubmit={handleSubmit}>
              <div className={styles.RateCardText}>
                <div className={styles.RateCardUser}>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeout(() => {
                        router.push("/user");
                      }, 100);
                    }}
                  >
                    <img
                      src={userPic}
                      onError={() =>
                        setUserPic(`http://localhost:5000/auth/dog5.png`)
                      }
                      alt=""
                    />
                    <h6>{userName}</h6>
                    <h6 style={{ fontSize: "12px" }}>
                      {rateNow && width > 499
                        ? `(您已購買過此商品)`
                        : width < 500
                        ? "(已購買)"
                        : ""}
                    </h6>
                  </button>
                  <div className={styles.StarGroup}>
                    <p style={{ display: width < 500 ? "none" : "" }}>評分：</p>
                    <StarGroup
                      rateUpdate={true}
                      rate={"1"}
                      newRate={newRate}
                      setNewRate={setNewRate}
                    />
                  </div>
                </div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={reviewsChange}
                />
              </div>
              <div className={styles.RateCardBtnDate}>
                <div style={{ width: "47.13px" }}></div>
                {rateNow && (
                  <button type="submit" className={styles.UpdateRateBtn}>
                    留下您寶貴的評論
                  </button>
                )}
                <p>
                  {years} {months} {days}
                </p>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
