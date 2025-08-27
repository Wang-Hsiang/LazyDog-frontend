"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { redirect } from "next/navigation";
// import TeacherAside from "../_components/teacher-aside";
// import TeacherDetailC from "../_components/teacher-info";

export default function TeacherDetailPage(props) {
  redirect("/teacher-sign/list")
  return (
    <>     
      {/* <div className="container mt-5 mb-5">
        <div className={`row`}>
          <TeacherAside/>
          <TeacherDetailC/>
        </div>
      </div> */}
    

    </>
  );
}
