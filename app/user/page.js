"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAuth } from "@/hooks/use-auth";
import Input from "../components/forms/Input";
import styles from "./menu.module.css";
import TWZipCode from "../components/tw-zipcode";
import Swal from "sweetalert2";

export default function Menu() {
  const router = useRouter(); // Initialize useRouter
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { user, save } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    nickname: "",
    birthday: "",
    phone: "",
    email: "",
    location: "",
    city: "",
    district: "",
    road: "",
    section: "",
    lane: "",
    number: "",
    floor: "",
    county: "",
    address: "",
  });

  // 監聽郵遞區號選擇變更
  const handlePostcodeChange = (selectedCounty, selectedDistrict) => {
    setFormData((prev) => {
      if (
        prev.county === selectedCounty &&
        prev.district === selectedDistrict
      ) {
        return prev; // 若無變化，避免更新 state
      }
      return {
        ...prev,
        county: selectedCounty,
        district: selectedDistrict,
      };
    });
    console.log(selectedCounty, selectedDistrict);
  };

  // 監聽輸入變更
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 取消按鈕
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        nickname: user.nickname || "",
        birthday: user.birthday || "",
        phone: user.phone || "",
        email: user.email || "",
        location: user.location || "",
        city: user.city || "",
        district: user.district || "",
        road: user.road || "",
        section: user.section || "",
        lane: user.lane || "",
        number: user.number || "",
        floor: user.floor || "",
        county: user.county || "",
        address: user.address || "",
      });
    }
    router.push("/user"); // 返回用戶頁面
  };

  // 表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await save(
        formData.name,
        formData.email,
        formData.gender,
        formData.birthday,
        formData.phone,
        formData.county,
        formData.district,
        formData.address
      );

      Swal.fire({
        icon: "success",
        title: "更新成功",
        text: `您的資料已更新`,
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "更新失敗",
        text: error.message || "請稍後再試",
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
    }
  };

  // 預先載入 /user 頁面
  useEffect(() => {
    router.prefetch("/user");
  }, [router]);

  // 初始化用戶資料
  useEffect(() => {
    if (user?.id) {
      setCheckingAuth(false);
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        nickname: user.nickname || "",
        birthday: user.birthday || "",
        phone: user.phone || "",
        email: user.email || "",
        location: user.location || "",
        city: user.city || "",
        district: user.district || "",
        road: user.road || "",
        section: user.section || "",
        lane: user.lane || "",
        number: user.number || "",
        floor: user.floor || "",
        county: user.county || "",
        address: user.address || "",
      });
    }
  }, [user]);

  if (checkingAuth) {
    return (
      <div className={styles.container2}>
        <div className={styles.loader27}></div>
      </div>
    );
  }

  const formattedDate = formData.birthday
    ? new Date(formData.birthday).toISOString().split("T")[0]
    : "";

  return (
    <div className="col-12 col-lg-9">
      <div className={`${styles["container"]}`}>
        <h4 className={`mb-4 ${styles["information"]}`}>會員資料</h4>
        <form onSubmit={handleSubmit} className={styles["form-container"]}>
          <div className={styles.formGroup}>
            <h6>
              姓名<span className={`${styles["important"]}`}> *</span>
            </h6>
            <Input
              name="name"
              placeholder="姓名"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <h6>
              性別
              <span className={` ${styles["important"]}`}> </span>
            </h6>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.selects}
              required
            >
              <option value="">請選擇性別</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <h6>
              生日<span className={`${styles["important"]}`}> </span>
            </h6>
            <Input
              type="date"
              name="birthday"
              value={formattedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.phone}`}>
            <h6>
              聯絡電話<span className={`${styles["important"]}`}> *</span>
            </h6>
            <Input
              name="phone"
              placeholder="聯絡電話"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <h6>
              聯絡信箱<span className={`${styles["important"]}`}></span>
            </h6>
            <p>{formData.email || "尚未設定 Email"}</p>
          </div>

          <div className={styles.formGroup}>
            <h6>
              所在地區<span className={`${styles["important"]}`}> </span>
            </h6>

            <div className={styles.addressRow}>
              <TWZipCode
                initCounty={formData.county} // 傳入 initCounty
                initDistrict={formData.district} // 傳入 initDistrict
                onPostcodeChange={handlePostcodeChange}
              />
              <Input
                name="address"
                placeholder="請輸入地址"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="button"
            className={`mt-3 ${styles.exStore}`}
            onClick={handleCancel}
          >
            取消
          </button>
          <button type="submit" className={`mt-3 ${styles.store}`}>
            儲存
          </button>
        </form>
      </div>
    </div>
  );
}
