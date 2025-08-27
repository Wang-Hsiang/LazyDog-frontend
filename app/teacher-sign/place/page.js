"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/app/components/layout/header";
import My from "../_components/my";
import TeacherPlace from "../_components/teacher-place";

export default function PlacePage() {
  return (
    <>
      <Header />
      <div className="container lumi-all-wrapper">
        <div className="row">
          <My />
          <TeacherPlace />
        </div>
      </div>
    </>
  );
}
