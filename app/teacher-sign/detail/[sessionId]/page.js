"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/app/components/layout/header";
import My from "../../_components/my";
import TeacherDetailC from "../../_components/teacher-detailC";

export default function TeacherDetailPage(props) {
  return (
    <> 
      <Header/>    
      <div className="container mt-5 mb-5">
        <div className={`row`}>
          <My/>
          <TeacherDetailC/>
        </div>
      </div>
    

    </>
  );
}
