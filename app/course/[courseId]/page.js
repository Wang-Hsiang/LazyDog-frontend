"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../_components/courseId.module.css";
import Header from "@/app/components/layout/header";
import Breadcrumb from "../_components/Id/breadcrumb";
import CoursePics from "../_components/Id/course-pics";
import SimilarCourseCard from "../_components/Id/similar-course-card";
import CourseIntro from "../_components/Id/course-intro";

export default function CourseIdPage() {
  const params = useParams();
  const courseCode = params.courseId;

  const [course, setCourse] = useState(null);
  const [session, setSession] = useState([]);
  const [place, setPlace] = useState(null);
  const [imgs, setImgs] = useState(null);
  const [simiCourse, setSimiCourse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/course/${courseCode}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setCourse(data.course);
        setSession(data.session);
        setPlace(data.place);
        setImgs(data.imgs);
        setSimiCourse(data.simiCourse);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [courseCode]);

  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumb course={course} />
      </div>
      <div className="container">
        <div className={`row ${styles.section1}`}>
          <div className="col-12 col-md-5 col-lg-6 order-md-1 order-2 px-4">
            <CoursePics imgs={imgs} />
          </div>
          <div className={`col-12 col-md-7 col-lg-6 order-md-2 order-1 px-5`}>
            <CourseIntro
              course={course}
              session={session}
              place={place}
              params={params}
            />
          </div>
        </div>
        <div className={styles.section2}>
          <SimilarCourseCard simiCourse={simiCourse} />
        </div>
      </div>
    </>
  );
}
