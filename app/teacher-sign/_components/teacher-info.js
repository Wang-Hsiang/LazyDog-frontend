"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/teacherSignInfo.module.css";
import Swal from "sweetalert2";

export default function TeacherInfo() {
  // const router = useRouter();
  const [infos, setInfos] = useState([]);
  const [types, setTypes] = useState([]);
  const [teacherPic, setTeacherPic] = useState(null);

  // 撈後台資料
  useEffect(() => {
    fetch(`http://localhost:5000/teacher/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data?.data?.infos[0].img);
        setTeacherPic(data?.data?.infos[0].img);
        setInfos(data?.data?.infos[0]);
        setTypes(data.data.types);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        Swal.fire({
          title: "更新失敗",
          text: "老師資料更新發生錯誤，請稍後再試。",
          icon: "error",
          confirmButtonText: "確定",
          ...animationConfig,
        });
      });
  }, []);

  // 圖片
  // const fileInputRef = useRef(null); // 🔹 建立 useRef 來取得 input 元素
  // const [previewImage, setPreviewImage] = useState(""); // 🔹 存儲預覽圖片 URL
  // const handleUploadClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click(); // ✅ 透過 ref 觸發點擊
  //   }
  // };

  // 處理圖片變更
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]; // 取得選擇的檔案
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result); // 設定預覽圖片
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // 跳出框效果
  const animationConfig = {
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
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      if (name === "teacherPic") {
        setTeacherPic(files[0]); // 更新主圖片
      }
    }
    e.target.value = "";
  };

  // 表單變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos((prevInfos) => ({
      ...prevInfos,
      [name]: value,
    }));
  };

  // 儲存表單
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teacherPic) {
      Swal.fire({
        title: "請選擇老師圖片",
        icon: "warning",
        timer: 2500,
        ...animationConfig,
        showConfirmButton: false,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }

    const updateData = new FormData();
    updateData.append("name", infos.name);
    updateData.append("category_id", infos.category_id);
    updateData.append("Introduce", infos.Introduce);
    updateData.append("Experience", infos.Experience);
    // updateData.append("img", fileInputRef.current.files[0] || infos.img);
    updateData.append("teacherId", infos.teacherId);

    if (teacherPic) {
      updateData.append("teacherPic", teacherPic);
    }

    for (let pair of updateData.entries()) {
      console.log(pair[0], pair[1]);
    }

    fetch(`http://localhost:5000/teacher/info`, {
      method: "PUT", // 或者使用 PUT
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
      body: updateData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("更新成功:", data);
        Swal.fire({
          title: "師資更新成功！",
          icon: "success",
          // confirmButtonText: "確定",
          timer: 2000,
          ...animationConfig,
          showConfirmButton: false,
          customClass: {
            popup: styles.tsaiSwal,
          },
          // willClose: () => {
          //   router.push(`/teacher-sign/list`);
          // },
        });
        // alert("資料更新成功！");
      })
      .catch((err) => console.error("Error updating data:", err));
  };

  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.right} p-5`}>
            <h4 className={`mb-4 ${styles.tTitle}`}>師資內容</h4>
            <div className={`mb-2`}>
              <div className={`row`}>
                <div className={`col-md-6`}>
                  <label className={`form-label ${styles.labels}`}>
                    姓名<span className={styles.must}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${styles.controls}`}
                    name="name"
                    defaultValue={infos?.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={`col-md-6`}>
                  <label className={`form-label ${styles.labels}`}>
                    教學類別<span className={styles.must}>*</span>
                  </label>
                  <select
                    className={`form-select ${styles.controls}`}
                    defaultValue={infos?.category_id}
                    name="category_id"
                    onChange={handleChange}
                  >
                    {types.map((t) => (
                      <option key={t.type_id} defaultValue={t.type_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`col-md-12 mt-3`}>
                  <label className={`form-label ${styles.labels}`}>
                    個人介紹<span className={styles.must}>*</span>
                  </label>
                  <textarea
                    className={`form-control ${styles.controls} ${styles.scrollOrg}`}
                    style={{ resize: "none" }}
                    id="exampleFormControlTextarea1"
                    rows={6}
                    name="Introduce"
                    defaultValue={infos?.Introduce}
                    onChange={handleChange}
                  />
                </div>
                <div className={`col-md-12 mt-3`}>
                  <label className={`form-label ${styles.labels}`}>
                    經歷<span className={styles.must}>*</span>
                  </label>
                  <textarea
                    className={`form-control ${styles.controls} ${styles.scrollOrg}`}
                    style={{ resize: "none" }}
                    id="exampleFormControlTextarea1"
                    rows={8}
                    name="Experience"
                    defaultValue={infos?.Experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className={`col-6 col-md-6 mt-3 pb-5 `}>
              <label className={`form-label ${styles.labels}`}>
                師資照片
                <span className={styles.must}>* </span>
              </label>

              <div className={`col-12 col-md-5 mt-1 mb-4 ${styles.teacherPic}`}>
                <div className={styles.imageCard}>
                  {teacherPic ? (
                    <img
                      className={styles.imgCr}
                      src={
                        teacherPic instanceof File
                          ? URL.createObjectURL(teacherPic)
                          : `/teacher-img/${infos?.img}`
                      }
                      alt="主圖片"
                    />
                  ) : null}

                  {teacherPic && (
                    <button
                      type="button"
                      className={`${styles.deleteBtn1} `}
                      onClick={() => setTeacherPic(null)}
                    >
                      ×
                    </button>
                  )}
                </div>

                {!teacherPic && (
                  <>
                    <button
                      type="button"
                      className={`btn btn-primary btn-sm ${styles.addPicBtn}`}
                      onClick={() =>
                        document.getElementById("teacherPicUpload").click()
                      }
                    >
                      + 老師圖片
                    </button>
                    <input
                      type="file"
                      id="teacherPicUpload"
                      className="d-none"
                      accept="image/*"
                      name="teacherPic"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="border-top my-1"></div>
            {/* 按鈕區 */}
            <div className={`d-grid gap-2 col-3 mx-auto mt-3 `}>
              <button
                type="submit"
                className={`btn btn-primary btn-sm px-4 mt-4 ${styles.submitBtn}`}
              >
                儲存
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
