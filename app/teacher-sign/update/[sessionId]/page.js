"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/app/components/layout/header";
import My from "../../_components/my";
import TeacherUpdateC from "../../_components/teacher-updateC";

export default function TeacherUpdatePage() {
  return (
    <>
      <Header />
      <div className={`container lumi-all-wrapper mb-5`}>
        <div className={`row`}>
          <My />
          <TeacherUpdateC />
        </div>
      </div>
    </>
  );
}
