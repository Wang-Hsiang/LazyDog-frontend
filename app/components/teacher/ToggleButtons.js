"use client";

import React, { useState, useEffect  } from "react";
import { useParams } from "react-router-dom"
import {useTeacherDetail } from "../../../hooks/useTeacherDetail";
import axios from "axios";
// import useTeacherDetail from "@/hooks/useTeacherDetail";
import styles from "../../../styles/modules/toggle.module.css";
import style from "../../user/menu.module.css";

export default function ToggleButtons (){
  const { id } = useParams();
  const { teacher } = useTeacherDetail(id);
  console.log(id);
  console.log(teacher);

  const [activeTab, setActiveTab] = useState("exps"); // 控制顯示內容 預設顯示經歷

  if (!teacher) {
    return (
      <div className={style.container2}>
        <div className={style.loader27}></div>
      </div>
    );
  }

  return (
    <div className="row g-5">
      <div className="col-12 col-md-6 col-lg-5">
        <div className={styles.infoCard}>
          <h3 className={`mt-2 mb-4 ms-2 ${styles.cardTitle}`}>相關資訊</h3>
          <div
            className={`${styles.menuItem} ${
              activeTab == "exps" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("exps")}
          >
            <i className={`"bi bi-person-fill ${styles.icon}`}></i>
            <span className="ms-1">經歷</span>
          </div>
          <div
            className={`${styles.menuItem} ${
              activeTab === "course" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("course")}
          >
            <i className={`bi bi-mortarboard-fill ${styles.icon}`}></i>
            <span className="ms-1">課程</span>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-7 ps-5">
        {activeTab === "exps" && (
          <div className="mb-5">
            <h4 className="mb-4">經歷 :</h4>
            <ul>
              <li>{teacher.Experience}</li>
              <li>六福村專案犬隻訓練講師</li>
              <li>曾指導許多知名大戲劇</li>
            </ul>
            <h4 className="mb-4">出版 :</h4>
            <ul>
              <li>《馬克先生的狗教室》</li>
              <li>《馬克先生的狗幼兒園》</li>
            </ul>
          </div>
        )}

        {activeTab === "course" && (
          <div className="mb-5">
            <h4 className="mb-4">課程 :</h4>
            <ul>
              <li>{teacher.Experience}</li>
              <li>六福村專案犬隻訓練講師</li>
              <li>曾指導許多知名大戲劇</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};