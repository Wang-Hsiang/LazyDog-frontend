"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../courseId.module.css";

import {
  addCourseFavorite,
  removeCourseFavorite,
  getCourseFavorites,
} from "@/services/allFavoriteService";

export default function CourseIntro({ course, session, place, params }) {
  const router = useRouter();

  const c = course?.[0];
  const s = session?.[0];
  const { courseId } = params;
  const [favoriteId, setFavoriteId] = useState(null);
  const [selectDate, setSelectDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [filterSession, setFilterSession] = useState([]);
  const { onAddCourse } = useCart();
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const displayText = expanded
    ? c?.description
    : c?.description?.length > maxLength
    ? c?.description.substring(0, maxLength) + "..."
    : c?.description;
  const [isFavorite, setIsFavorite] = useState(false);
  const uniqueDates = [...new Set(session.map((ss) => ss.class_dates))]; // 過濾出唯一的 class_dates 作為日期選單
  // const defaultTeachImg = "/course/img/user.jpg"
  const storedUser = localStorage.getItem("user");
  // console.log(" localStorage user:", storedUser);

  // 處理收藏邏輯
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        console.warn(" 使用者未登入，跳過 API 請求");
        return;
      }

      const userId = storedUser.id;
      const storedToken =
        localStorage.getItem("loginWithToken") ||
        sessionStorage.getItem("loginWithToken") ||
        storedUser?.token ||
        "";

      if (storedToken && userId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/course_favorites/${userId}`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          const data = await response.json();

          if (!data.data || !Array.isArray(data.data)) {
            console.error(" API 回傳資料有誤:", data);
            return;
          }

          // 找到該課程的收藏記錄
          const favorite = data.data.find(
            (fav) => fav.course_id === parseInt(courseId)
          );

          if (favorite) {
            setIsFavorite(true);
            setFavoriteId(favorite.id); // 設置 favoriteId
          } else {
            console.log(" 未找到該課程的收藏");
            setIsFavorite(false);
            setFavoriteId(null);
          }
        } catch (error) {
          console.error("獲取收藏狀態失敗:", error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [courseId]);

  const handleFavorite = async () => {
    const storedToken =
      localStorage.getItem("loginWithToken") ||
      sessionStorage.getItem("loginWithToken") ||
      JSON.parse(localStorage.getItem("user"))?.token ||
      "";

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    if (!storedToken || storedToken === "null" || storedToken === "undefined") {
      Swal.fire({
        icon: "warning",
        title: "請先登入",
        text: "需要先登入才能收藏！",
        showConfirmButton: false,
        timer: 950,
        // timerProgressBar: true,
        customClass: {
          popup: styles.tsaiSwal,
        },
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "無法獲取用戶 ID",
        text: "請重新登入後再試！",
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }

    try {
      if (isFavorite) {
        if (!favoriteId) {
          Swal.fire({
            icon: "error",
            title: "移除收藏失敗",
            showConfirmButton: false,
            timer: 950,
            customClass: {
              popup: styles.tsaiSwal,
            },
          });
          return;
        }

        const response = await removeCourseFavorite(favoriteId, storedToken);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "取消收藏",
            showConfirmButton: false,
            timer: 950,
            customClass: {
              popup: styles.tsaiSwal,
            },
          });
          setIsFavorite(false); // 更新狀態
          setFavoriteId(null); // 清空 favoriteId
        } else {
          Swal.fire({
            icon: "error",
            title: "移除收藏失敗",
            // text: response.error || "請稍後再試",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: styles.tsaiSwal,
            },
          });
        }
      } else {
        const response = await addCourseFavorite(courseId, storedToken, userId);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: response.message,
            // text: "課程已加入您的收藏清單！",
            showConfirmButton: false,
            timer: 950,
            // timerProgressBar: true,
            customClass: {
              popup: styles.tsaiSwal,
            },
          });
          setIsFavorite(true); // 更新狀態
          setFavoriteId(response.data.id); // 設置新的 favoriteId
        } else {
          Swal.fire({
            icon: "error",
            title: "收藏失敗",
            // text: response.error || "請稍後再試",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: styles.tsaiSwal,
            },
          });
        }
      }
    } catch (error) {
      console.error("收藏操作失敗:", error);
      Swal.fire({
        icon: "error",
        title: "操作失敗",
        // text: error.message || "請稍後再試！",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
    }
  };

  // 當選擇日期時，過濾對應的時段
  const dateChange = (e) => {
    const selected = e.target.value;
    setSelectDate(selected);

    // 過濾出該日期的所有時段
    const times = session
      .filter((ss) => ss.class_dates === selected)
      .map((ss) => {
        const start = ss.start_time.split(":").slice(0, 2).join(":");
        const end = ss.end_time.split(":").slice(0, 2).join(":");
        return `${start}~${end}`;
      });

    setFilterSession(times);
  };

  const timeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // 加入購物車
  const handleAddToCart = () => {
    if (!selectDate || !selectedTime) {
      Swal.fire({
        icon: "error",
        title: "請選擇梯次和時間",
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
        // timerProgressBar: true,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
    } else {
      console.log("加入購物車的數據:", { s, c });
      onAddCourse(c, s);
      Swal.fire({
        icon: "success",
        title: "已加入購物車",
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
        // timerProgressBar: true,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });

      setSelectDate("");
      setSelectedTime("");
      setFilterSession([]);
    }
  };

  // 其他 - GooglrMap連結
  const handlePlaceClick = (p, index) => {
    if (index < 3) {
      // 第一～第三筆資料連結到 Google Maps
      const googleMapsUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(
        p.address
      )}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  return (
    <>
      <div className={`${styles.right} ${styles.courseIntro}`}>
        <img
          className={styles.mainPic}
          src={`/course/img/${c?.img_url}`}
          alt=""
        />

        <div className={styles.courseName}>
          <h2 className={styles.name}>{c?.name}</h2>
          <div
            onClick={handleFavorite}
            className={` ${styles.heart}`}
            style={{ cursor: "pointer" }}
          >
            {isFavorite ? (
              <FaHeart className="fs-4" />
            ) : (
              <FaRegHeart className="fs-4" />
            )}
          </div>
          {/* <i
            className={`bi me-5 ${
              isFavorite ? "bi-heart-fill fs-4" : "bi-heart fs-4"
            } ${styles.heart}`}
            onClick={handleFavorite}
          ></i> */}
          {/* <img
            className={styles.heartIcon}
            src="/course/img/heartIcon.svg"
            alt=""
          /> */}
        </div>
        <p
          className={styles.description}
          onClick={() => setExpanded(!expanded)}
        >
          {displayText}{" "}
          {c?.description?.length > maxLength && (
            <span className={styles.toggleBtn}>
              {expanded ? "   顯示更少 " : "more"}
            </span>
          )}
        </p>

        <div className={styles.teacher}>
          <h2 className={styles.teachTitle}>關於講師</h2>
          <a
            href={
              s?.teacher_id
                ? `/teacher/info/${s?.teacher_id}`
                : `/course/img/user.jpg`
            }
            className={`d-flex gap-2 ${styles.tConnect}`}
          >
            <img
              className={styles.teachPic}
              src={`/teacher-img/${s?.teacher_img}`}
              alt={s?.teacher_name}
            />
            <h5 className={styles.teachName}>{s?.teacher_name}</h5>
          </a>
        </div>
        <div className={styles.info}>
          <h2 className={styles.infoTitle}>課程資訊</h2>
        </div>
        <div className={styles.startDate}>
          <img src="/course/img/flagIcon.svg" alt="" />
          {/* <span className={styles.icons}>
            <i class="bi bi-flag"></i>
          </span> */}
          <h5 className={styles.dateTitle}>近期開課</h5>
          <p className={styles.date}>
            {s?.start_date
              ? new Date(s.start_date).toISOString().split("T")[0]
              : ""}
          </p>
        </div>
        <div className={styles.duration}>
          <img src="/course/img/timeIcon.svg" alt="" />
          <h5 className={styles.durTitle}>課堂時數</h5>
          <p className={styles.hours}>{c?.duration}小時</p>
        </div>
        <div className={styles.area}>
          <img src="/course/img/flagIcon.svg" alt="" />
          <h5 className={styles.areaTitle}>上課地點</h5>
          {[...new Set(session.map((ss) => ss.region))].map(
            (region, index, array) => (
              <React.Fragment key={index}>
                <p className={styles.place}>{region}</p>
                {index < array.length - 1 && "/"}
              </React.Fragment>
            )
          )}
        </div>
        <h2 className={styles.price}>
          ${" "}
          <span className={styles.number}>
            {c?.price && Number(c?.price).toLocaleString("zh-Tw")}
          </span>
        </h2>

        {/* 日期 */}
        <select
          id="classdate"
          value={selectDate}
          className={`form-select ${styles.selects}`}
          aria-label="Default select example"
          onChange={dateChange}
        >
          <option className={styles.options} value="" disabled>
            選擇梯次
          </option>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>

        {/* 時間 */}
        <select
          id="classtime"
          value={selectedTime}
          className={`form-select ${styles.selects}`}
          aria-label="Default select example"
          onChange={timeChange}
        >
          <option value="" disabled>
            選擇時間
          </option>
          {filterSession.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button className={styles.cartBtn} onClick={handleAddToCart}>
          加入購物車
        </button>
        <div className={styles.ps}>
          {/* 注意事項 */}
          <div
            type="button"
            className={`${styles.notice}`}
            data-bs-toggle="offcanvas"
            data-bs-target="#noticeOffcanvas"
            aria-controls="noticeOffcanvas"
          >
            <h5 className={styles.noticeTitle}>注意事項</h5>
            <img src="/course/img/rightBlack.svg" alt="" />
            <div
              className={`offcanvas offcanvas-end mt-3`} // offcanvas-end 表示從右邊滑出
              tabIndex="-1"
              id="noticeOffcanvas"
              aria-labelledby="noticeOffcanvasLabel"
              data-bs-backdrop="true"
            >
              {/* <div className="offcanvas-header">
                <h5 id="noticeOffcanvasLabel">注意事項</h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div> */}
              <div
                className={`offcanvas-body ${styles.scrollOrgTsai} ${styles.offcanvaBody}`}
              >
                <h5 className="mt-5 py-4">注意事項</h5>
                {c?.notice}
              </div>
            </div>
          </div>

          {/* QA */}
          <div
            type="button"
            className={styles.qa}
            data-bs-toggle="offcanvas"
            data-bs-target="#qaOffcanvas"
            aria-controls="qaOffcanvas"
          >
            <h5 className={styles.qaTitle}>Q&amp;A</h5>
            <img src="/course/img/rightBlack.svg" alt="" />
            <div
              className={`offcanvas offcanvas-end`}
              tabIndex="-1"
              id="qaOffcanvas"
              aria-labelledby="qaOffcanvasLabel"
              data-bs-backdrop="true"
            >
              {/* <div className="offcanvas-header">
                <h5 id="qaOffcanvasLabel">Q&amp;A</h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div> */}
              <div
                className={`offcanvas-body ${styles.scrollOrgTsai} ${styles.offcanvaBody}`}
              >
                <h5 className="mt-5 py-4">Q&nbsp;&&nbsp;A</h5>
                {c?.qa}
              </div>
            </div>
          </div>

          {/* 其他 */}
          <div
            type="button"
            className={styles.other}
            data-bs-toggle="offcanvas"
            data-bs-target="#otherOffcanvas"
            aria-controls="otherOffcanvas"
          >
            <h5 className={styles.otherTitle}>其他</h5>
            <img src="/course/img/rightBlack.svg" alt="" />
            <div
              className={`offcanvas offcanvas-end ${styles.offcanvas}`}
              tabIndex="-1"
              id="otherOffcanvas"
              aria-labelledby="otherOffcanvasLabel"
              data-bs-backdrop="true"
            >
              {/* <div className="offcanvas-header">
                <h5 id="otherOffcanvasLabel">其他</h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div> */}
              <div
                className={`offcanvas-body ${styles.scrollOrgTsai} ${styles.offcanvaBody}`}
              >
                <div className="container-fluid">
                  <h5 className="mt-5 py-4">上課地點</h5>
                  {place?.slice(0, 3).map((p, index) => (
                    <div key={p.id} className="row my-4 border-bottom">
                      <div className="col-12 col-md-3">{p.region}</div>
                      <div
                        className="col-12 col-md-9 pb-5"
                        onClick={() => handlePlaceClick(p, index)}
                      >
                        <span className={`${styles.address}`}>{p.address}</span>
                      </div>
                    </div>
                  ))}
                  {place?.slice(3, 5).map((p, index) => (
                    <div key={p.id} className="row my-4 border-bottom">
                      <div className="col-12 col-md-3">{p.region}</div>
                      <div
                        className="col-12 col-md-9 pb-4 "
                        // onClick={() => handlePlaceClick(p, index + 3)}
                      >
                        {p.address}
                        <p className={`pt-2 ${styles.zoom}`}>
                          <a
                            href="https://reurl.cc/XRdR6j"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <strong className={styles.zoomWord}>
                              ZOOM下載使用教學參考
                            </strong>
                          </a>
                        </p>
                        <p>
                          <a
                            href="https://reurl.cc/nv9vz8"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <strong className={styles.zoomWord}>
                              直播觀看教學方式說明
                            </strong>
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
