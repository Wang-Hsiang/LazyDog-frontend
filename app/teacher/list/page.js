"use client";

import React, { useState, useEffect } from "react";
import { useTeachers } from "@/hooks/useTeachers";
import Header from "../../components/layout/header";
import Breadcrumb from "../../components/teacher/breadcrumb";
import Filter from "../../components/teacher/Filter";
import TeacherCard from "../../components/teacher/teacherCard";
import styles from "./list.module.css";
import Page from "../../components/hotel/page";
import style1 from "../../product/list/list.module.css";
import style from "../../user/menu.module.css";

export default function App() {
  const { teachers = [], loading } = useTeachers();
  const [filtered, setFiltered] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false); // 控制篩選選單開關

  // 當 `teachers` 資料載入時，設定 `filtered` 預設為所有老師
  useEffect(() => {
    if (teachers.length > 0) {
      setFiltered(teachers);
    }
  }, [teachers]);

  // 分頁
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const totalPages =
    filtered.length > 0 ? Math.ceil(filtered.length / perPage) : 1;

  const startIndex = (currentPage - 1) * perPage;
  const currentTeacher = (filtered || []).slice(
    startIndex,
    startIndex + perPage
  );

  // 處理篩選條件
  const filter = (searchText, selectCategories, selectGenders) => {
    const filterData = teachers.filter(
      (teacher) =>
        (searchText === "" ||
          teacher.name.includes(searchText) ||
          teacher.category_name.includes(searchText)) &&
        (selectCategories.length === 0 ||
          selectCategories.includes(teacher.category_name)) &&
        (selectGenders.length === 0 || selectGenders.includes(teacher.gender))
    );
    console.log("Filtered Data:", filterData);
    setFiltered(filterData);
    setCurrentPage(1); // 篩選後重置分頁到第 1 頁
  };

  // 點擊畫面其他地方時，自動關閉篩選選單
  useEffect(() => {
    const clickOutside = (event) => {
      if (
        filterOpen &&
        !event.target.closest(`.${styles.asideContainer}`) &&
        !event.target.closest(`.${styles.filterButton}`)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [filterOpen]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  if (loading) return;
  <>
    <div className={style.container2}>
      <div className={style.loader27}></div>
    </div>
  </>;

  return (
    <>
      <Header />
      <div className="lumi-all-wrapper">
        <div className={`${styles.collapseAside} d-lg-none`}>
          <div className={`${styles.collapseAsideContent}`}>
            <button
              className={`btn d-md-none ${styles.right}`}
              onClick={() => setFilterOpen(!filterOpen)}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterOffcanvas"
              aria-expanded="false"
              aria-controls="filterOffcanvas"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className={styles.container}>
          <section className={style1.DmArea}>
            <div className={`mt-5 lumi-all-wrapper ${styles.courseContainer}`}>
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                {/* 指示器 */}
                <div className={`carousel-indicators ${styles.carouselbtn}`}>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="3"
                    aria-label="Slide 4"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="4"
                    aria-label="Slide 5"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="5"
                    aria-label="Slide 6"
                  ></button>
                </div>
                <div className={`carousel-inner ${styles.carouselTrack}`}>
                  {/* 第一個課程 */}
                  <div
                    className={`carousel-item active ${styles.carouselItem}`}
                  >
                    <img className="d-block w-100" src="/teacher-img/m1.jpg" />
                  </div>
                  <div className={`carousel-item ${styles.carouselItem}`}>
                    <img className="d-block w-100" src="/teacher-img/m2.jpg" />
                  </div>
                  <div className={`carousel-item ${styles.carouselItem}`}>
                    <img className="d-block w-100" src="/teacher-img/m5.jpg" />
                  </div>
                  <div className={`carousel-item ${styles.carouselItem}`}>
                    <img className="d-block w-100" src="/teacher-img/m6.png" />
                  </div>
                  <div className={`carousel-item ${styles.carouselItem}`}>
                    <img className="d-block w-100" src="/teacher-img/m3.jpg" />
                  </div>
                  <div className={`carousel-item ${styles.carouselItem}`}>
                    <img className="d-block w-100" src="/teacher-img/m7.jpg" />
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.BreadcrumbsTitle}>
            <Breadcrumb
              links={[
                { label: "首頁 ", href: "/" },
                { label: " 師資服務", href: "/teacher" },
                { label: " 師資列表", href: "/teacher/list", active: true },
              ]}
            />
            <div className={`mt-4 ${style1.Title}`}>
              <div>
                <h3 className={`mb-3 ${style1.list}`}>師資列表</h3>
                <div className={` ${styles.sbar}`}></div>
              </div>
              <div className={`${style1.TitleFilter} ${styles.filterButton}`}>
                <h6>共計 {filtered.length} 位老師</h6>
              </div>
            </div>
          </section>

          <section className={styles.pdArea}>
            <div className="row">
              {/* 桌機版篩選選單 */}
              <div className={`col-md-3 ${styles.asideContainer}`}>
                <Filter filterChange={filter} />
              </div>

              {/* 手機版篩選選單 (滑入效果) */}
              <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="filterOffcanvas"
                aria-labelledby="filterOffcanvasLabel"
              >
                <div className="offcanvas-header">
                  {/* <h5 className="offcanvas-title" id="filterOffcanvasLabel">
          篩選
        </h5> */}
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <Filter filterChange={filter} />
              </div>

              {/* 師資列表 */}
              <div className="col-md-9 col-12">
                <div className="row mt-1 mb-5">
                  {currentTeacher.length > 0 ? (
                    <>
                      {currentTeacher.map((teacher) => (
                        <TeacherCard
                          key={teacher.id}
                          imgSrc={`/teacher-img/${teacher.img}`}
                          col="col-6 col-md-4"
                          name={teacher.name}
                          text={teacher.category_name}
                          link={`/teacher/info/${teacher.id}`}
                        />
                      ))}
                      {/* 補充「透明但佔位的卡片」，避免版面跑掉 */}
                      {Array.from({
                        length: Math.max(0, 8 - currentTeacher.length),
                      }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="col-6 col-md-4"
                          style={{
                            visibility: "hidden", // 讓它隱藏但仍佔位
                            minHeight: "250px",
                          }}
                        >
                          <TeacherCard
                            imgSrc=""
                            col=""
                            name=""
                            text=""
                            link=""
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    // 沒有符合條件時顯示
                    <div className="no-results">
                      <p>沒有符合條件的老師</p>
                    </div>
                  )}
                </div>

              
                {filtered.length > 0 && (
                  <Page
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                )}

          
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
