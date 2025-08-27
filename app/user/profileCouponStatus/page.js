"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/modules/operatorCamera.module.css";
import couponStyles from "../../../styles/modules/userCoupon.module.css";
import { useRouter } from "next/navigation";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import Header from "../../components/layout/header";
import MyMenu from "../../components/layout/myMenu";
import {  getCouponss, claimCouponByCode } from "@/services/couponService";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileCouponPage(props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]); // 優惠券列表
  const [couponCode, setCouponCode] = useState(""); // 優惠券代碼
  const [error, setError] = useState(""); // 錯誤訊息
  const [selectedCategory, setSelectedCategory] = useState("全部"); // 當前選擇的分類
  const userId = user?.id;

  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/hotel/hotel-images/page-image/Dog5.png");

  // 分類標籤
  const categories = [ "全部", "已使用", "未使用", "逾期"];

  // 對應後端的 `coupon_usage.status`
  const statusMapping = {
    "全部": "all",
    "已使用": "used",
    "未使用": "claimed",
    "逾期": "expired"
  };

  // 取得優惠券
  useEffect(() => {
    if (!userId) return;

    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const filter = statusMapping[selectedCategory] || "all";
        const response = await getCouponss(filter, "all");

        if (response && response.success) {
          const mappedCoupons = response.data.map((coupon) => ({
            id: coupon.id,
            status:
              coupon.status === "claimed"
                ? "未使用"
                : coupon.status === "used"
                ? "已使用"
                : "逾期",
            price: coupon.value,
            description: coupon.name,
            expiry: `${new Date(coupon.start_time).toLocaleDateString()} - ${new Date(
              coupon.end_time
            ).toLocaleDateString()}`
          }));

          setCoupons(mappedCoupons);
        } else {
          setError(response?.error || "獲取優惠券失敗，請稍後再試");
        }
      } catch (error) {
        setError("獲取優惠券失敗，請稍後再試");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [userId, selectedCategory]);

  // 領取優惠券
  const handleClaimCoupon = async () => {
    setError(""); // 清除錯誤
    if (!couponCode.trim()) {
      setError("請輸入優惠券代碼");
      return;
    }

    try {
      const response = await claimCouponByCode(couponCode);
      if (response.success) {
        alert("優惠券領取成功！");
        setCouponCode(""); // 清空輸入框
        // 重新獲取優惠券
        const updatedCoupons = await getCouponss("all", "all");
        setCoupons(updatedCoupons.data || []);
      } else {
        setError(response.error || "領取優惠券失敗，請檢查代碼是否正確");
      }
    } catch (error) {
      console.error("領取優惠券時發生錯誤：", error);
      setError("發生錯誤，請稍後再試");
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("loginWithToken");
    if (!token) {
      console.warn("沒有 Token，請重新登入");
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // 解析 JWT Token
      return payload.id;
    } catch (error) {
      console.error("Token 解析失敗:", error);
      return null;
    }
  };

  const changepage = (path) => {
    if (path) {
      const userId = getUserIdFromToken();
      if (!userId) return;

      router.push(`/hotel-coupon/${path}?userId=${userId}`);
    }
  };

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // 根據選擇的分類過濾優惠券
  const filteredCoupons =
    selectedCategory === "全部"
      ? coupons
      : coupons.filter((coupon) => coupon.status === selectedCategory);

  if (loading) {
    return <p>加載中...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* 左側 */}
          <div className="d-none d-md-block col-md-3">
            <MyMenu />
          </div>
          {/* 右側 */}
          <div className="col-12 col-md-9 coupon-section">
            <h5 className="mb-3">我的優惠券</h5>

            <div className="suFeatureLinks mb-3">
              <a
                className={couponStyles.suFeatureLinks1}
                onClick={() => changepage("fontcoupon")}
                style={{ cursor: "pointer" }}
              >
                領取免運券
              </a>
              <a
                className={couponStyles.suFeatureLinks2}
                onClick={() => changepage("profileCouponStatus")}
                style={{ cursor: "pointer" }}
              >
                查看歷史紀錄
              </a>
            </div>

            {/* 優惠券輸入 */}
            <div className={couponStyles.suCouponInputGroup}>
              <input
                type="text"
                className="form-control"
                placeholder="請輸入優惠代碼"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleClaimCoupon}>
                領取
              </button>
            </div>

            {/* 錯誤訊息顯示 */}
            {error && <p className="text-danger mt-2">{error}</p>}

            {/* 優惠券分類標籤 */}
            <ul className={`nav ${couponStyles.suNavTabs}`}>
              {categories.map((category) => (
                <li key={category} className="nav-item">
                  <a
                    className={`nav-link ${
                      selectedCategory === category ? "active" : ""
                    } ${couponStyles.suNavLink}`}
                    href="#"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>

            {/* 優惠券列表 */}
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`mt-2 ${couponStyles.suCouponCard}`}
                >
                  <span className={couponStyles.suPrice}>
                    NT{coupon.price || 0}
                  </span>
                  <div className={couponStyles.suDetails}>
                    <p>
                      <strong>{coupon.description || "未命名優惠券"}</strong>
                    </p>
                    <p className="text-muted">
                      有效期限: {coupon.expiry || "無期限"}
                    </p>
                    {coupon.status === "逾期" && (
                      <p className={couponStyles.suExpired}>⚠ 已逾期</p>
                    )}
                    {coupon.status === "已使用" && (
                      <p className={couponStyles.suUsed}>⚠ 已使用</p>
                    )}
                    {coupon.status === "未使用" && (
                      <p className={couponStyles.suUnused}>可使用</p>
                    )}
                  </div>
                  <div className={couponStyles.suAction}>
                    <a href="#">前往購物</a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted mt-3">目前沒有符合此分類的優惠券</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}