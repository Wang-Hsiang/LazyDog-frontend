"use client";

import React, { useState, useEffect  } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import {useTeacherDetail } from "../../../hooks/useTeacherDetail";
import styles from '../../teacher/info/info.module.css';
import style from "../../user/menu.module.css";

export default function Profile () {
  const { id } = useParams();
  const { teacher, loading } = useTeacherDetail(id);
  // 取得當前頁面的 URL
  const currentURL = `http://localhost:3000/teacher/info/${id}`

 const facebookShare = () => {
   window.open(
     `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
       currentURL
     )}`,
     "_blank"
   );
 };
  const igShare = () => {
    window.open(`https://www.instagram.com/`, "_blank");
  };

  if (loading) {
    return (
      <div className={style.container2}>
        <div className={style.loader27}></div>
      </div>
    );
  }

  return (
    <>
      <div className={`my-5 ${styles["profile"]}`}>
        <div className="row g-5">
          <div className="col-12 col-md-6 col-lg-5">
            <img
              src={`/teacher-img/${teacher.img}`}
              className={styles.profileImg}
              alt={teacher.name}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-7 ps-5">
            <h5 className={`mb-4 ${styles["type"]}`}>
              {teacher.category_name}
            </h5>
            <h3 className={`mb-4 ${styles["mark"]}`}> {teacher.name}</h3>{" "}
            <p
              dangerouslySetInnerHTML={{
                __html: teacher.Introduce?.replace(/\n/g, "<br>") || "",
              }}
            ></p>
          </div>
        </div>
      </div>
      {/* <div className={styles.socialLinks}>
        <span className="me-3">分享到</span>
        <a
          className={`text-decoration-none mx-2 ${styles["icon"]}`}
          onClick={facebookShare}
        >
          <i className="bi bi-facebook"></i>
        </a>
        <a
          className={`text-decoration-none mx-2 ${styles["icon"]}`}
          onClick={igShare}
        >
          {" "}
          <i className="bi bi-instagram"></i>
        </a>
        <a className={`text-decoration-none mx-2 ${styles["icon"]}`} href="#">
          <i className="bi bi-share-fill"></i>
        </a>
      </div> */}
    </>
  );
};
