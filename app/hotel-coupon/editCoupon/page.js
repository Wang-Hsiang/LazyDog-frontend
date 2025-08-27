"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getCouponById,
  updateCoupon,
  softDeleteCoupon,
} from "@/services/couponService";
import Header from "../../components/layout/header";
import My from "../../components/hotel/my";
import Swal from "sweetalert2"; 
import styles from "../../../styles/modules/operatorCamera.module.css";

export default function EditCouponPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponId = searchParams.get("id");
  const [coupon, setCoupon] = useState({
    name: "",
    description: "",
    discount_type: "fixed", 
    discountValue: "", 
    minAmount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    status: "",
    remainingUses: "",
    notes: "",
    code: "",
  });

  useEffect(() => {
    if (!couponId) {
      Swal.fire("錯誤", "無效的優惠券 ID", "error");
      router.push("/hotel-coupon/couponList");
      return;
    }

    const fetchCoupon = async () => {
      try {
        const data = await getCouponById(couponId);
        console.log("編輯優惠券數據:", data);

        if (data) {
          setCoupon({
            name: data.name || "",
            description: data.content || "",
            discount_type: data.discount_type || "fixed",
            discountValue: data.value || "",
            minAmount: data.min_order_value || "0",
            usageLimit: data.max_usage || "0",
            startDate: data.start_time ? data.start_time.split("T")[0] : "",
            endDate: data.end_time ? data.end_time.split("T")[0] : "",
            status: data.status || "active",
            remainingUses: data.max_usage_per_user || "0",
            notes: "優惠券不得與其他折扣活動併用",
            code: data.code || "",
          });
        }
      } catch (error) {
        console.error("獲取優惠券失敗:", error);
        Swal.fire("錯誤", "獲取優惠券失敗", "error");
      }
    };

    fetchCoupon();
  }, [couponId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 確保所有欄位都有值
    if (
      !coupon.name ||
      !coupon.description ||
      !coupon.discount_type ||
      !coupon.discountValue ||
      !coupon.minAmount ||
      !coupon.usageLimit ||
      !coupon.startDate ||
      !coupon.endDate ||
      !coupon.status ||
      !coupon.remainingUses
    ) {
      Swal.fire("錯誤", "請填寫所有必填欄位", "error");
      return;
    }

    // 確保 `discount_type` 不會是 undefined
    const discountType = coupon.discount_type
      ? coupon.discount_type.toLowerCase()
      : "fixed";

    // 確保時間格式正確
    const startTime = coupon.startDate ? `${coupon.startDate}T00:00:00Z` : "";
    const endTime = coupon.endDate ? `${coupon.endDate}T23:59:59Z` : "";

    // 格式化資料
    const formattedCoupon = {
      name: coupon.name,
      content: coupon.description,
      value: isNaN(Number(coupon.discountValue))
        ? 0
        : Number(coupon.discountValue), 
      min_order_value: isNaN(Number(coupon.minAmount))
        ? 0
        : Number(coupon.minAmount),
      start_time: startTime,
      end_time: endTime,
      status: coupon.status || "active", 
      max_usage: isNaN(Number(coupon.usageLimit))
        ? 1
        : Number(coupon.usageLimit), 
      max_usage_per_user: isNaN(Number(coupon.remainingUses))
        ? 1
        : Number(coupon.remainingUses), 
      code: coupon.code || "DEFAULTCODE",
      discount_type: discountType, 
    };

    console.log(" 送出的資料:", formattedCoupon);

    try {
      const result = await updateCoupon(couponId, formattedCoupon);
      console.log("更新回應:", result);

      if (result.success) {
        Swal.fire("成功", "優惠券更新成功", "success");
        router.push("/hotel-coupon/couponList");
      } else {
        Swal.fire("更新失敗", result.message, "error");
      }
    } catch (error) {
      Swal.fire("更新失敗", "發生錯誤，無法更新優惠券", "error");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("確定要刪除此優惠券嗎？");
    if (!confirmDelete) return;

    try {
      const result = await softDeleteCoupon(couponId);
      if (result.success) {
        Swal.fire("已刪除", "優惠券已刪除", "success");
        router.push("/hotel-coupon/couponList");
      } else {
        Swal.fire("刪除失敗", result.message, "error");
      }
    } catch (error) {
      Swal.fire("刪除失敗", "發生錯誤，無法刪除優惠券", "error");
     
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <My />
          <div className="col-12 col-md-9 mx-auto">
            <h3 className="mb-4">編輯優惠券</h3>

            {/* 基本資訊 */}
            <div className="p-4 border rounded bg-light mb-4">
              <h5 className="mb-3">基本資訊</h5>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">優惠券名稱 *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={coupon.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">優惠券代碼 *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={coupon.code}
                    readOnly
                  />
                </div>
                <div className="col-md-12 mt-3">
                  <label className="form-label">描述 *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={coupon.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 使用條件 */}
            <div className="p-4 border rounded bg-light mb-4">
              <h5 className="mb-3">使用條件</h5>
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">折扣類型</label>
                  <select
                    className="form-select"
                    name="discount_type"
                    value={coupon.discount_type}
                    onChange={handleChange}
                  >
                    <option value="fixed">固定金額</option>
                    <option value="percentage">百分比</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {coupon.discount_type === "fixed"
                      ? "優惠金額"
                      : "折扣百分比"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="discountValue"
                    value={coupon.discountValue}
                    onChange={handleChange}
                    placeholder={
                      coupon.discount_type === "fixed"
                        ? "例如：100"
                        : "例如：10%"
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">最低使用金額</label>
                  <input
                    type="text"
                    className="form-control"
                    name="minAmount"
                    value={coupon.minAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">使用次數</label>
                  <input
                    type="text"
                    className="form-control"
                    name="usageLimit"
                    value={coupon.usageLimit}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 有效期限 */}
            <div className="p-4 border rounded bg-light mb-4">
              <h5 className="mb-3">有效期限</h5>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">開始日期</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={coupon.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">結束日期</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={coupon.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 其他資訊 */}
            <div className="p-4 border rounded bg-light mb-4">
              <h5 className="mb-3">其他資訊</h5>
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">適用對象</label>
                  <select
                    className="form-select"
                    name="targetAudience"
                    value={coupon.targetAudience}
                    onChange={handleChange}
                  >
                    <option>所有用戶</option>
                    <option>會員限定</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">使用狀態</label>
                  <select
                    className="form-select"
                    name="status"
                    value={coupon.status}
                    onChange={handleChange}
                  >
                    <option>啟用</option>
                    <option>已過期</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">剩餘可用次數</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remainingUses"
                    value={coupon.remainingUses}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">注意事項</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={coupon.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 按鈕區 */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className={`btn  btn-sm px-4 ${styles.btn3}`}
                onClick={() => router.push("/hotel-coupon/couponList")}
              >
                返回
              </button>
              <button
                type="submit"
                className={`btn btn-sm px-4 ${styles.btn}`}
                onClick={handleSubmit}
              >
                儲存
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 ${styles.btn2}`}
                onClick={handleDelete}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
