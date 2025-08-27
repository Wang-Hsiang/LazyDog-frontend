"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Header from "../../components/layout/header";
import MyMenu from "../_components/my";
import Bread from "../../components/teacher/breadcrumb";
import Input from "../../components/forms/Input";
import styles from "../css/teacherSignUser.module.css";
import style from "../../../styles/modules/menu.module.css";
import TWZipCode from "../../components/tw-zipcode";
import { useLocationSelector } from "@/hooks/useLocationSelector";
import Swal from "sweetalert2";
// import { auth, signOut, onAuth } from "./firebase";

export default function Menu() {
  // const { city, district, closeModal, openModal } = useLocationSelector();
  const router = useRouter();
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCancel = (e) => {
    setFormData({
      name: user?.name || "",
      gender: user?.gender || "",
      nickname: user?.nickname || "",
      birthday: user?.birthday || "",
      phone: user?.phone || "",
      email: user?.email || "",
      location: user?.location || "",
      city: user?.city || "",
      district: user?.district || "",
      road: user?.road || "",
      section: user?.section || "",
      lane: user?.lane || "",
      number: user?.number || "",
      floor: user?.floor || "",
    });
    router.push("/user");
  };
  // 監聽郵遞區號選擇變更
  const handlePostcodeChange = (selectedCounty, selectedDistrict, postcode) => {
    setFormData((prev) => ({
      ...prev,
      county: selectedCounty,
      district: selectedDistrict,
    }));
    console.log(selectedCounty, selectedDistrict);
  };

  const handleSubmit = async (e) => {
    console.log(user.id);

    e.preventDefault();

    if (!formData.name || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "請填寫欄位",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }

    try {
      await save(
        formData.name,
        formData.email,
        formData.gender,
        formData.birthday,
        formData.phone
      );
    } catch (error) {
      alert("更新失敗");
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
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
    <>
      <Header />
      <div className={`lumi-all-wrapper ${style.allwrapper}`}>
        {/* <Bread
          links={[
            { label: "首頁 ", href: "/" },

            {
              label: "個人資料",
              href: "/user",
              active: true,
            },
          ]}
        /> */}
      </div>
      <div className="row">
        <div className={`${style.wrapper}`}>
          <MyMenu />

          <div className={`col-12 col-md-9 `}>
            <div className={`${styles.container}`}>
              <h4 className={`mb-4 ${styles["information"]}`}>基本資料</h4>
              <form
                onSubmit={handleSubmit}
                className={styles["form-container"]}
              >
                <div className={styles.formGroup}>
                  <h6>
                    姓名<span className={`${styles["important"]}`}> *</span>
                  </h6>
                  <Input
                    name="name"
                    placeholder="姓名"
                    value={formData.name}
                    onChange={handleChange}
                    // required
                  />

                  <h6>
                    性別
                    {/* <span className={`${styles["important"]}`}> *</span> */}
                  </h6>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles.selects}
                    // required
                  >
                    <option value="">請選擇性別</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <h6>
                    生日
                    {/* <span className={`${styles["important"]}`}> *</span> */}
                  </h6>
                  <Input
                    type="date"
                    name="birthday"
                    value={formattedDate}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.phone}`}>
                  <h6>
                    聯絡電話
                    <span className={`${styles["important"]}`}> *</span>
                  </h6>
                  <Input
                    name="phone"
                    placeholder="聯絡電話"
                    value={formData.phone}
                    onChange={handleChange}
                    // required
                  />

                  <h6>
                    聯絡信箱<span className={`${styles["important"]}`}></span>
                  </h6>
                  <p>{formData.email || "尚未設定 Email"}</p>
                </div>

                <div className={styles.formGroup}>
                  <h6>
                    所在地區
                    {/* <span className={`${styles["important"]}`}> *</span> */}
                  </h6>

                  <div className={styles.addressRow}>
                    <TWZipCode
                      initCounty={user.county} // 傳入 initCounty
                      initDistrict={formData.district} // 傳入 initDistrict
                      onPostcodeChange={handlePostcodeChange}
                    />
                    <Input
                      name="road"
                      placeholder="請輸入地址"
                      value={formData.road}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.addressRow}>
                    {/* <Input
                      name="section"
                      placeholder="段"
                      value={formData.section}
                      onChange={handleChange}
                    /> */}
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.exStore}
                  onClick={handleCancel}
                >
                  取消
                </button>
                <button type="submit" className={styles.store}>
                  儲存
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
