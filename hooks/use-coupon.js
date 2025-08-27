import { useState, useEffect, useMemo } from "react";
import { getCouponss, getCoupons, useCoupon } from "@/services/couponService";
import Swal from "sweetalert2";

export function useCoupons(cartTotal, orderId, orderTable, token, userId) {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [error, setError] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // 計算最終金額
  const finalAmount = useMemo(() => {
    return Math.max(cartTotal - discountAmount, 0); // 確保不會變成負數
  }, [cartTotal, discountAmount]);

  // 取得可用的優惠券 (從 coupon_usage 查找擁有的優惠券，再從 coupons 查詳細資料)
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const usageResponse = await getCouponss("claimed", "all");

        if (!usageResponse.success || !usageResponse.data) {
          Swal.fire("獲取優惠券失敗", "無法獲取優惠券", "error");
          return;
        }

        const couponIds = usageResponse.data.map((u) => u.coupon_id);

        if (couponIds.length == 0) {
          setAvailableCoupons([]);
          return;
        }

        const couponsResponse = await getCoupons(couponIds);
        if (couponsResponse.success) {
          const coupons = couponsResponse.data.map((c) => ({
            id: c.id,
            name: c.name,
            value: Math.floor(c.value), // 確保去除小數點
            discount_type: c.type,
            min_order_value: Math.floor(c.min_order_value),
          }));

          setAvailableCoupons(coupons);
        } else {
          Swal.fire("獲取優惠券失敗", "無法獲取優惠券", "error");
        }
      } catch (error) {
        Swal.fire("獲取優惠券失敗", "發生錯誤，無法獲取優惠券", "error");
      }
    };

    fetchCoupons();
  }, []);
  const setValidCoupon = (couponId) => {
    if (couponId === "") {
      setSelectedCoupon(null);
      setDiscountAmount(0);
      setCouponError(null); // 清除錯誤
      return;
    }

    const selected = availableCoupons.find((c) => c.id == Number(couponId));

    if (!selected) {
      setCouponError("選擇的優惠券不存在"); // 設定錯誤
      return;
    }

    if (selected.min_order_value > cartTotal) {
      setCouponError(`此優惠券最低消費需達 NT$${selected.min_order_value}`);
      return;
    }

    setSelectedCoupon(selected.id);
    setCouponError(null); // 清除錯誤
  };

  // 計算折扣金額
  const calculateDiscount = (couponId) => {
    const coupon = availableCoupons.find((c) => c.id == Number(couponId));

    if (!coupon) {
      return 0; // 不要彈出錯誤，而是直接返回 0
    }

    let discount = 0;
    if (coupon.discount_type == "percentage") {
      discount = (cartTotal * coupon.value) / 100;
    } else {
      discount = Math.min(coupon.value, cartTotal);
    }

    return Math.floor(discount);
  };

  //  變化並更新折扣金額
  useEffect(() => {
    if (!selectedCoupon) {
      setDiscountAmount(0);
      return;
    }

    const discount = calculateDiscount(selectedCoupon);
    setDiscountAmount(discount);
  }, [selectedCoupon, cartTotal]);

  // 使用優惠券
  const applyCoupon = async (couponId) => {
    if (!couponId || couponId == "") {
      return;
    }

    const coupon = availableCoupons.find((c) => c.id == Number(couponId));
    if (!coupon) {
      setCouponError("選擇的優惠券不存在");
      return;
    }

    if (!orderId || !userId) {
      setCouponError("訂單資訊不完整，請稍後再試");
      return;
    }

    let correctOrderTable = orderTable;
    if (coupon.discount_type == "hotel") correctOrderTable = "hotel_order";
    if (coupon.discount_type == "product") correctOrderTable = "yi_orderlist";
    if (coupon.discount_type == "course") correctOrderTable = "course_orders";

    try {
      const response = await fetch(
        `http://localhost:5000/api/coupon/usage/use/${coupon.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: Number(userId),
            orderId,
            orderTable: correctOrderTable, 
            couponId: Number(coupon.id),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setCouponError(data.message || "優惠券無法使用");
        return;
      }

      Swal.fire("成功", "優惠券已使用成功", "success");
    } catch (error) {
      Swal.fire("錯誤", "無法使用優惠券，請稍後再試", "error");
    }
  };

  return {
    availableCoupons,
    selectedCoupon,
    setSelectedCoupon: setValidCoupon,
    discountAmount,
    finalAmount,
    setDiscountAmount,
    calculateDiscount,
    applyCoupon,
    error,
  };
}
