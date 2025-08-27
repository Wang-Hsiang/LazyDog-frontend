"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/app/components/layout/header";
import My from "../_components/my";
import TeacherInfo from "../_components/teacher-info";

export default function TeacherInfoPage() {
  return (
    <>
      <Header />
      <div className={`container mb-5 lumi-all-wrapper`}>
        <div className={`row`}>
          <My />
          <TeacherInfo />
        </div>
      </div>
    </>
  );
}
