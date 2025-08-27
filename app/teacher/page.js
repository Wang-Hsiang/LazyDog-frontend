"use client";

import React from "react";
import Header from "../components/layout/header";
import TeacherSection from "../components/teacher/teacherSection";
import CourseSection from "../components/teacher/courseSection";
import styles from "../../styles/modules/toggle.module.css";
import Slider from "../components/teacher/slider";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Header />
      <div className="mt-5">
        <section className="text-center">
          <h2 className={`${styles.server}`}>師資服務</h2>
        </section>
        <TeacherSection />
        <section>
          <CourseSection />
          <Slider />
        </section>
      </div>
    </div>
  );
}
