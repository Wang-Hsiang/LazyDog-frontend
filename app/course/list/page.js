"use client";

import React, { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../_components/courseList.module.css";
import Header from "@/app/components/layout/header";
import News from "../_components/list/news";
import SideBar from "../_components/list/sideBar";
import CourseCard from "../_components/list/course-card";
import Page from "@/app/components/hotel/page";

import OtherCourseCard from "../_components/list/other-course-card";

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    types: [],
    places: [],
  });

  // 取得篩選後的課程
  useEffect(() => {
    setLoading(true);

    const fetchCourses = async () => {
      try {
        const query = new URLSearchParams({
          keyword: filters.keyword || "", // 確保 keyword 存在
          typeF: filters.types.length ? filters.types.join(",") : "", // 確保 key 存在
          placeF: filters.places.length ? filters.places.join(",") : "", // 確保 key 存在
        });

        // if (filters.types.length)
        //   query.append("typeF", filters.types.join(","));
        // if (filters.places.length)
        //   query.append("placeF", filters.places.join(","));

        // console.log("查詢參數:", query.toString());
        // console.log("目前篩選:", filters);

        const res = await fetch(
          `http://localhost:5000/api/course?${query.toString()}`
        );
        const data = await res.json();

        // console.log("後端回應:", data);

        setCourses(data?.data?.courses || []);
        setTypes(data?.data?.types || []);
        setPlaces(data?.data?.places || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  // 分頁
  const [currPage, setCurrPage] = useState(1);
  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(courses?.length / perPage));
  const startIndex = (currPage - 1) * perPage;
  const currentCourses = courses?.slice(startIndex, startIndex + perPage);

  return (
    <>
      <Header />
      <News />
      <main className={styles.list}>
        <div className={`container ${styles.section1}`}>
          <div className={`row`}>
            <SideBar
              types={types}
              places={places}
              filters={filters}
              setFilters={setFilters}
            />
            <CourseCard
              courses={courses}
              currentCourses={currentCourses}
              loading={loading}
              filters={filters}
            />
            <Page
              totalPages={totalPages}
              currentPage={currPage}
              onPageChange={setCurrPage}
            />
          </div>
        </div>
        <div className={`container ${styles.section2}`}>
          <OtherCourseCard />
        </div>
      </main>
    </>
  );
}
