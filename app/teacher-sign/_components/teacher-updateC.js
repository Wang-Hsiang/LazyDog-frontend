"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "../css/teacherSignUpdate.module.css";

export default function TeacherUpdateC() {
  const router = useRouter();
  const params = useParams();
  const sessionCode = params.sessionId;

  // cs 有course和session的資料
  const [cs, setCS] = useState({});
  const [mainpic, setMainpic] = useState([]);
  const [otherpics, setOtherpics] = useState([]);
  const [deletedPics, setDeletedPics] = useState([]); // 要刪除的圖片 ID
  const formattedDate = cs?.start_date
    ? moment(cs.start_date).format("YYYY-MM-DD")
    : "";

  const [types, setTypes] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/mycourse/${sessionCode}`, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setCS(data.data.courses[0]);
        setMainpic(data.data.mainpic[0]);
        setOtherpics(data.data.otherpics);
        setTypes(data.data.types);
        setPlaces(data.data.places);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [sessionCode]);

  // 欄位變更
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCS((prev) => ({
      ...prev,
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

    const deletedPic = otherpics.find((other) => other.id === id);
    setDeletedPics((prev) => [
      ...prev,
      {
        id: deletedPic.id,
        url: deletedPic.url, // 假設圖片有 url 屬性
      },
    ]); // 記錄被刪除的圖片 ID
  };

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

  // 更新至後台
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !cs.max_people ||
      !cs.class_dates ||
      !formattedDate ||
      !cs.start_time ||
      !cs.end_time ||
      !cs.area_id
    ) {
      Swal.fire({
        title: "欄位未填寫完整",
        text: "請檢查所有必填欄位！",
        icon: "warning",
        // confirmButtonText: "確定",
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
        title: "請選擇主圖片",
        icon: "warning",
        // confirmButtonText: "確定",
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
        title: "請上傳至少一張其他圖片",
        icon: "warning",
        // confirmButtonText: "確定",
        ...animationConfig,
        showConfirmButton: false,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }

    const courseData = {
      name: cs.name,
      type_id: cs.type_id,
      price: cs.price,
      duration: cs.duration,
      description: cs.description,
      notice: cs.notice,
      qa: cs.qa,
      CourseId: cs.course_id,
    };

    const sessionData = {
      max_people: cs.max_people,
      class_dates: cs.class_dates,
      start_date: formattedDate,
      area_id: cs.area_id,
      start_time: cs.start_time,
      end_time: cs.end_time,
      courseId: cs.course_id,
      sessionId: cs.id,
    };

    const sessionId = cs.id;
    const sessionCode = cs.id;
    const courseId = cs.course_id;

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("sessionData", JSON.stringify(sessionData));
    formData.append("courseId", courseId);
    formData.append("sessionId", sessionId);

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

    // **新增 `deletedPics` 到 `formData`**
    if (deletedPics.length > 0) {
      formData.append("deletedPics", JSON.stringify(deletedPics));
      console.log(deletedPics);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // 輸出 key 和 value
    }

    fetch(`http://localhost:5000/teacher/mycourse/${sessionCode}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("前台送出資料:", data);
        Swal.fire({
          title: "梯次更新成功！",
          icon: "success",
          timer: 2400,
          showConfirmButton: false,
          customClass: {
            popup: styles.tsaiSwal,
          },
          willClose: () => {
            // 在 Swal 關閉後跳轉頁面
            router.push(`/teacher-sign/list`);
          },
          ...animationConfig,
        });
        setDeletedPics([]);
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        Swal.fire({
          title: "更新失敗",
          text: "資料更新發生錯誤，請稍後再試。",
          icon: "error",
          showConfirmButton: false,
          ...animationConfig,
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

  // 軟刪除梯次
  const handleisDelete = async () => {
    const sessionId = cs.id;
    fetch(`http://localhost:5000/teacher/mycourse/session/${sessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("軟刪除成功:", data);
        Swal.fire({
          title: "刪除成功！",
          icon: "success",
          // confirmButtonText: "確定",
          timer: 2000,
          showConfirmButton: false,
          ...animationConfig,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      })
      .then(() => {
        router.push("/teacher-sign/list");
      })
      .catch((err) => {
        console.error("軟刪除失敗 Error data:", err);
        Swal.fire({
          title: "刪除失敗",
          icon: "error",
          showConfirmButton: false,
          ...animationConfig,
          customClass: {
            popup: styles.tsaiSwal,
          },
        });
      });
  };

  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>
        <div className={`p-5 ${styles.right}`}>
          <h4 className={`mb-4 ${styles.tTitle}`}>編輯該梯次</h4>
          <form onSubmit={handleSubmit}>
            <section className={`row g-4 mb-5 ${styles.section1}`}>
              <div className={`col-md-6`}>
                <label className={`form-label ${styles.labels}`}>
                  課程名稱
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.uncontrols}`}
                  defaultValue={cs?.name}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-6`}>
                <label className={`form-label ${styles.labels}`}>
                  課程類別
                </label>
                <select
                  className={`form-select ${styles.uncontrols}`}
                  defaultValue={cs?.type_id}
                  disabled
                  readOnly
                >
                  {types.map((t) => (
                    <option key={t.type_id} defaultValue={t.type_id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程金額
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.uncontrols}`}
                  defaultValue={cs?.price}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>總時數</label>
                <input
                  type="text"
                  className={`form-control ${styles.uncontrols}`}
                  defaultValue={cs?.duration}
                  disabled
                  readOnly
                />
              </div>
            </section>
            <section className={`row g-4 mb-4  ${styles.section3}`}>
              <div className={`col-md-12 mt-0`}>
                <label className={`form-label ${styles.labels}`}>
                  課程介紹
                </label>
                <textarea
                  className={`form-control  ${styles.scrollOrg}  ${styles.textarea}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={6}
                  defaultValue={cs?.description}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  注意事項
                </label>
                <textarea
                  className={`form-control ${styles.scrollOrg} ${styles.textarea}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={6}
                  defaultValue={cs?.notice}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>Q&amp;A</label>
                <textarea
                  className={`form-control ${styles.scrollOrg} ${styles.textarea}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={6}
                  defaultValue={cs?.qa}
                  disabled
                  readOnly
                />
              </div>
            </section>
            <section className={`row g-4 mb-0 ${styles.section2}`}>
              <div className={`col-md-12`}>
                <label className={`form-label ${styles.labels}`}>
                  該梯每堂課日期<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.controls}`}
                  placeholder={`範例:   2025 【台北】 08/17、08/24、08/31、09/07、09/14 、09/21、09/28`}
                  defaultValue={cs?.class_dates}
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
                  defaultValue={formattedDate}
                  name="start_date"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  開課地點<span className={styles.must}>*</span>
                </label>
                <select
                  className={`form-select ${styles.controls}`}
                  value={cs?.area_id}
                  name="area_id"
                  onChange={handleChange}
                >
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
                <div className={`row px-1`}>
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control  ${styles.controls}`}
                      defaultValue={cs?.start_time}
                      name="start_time"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-auto d-flex align-items-center justify-content-center">
                    <span className={`fs-4`}>~</span>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control  ${styles.controls}`}
                      defaultValue={cs?.end_time}
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
                  className={`form-control  ${styles.controls}`}
                  defaultValue={cs?.max_people}
                  name="max_people"
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className={`row mt-4 mb-5 px-3 ${styles.section4}`}>
              <div className={`col-md-12 col-12 mt-0`}>
                <label className={`form-label`}>
                  課程圖片<span className={styles.must}>*</span>
                </label>
              </div>

              <div className={`col-md-5 col-12 mt-0 mb-5 ${styles.mainPic}`}>
                <div className={styles.imageCard}>
                  {mainpic ? (
                    <img
                      className={styles.imgCr}
                      src={
                        mainpic instanceof File
                          ? URL.createObjectURL(mainpic)
                          : `/course/img/${mainpic.url}`
                      }
                      alt="主圖片"
                    />
                  ) : null}

                  {mainpic && (
                    <button
                      type="button"
                      className={`${styles.deleteBtn1} `}
                      onClick={() => setMainpic(null)}
                    >
                      ×
                    </button>
                  )}
                </div>

                {!mainpic && (
                  <>
                    <button
                      type="button"
                      className={`btn btn-primary btn-sm ${styles.addPicBtn}`}
                      onClick={() =>
                        document.getElementById("mainpicUpload").click()
                      }
                    >
                      <i class="bi bi-plus fs-5"></i> 封面圖
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
              <div className={`col-md-7 col-12 mt-0 mb-5 p-0`}>
                <div className={styles.otherPic}>
                  {otherpics?.map((other) => (
                    <div key={other.id} className={styles.imageCardOther}>
                      <img
                        className={`${styles.imgCr} ${styles.pics}`}
                        src={
                          other.isLocal ? other.url : `/course/img/${other.url}`
                        }
                        alt={`其他圖片`}
                      />
                      <button
                        type="button"
                        className={`${styles.deleteBtn} `}
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
                        <i class="bi bi-plus fs-5"></i> 其他圖片
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
                className={`btn btn-sm px-5 py-2 mt-1 mb-1 ${styles.deletedBtn}`}
                onClick={handleisDelete}
              >
                刪除
              </button>
              <button
                type="button"
                className={`btn btn-sm px-5 py-2 mt-1  mb-1 ${styles.cancleBtn}`}
                onClick={() => changepage("list")}
              >
                取消
              </button>
              <button
                type="submit"
                className={`btn btn-sm px-5 py-2 mt-1  mb-1 ${styles.submitBtn}`}
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
