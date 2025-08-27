"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Swal from "sweetalert2";

export function useReviewsUpdate({
  id = "",
  productID = "",
  newRate = 0,
  comment = "",
  setRateUpdate = () => {},
  deleteRate = false,
  setDeleteRate = () => {},
  mutate = () => {},
}) {
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 宣告SWR url來源
  const reviewsAPI = id
    ? `http://localhost:5000/api/products/reviews?userID=${id}`
    : null;
  // 使用SWR獲得評論資料
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    mutate: reviewsMutate,
  } = useSWR(reviewsAPI, fetcher);
  // 預先設定寫入資料庫的表單格式
  const [formData, setFormData] = useState({
    userID: `${id}`,
    productID: productID,
    rating: newRate,
    comment: comment,
    isDeleted: 0,
  });
  // 阻止預設表單送出，變更為手動送出更新表單內容
  const handleSubmit = (event) => {
    event.preventDefault();
    updateReviews(formData);
    setRateUpdate(false);
  };
  // 更新表單內容函式
  const reviewsChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    setFormData({
      ...formData,
      rating: newRate,
    });
  }, [newRate]);
  useEffect(() => {
    if (deleteRate) {
      Swal.fire({
        icon: "info",
        title: "您確定要刪除您的評論嗎？",
        showConfirmButton: true,
        confirmButtonText: "我再想想",
        confirmButtonColor: "#bcbcbc ", // 設定按鈕顏色
        showCancelButton: true, // 顯示取消按鈕
        cancelButtonText: "忍痛刪除", // 設定取消按鈕文字
        cancelButtonColor: "#dc3545", // 設定取消按鈕顏色
      }).then((result) => {
        if (result.isDismissed) {
          setFormData({
            ...formData,
            isDeleted: 1,
          });
          setRateUpdate(false);
          setDeleteRate(false);
        } else {
          setRateUpdate(false);
          setDeleteRate(false);
          return;
        }
      });
    }
  }, [deleteRate]);
  useEffect(() => {
    if (formData.isDeleted == 1) {
      updateReviews(formData);
    }
  }, [formData]);

  async function updateReviews(form) {
    let methodType = "PATCH";
    if (reviewsData?.data) {
      if (
        !reviewsData?.data?.find(
          (v) => v.productID == productID && v.is_deleted == 0
        )
      ) {
        methodType = "POST";
      }
    }
    if (id > 0) {
      let API = "http://localhost:5000/api/products/reviews";
      const formData = new FormData();
      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          formData.append(key, form[key]);
        }
      }
      try {
        const res = await fetch(API, {
          method: methodType,
          body: formData,
        });
        const result = await res.json();
        if (result.status != "success") throw new Error(result.message);
        if (methodType == "POST") {
          Swal.fire({
            icon: "success",
            title: "新增評論成功",
            showConfirmButton: false,
            timer: 1000, // 1.5 秒後自動關閉
          });
        } else if (form.isDeleted == 1) {
          Swal.fire({
            icon: "success",
            title: "刪除評論成功",
            showConfirmButton: false,
            timer: 1000, // 1.5 秒後自動關閉
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "更新評論成功",
            showConfirmButton: false,
            timer: 1000, // 1.5 秒後自動關閉
          });
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
    reviewsMutate();
    mutate();
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    reviewsChange,
    reviewsLoading,
    reviewsMutate,
  };
}
