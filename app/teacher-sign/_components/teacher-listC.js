"use client";

import React, { useState, useEffect } from "react";
import styles from "../css/teacherSignList.module.css";
import Link from "next/link";
import Page from "@/app/components/hotel/page";

export default function TeacherListC() {
  const [mycourse, setMycourse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); // 每頁顯示的課程數量

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/mycourse`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setMycourse(data.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);
  // console.log(data?);
  // console.log(mycourse);

  // 計算總頁數
  const totalPages = Math.ceil(mycourse.length / coursesPerPage);

  // 根據目前頁面來選擇顯示的課程
  const lastIdx = currentPage * coursesPerPage;
  const firstIdx = lastIdx - coursesPerPage;
  const currentCourses = mycourse.slice(firstIdx, lastIdx);

  // 處理頁碼變更
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>
        <div className={`pb-3 ${styles.right}`}>
          <div className={`${styles.top}`}>
            <h4 className={`mb-4 ${styles.tTitle}`}>我的課程</h4>
            <button
              type="button"
              className={`btn btn-primary btn-sm ${styles.addCourseBtn}`}
            >
              <a className={styles.addCourse} href={`/teacher-sign/add`}>
                + 新增課程
              </a>
            </button>
          </div>
          <div className={`${styles.bottom}`}>
            <div className={styles.cThead}>
              <div className={styles.cTh1} />
              <div className={styles.cTh2}>課程名稱</div>
              <div className={styles.cTh3}>上課日期</div>
              <div className={styles.cTh4}>地點</div>
              <div className={styles.cTh5}>更新日期</div>
            </div>
            <div className={`${styles.cTbodys}`}>
              {currentCourses.map((m) => {
                // 轉換 update_at 日期
                const date = new Date(m.update_at);
                const formatter = new Intl.DateTimeFormat("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
                const formattedDate = formatter.format(date);

                // 轉換 start_date 只顯示日期
                const startDate = new Date(m.start_date);
                const startFormatter = new Intl.DateTimeFormat("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });
                const formattedStartDate = startFormatter.format(startDate);

                return (
                  <Link
                    key={m.session_id}
                    className={styles.cTbody}
                    href={`/teacher-sign/update/${m.session_id}`}
                  >
                    <div className={styles.cTd1}>
                      <img
                        className={styles.courseImg}
                        src={`/course/img/${m?.img_url}`}
                        alt={m?.course_name}
                      />
                    </div>
                    <div className={styles.cTd2}>{m.course_name}</div>
                    <div className={`d-none`}>上課日期</div>
                    <div className={styles.cTd3}>{formattedStartDate}</div>
                    <div className={styles.cTd4}>{m.region}</div>
                    <div className={styles.cTd5}>{formattedDate}</div>
                  </Link>
                );
              })}
            </div>
          </div>
          <Page
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
