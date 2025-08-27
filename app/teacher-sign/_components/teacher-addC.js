"use client";

import React, { useState, useEffect } from "react";
import styles from "../css/teacherSignAdd.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Swal from "sweetalert2";

export default function TeacherAddC() {
  const router = useRouter();
  const { user } = useAuth();
  const teacherId = user?.teacher_id;
  const [types, setTypes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [mainpic, setMainpic] = useState(null);
  const [otherpics, setOtherpics] = useState([]);
  const [cs, setCs] = useState({
    type_id: "",
    name: "",
    description: "",
    duration: "",
    price: "",
    notice: "",
    qa: "",
  });
  const [ss, setSs] = useState({
    area_id: "",
    max_people: "",
    class_dates: "",
    start_date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/createGet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTypes(data.data.types);
        setPlaces(data.data.places);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // 表單
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCs((prevCs) => ({
      ...prevCs,
      [name]: value,
    }));

    setSs((prevSs) => ({
      ...prevSs,
      [name]: value,
    }));
  };

  // 圖片上傳
  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      if (name === "mainpic") {
        setMainpic(files[0]); // 更新主圖片
      } else if (name === "otherpics") {
        const newImages = Array.from(files).map((file) => ({
          id: Date.now() + Math.random(),
          file,
          url: URL.createObjectURL(file),
          isLocal: true,
        }));
        setOtherpics((prev) => [...prev, ...newImages]); // 加入新的圖片
      }
    }
    e.target.value = "";
  };

  // otherpics 刪除
  const handleDelete = (id) => {
    setOtherpics(otherpics.filter((other) => other.id !== id));
  };

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

  // 表單送出
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !cs.name ||
      !cs.type_id ||
      !cs.price ||
      !cs.duration ||
      !cs.description ||
      !ss.max_people ||
      !ss.class_dates ||
      !ss.start_date ||
      !ss.start_time ||
      !ss.end_time ||
      !ss.area_id
    ) {
      Swal.fire({
        title: "欄位未填寫完整",
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
    if (!mainpic) {
      Swal.fire({
        title: "請選擇封面圖片",
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
    if (otherpics.length === 0) {
      Swal.fire({
        title: "請上傳其他圖片",
        icon: "warning",
        timer: 3000,
        ...animationConfig,
        showConfirmButton: false,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }

    const courseData = {
      type_id: cs.type_id,
      name: cs.name,
      duration: cs.duration,
      description: cs.description,
      price: cs.price,
      notice: cs.notice,
      qa: cs.qa,
    };
    const sessionData = {
      area_id: ss.area_id,
      teacher_id: teacherId,
      max_people: ss.max_people,
      class_dates: ss.class_dates,
      start_date: ss.start_date,
      start_time: ss.start_time,
      end_time: ss.end_time,
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("sessionData", JSON.stringify(sessionData));
    if (mainpic) {
      formData.append("mainImage", mainpic);
    }
    if (otherpics.length > 0) {
      otherpics.forEach((pic, i) => {
        formData.append("otherImages", pic.file);
        console.log(pic);
      });
      console.log(otherpics);
    }

    fetch(`http://localhost:5000/teacher/mycourse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("新增成功:", data);
        Swal.fire({
          title: "新增成功！",
          icon: "success",
          timer: 2500,
          ...animationConfig,
          showConfirmButton: false,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        Swal.fire({
          title: "新增失敗",
          text: "新增時發生錯誤，請稍後再試。",
          icon: "error",
          timer: 2500,
          ...animationConfig,
          showConfirmButton: false,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      });
  };

  // 跳頁
  const changepage = (path) => {
    if (path) {
      router.push(`/teacher-sign/${path}`);
    }
  };

  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>
        <div className={`p-5 ${styles.right}`}>
          <h4 className={`mb-4 ${styles.tTitle}`}>新增課程</h4>
          <form onSubmit={handleSubmit}>
            <section className={`row g-4 mb-3  px-2 ${styles.section1}`}>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程名稱<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={cs.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3 `}>
                <label className={`form-label ${styles.labels}`}>
                  課程類別<span className={styles.must}>*</span>
                </label>
                <select
                  className={`form-select ${styles.selects}`}
                  value={cs.type_id}
                  name="type_id"
                  onChange={handleChange}
                >
                  <option className={styles.pleaseChoose} value="" disabled>
                    請選擇
                  </option>
                  {types.map((t) => (
                    <option key={t.type_id} value={t.type_id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`col-md-6  mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程金額<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={cs.price}
                  name="price"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6  mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  總時數<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={cs.duration}
                  name="duration"
                  onChange={handleChange}
                />
              </div>
            </section>
            <section className={`row g-4 mb-3  px-2 ${styles.section3}`}>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程介紹<span className={styles.must}>*</span>
                </label>
                <textarea
                  className={`form-control  ${styles.controls} ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={4}
                  value={cs.description}
                  name="description"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  注意事項
                </label>
                <textarea
                  className={`form-control  ${styles.controls} ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={4}
                  value={cs.notice}
                  name="notice"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>Q&amp;A</label>
                <textarea
                  className={`form-control  ${styles.controls} ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={4}
                  value={cs.qa}
                  name="qa"
                  onChange={handleChange}
                />
              </div>
            </section>
            <section className={`row g-4 mb-3  px-2 ${styles.section2}`}>
              <div className={`col-md-12`}>
                <label className={`form-label ${styles.labels}`}>
                  該梯每堂課日期<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  placeholder={`範例 :    2025 【台北】 08/17、08/24、08/31、09/07、09/14 、09/21、09/28`}
                  value={ss.class_dates}
                  name="class_dates"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  開課日期<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={ss.start_date}
                  name="start_date"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  開課地點<span className={styles.must}>*</span>
                </label>
                <select
                  className={`form-select  ${styles.selects}`}
                  value={ss.area_id}
                  name="area_id"
                  onChange={handleChange}
                >
                  <option className={styles.optionDisabled} value="" disabled>
                    請選擇
                  </option>
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.region}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  上課時間<span className={styles.must}>*</span>
                </label>
                <div className={`row px-2`}>
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control  ${styles.controls}`}
                      value={ss.start_time}
                      name="start_time"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-auto  d-flex align-items-center justify-content-center">
                    <span className={`fs-4`}>~</span>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control ${styles.controls}`}
                      value={ss.end_time}
                      name="end_time"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  報名人數限制<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.controls}`}
                  value={ss.max_people}
                  name="max_people"
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className={`row g-4 px-3 ${styles.section4}`}>
              <label className={`form-label`}>
                課程圖片
                <span className={styles.must}>* </span>
              </label>
              <div className={`col-md-5 col-12 mt-0 mb-5 px-2 `}>
                <div className={styles.mainPic}>
                  {/* <div className={styles.imageCard}> */}
                  {mainpic ? (
                    <>
                      <img
                        className={styles.imgCr}
                        src={
                          mainpic instanceof File
                            ? URL.createObjectURL(mainpic)
                            : `/course/img/${mainpic.url}`
                        }
                        alt="主圖片"
                      />
                      <button
                        type="button"
                        className={`${styles.deleteBtn} ${styles.deletPic}`}
                        onClick={() => setMainpic(null)}
                      >
                        ×
                      </button>
                    </>
                  ) : null}
                  {/* </div> */}

                  {!mainpic && (
                    <>
                      <button
                        type="button"
                        className={`btn btn-primary btn-sm ${styles.addPicBtn}`}
                        onClick={() =>
                          document.getElementById("mainpicUpload").click()
                        }
                      >
                        + 封面圖
                      </button>
                      <input
                        type="file"
                        id="mainpicUpload"
                        className="d-none"
                        accept="image/*"
                        name="mainpic"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className={`col-md-7 col-12 mt-0 mb-5 `}>
                <div className={styles.otherPic}>
                  {otherpics?.map((other) => (
                    <div key={other.id} className={styles.imageCard}>
                      <img
                        className={`${styles.imgCr} ${styles.pics}`}
                        src={
                          other.isLocal ? other.url : `/course/img/${other.url}`
                        }
                        alt={`其他圖片`}
                      />
                      <button
                        type="button"
                        className={`${styles.deleteBtn} ${styles.deletPic}`}
                        onClick={() => handleDelete(other.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {otherpics.length < 5 && (
                    <>
                      <button
                        type="button"
                        className={`btn btn-primary btn-sm ${styles.addPicBtn}`}
                        onClick={() =>
                          document.getElementById("otherpicsUpload").click()
                        }
                      >
                        + 其他圖片
                      </button>
                      <input
                        id="otherpicsUpload"
                        type="file"
                        className="form-control d-none"
                        accept="image/*"
                        name="otherpics"
                        multiple
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>
              </div>
            </section>
            {/* 按鈕區 */}
            <div
              className={`d-flex justify-content-center gap-3 border-top mt-5 pt-4`}
            >
              <button
                type="button"
                className={`btn btn-sm px-5 py-2 m-4 mb-1 ${styles.cancleBtn}`}
                onClick={() => changepage("list")}
              >
                返回
              </button>
              <button
                type="submit"
                className={`btn btn-primary btn-sm px-5 py-2 m-4 mb-1 ${styles.submitBtn}`}
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
