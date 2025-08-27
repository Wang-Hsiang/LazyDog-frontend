"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../css/teacherSignAdd.module.css";
import Header from "@/app/components/layout/header";
import My from "../_components/my";
import TeacherAddC from "../_components/teacher-addC";

export default function TeacherAddPage() {
  return (
    <>
      {/* 點擊圖片 Bs Modal (彈出視窗)  */}
      <div
        className={`modal ${styles.fade}`}
        id="imageModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered`}>
          <div className={`modal-content`}>
            <div className={`modal-body text-center`}>
              <img
                id="modalImage"
                className={`img-fluid`}
                src=""
                alt="放大圖片"
              />
            </div>
          </div>
        </div>
      </div>

      <Header />
      <div className={`container lumi-all-wrapper mb-5`}>
        <div className={`row`}>
          <My />
          <TeacherAddC />
        </div>
      </div>
    </>
  );
}
