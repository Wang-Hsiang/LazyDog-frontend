"use client"

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../../styles/modules/toggle.module.css";
import style from "../../../styles/modules/teacher.module.css";
function CourseSection() {

  return (
    <section>
      <div className={`mt-5 lumi-all-wrapper ${styles.courseContainer}`}>
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          {/* 指示器 */}
          <div className={`carousel-indicators ${styles.carouselbtn}`}>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
          </div>
          <div className={`carousel-inner ${styles.carouselTrack}`} >
            {/* 第一個課程 */}
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <div className="row">
                <div className={`col-lg-6 col-12 ${styles.mobile}`}>
                  <h6 className="my-3 lumi-s-title">提升毛孩健康的最佳選擇</h6>
                  <h3 className="mb-4 lumi-m-title">寵膳食育</h3>

                  <div className="mt-3  pe-5">
                    <p className=" ">
                      我們的寵膳食育課程致力於提供全面且高品質的毛孩飲食與健康知識，滿足您和毛孩的需求。由擁有豐富經驗的專業寵物老師領導，我們提供有關毛孩健康飲食、手作餐點、營養補充等課程，確保您的毛孩享有營養均衡且美味的餐點。
                    </p>
                    <div className="row mt-5">
                      <img
                        className={`col-3  ${styles["person"]}`}
                        src="/teacher-img/DSC_9689.jpg"
                        alt=""
                      />
                      <p className="col-9 my-4">
                        我非常推薦寵膳食育課程！老師深知每隻毛孩的需求，並且透過生動的教學方式，帶領飼主們一起動手做健康的餐點，讓毛孩享受新鮮、美味且營養豐富的食物。
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link
                        className={`block mx-auto text-center text-decoration-none ${style.teacherBtn}`}
                        href="/course/list"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
                <Link className={`mb-3 col-lg-6 col-12 ${styles.image}`} href="/course/list">
                  <img src="/teacher-img/eat.png" alt="" />
                </Link>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <h6 className="my-3 lumi-s-title">
                    讓毛孩擁有健康亮麗的外型
                  </h6>
                  <h3 className="mb-4 lumi-m-title">寵物美容</h3>

                  <div className="mt-3  pe-5">
                    <p className=" ">
                      我們的寵物美容課程專注於提供毛孩美容護理和健康維護的專業知識，幫助毛孩保持最佳的外觀與狀態。課程由經驗豐富的專業寵物美容師指導，涵蓋了從基本美容技巧到進階護理技巧，讓您的毛孩無論是外觀還是健康都能達到最佳平衡。
                    </p>
                    <div className="row mt-5">
                      <img
                        className={`col-3  ${styles["person"]}`}
                        src="/teacher-img/c4.jpg"
                        alt=""
                      />
                      <p className="col-9 my-4">
                        我強烈推薦寵物美容課程！老師不僅擁有多年的專業經驗，對於每隻毛孩的需求也能精確把握。無論是毛發護理、洗澡、修剪還是指甲修整，老師都能提供深入且專業的指導。
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link
                        className={`block mx-auto text-center text-decoration-none ${style.teacherBtn}`}
                        href="/course/list"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
                <Link className={`mb-3 col-lg-6 col-12 ${styles.image}`} href="/course/list">
                  <img src="/teacher-img/salon.png" alt="" />
                </Link>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <h6 className="my-3 lumi-s-title">
                    專業寵物訓練讓您的毛孩聰明又乖巧
                  </h6>
                  <h3 className="mb-4 lumi-m-title">寵物訓練</h3>

                  <div className="mt-3  pe-5">
                    <p className=" ">
                      我們的寵物訓練課程專為不同年齡與品種的毛孩設計，從基本服從訓練到行為矯正，幫助毛孩學會聽從指令，提升其社交與生活技能。由經驗豐富的專業訓練師帶領，課程內容不僅注重技巧的學習，還強調與毛孩之間的信任與互動，讓訓練過程變得有趣而高效。
                    </p>
                    <div className="row mt-5">
                      <img
                        className={`col-3  ${styles["person"]}`}
                        src="/teacher-img/Pty-Insta-a-Img-4-1.png"
                        alt=""
                      />
                      <p className="col-9 my-4">
                        寵物訓練的老師的教學方法深入淺出，根據每隻毛孩的特性量身定制訓練計劃。無論是處理破壞行為，還是改善日常生活中的小問題，老師都能提供耐心且專業的指導，讓毛孩更好地融入家庭生活。
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link
                        className={`block mx-auto text-center text-decoration-none ${style.teacherBtn}`}
                        href="/course/list"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
                <Link className={`mb-3 col-lg-6 col-12 ${styles.image}`} href="/course/list">
                  <img src="/teacher-img/train.png" alt="" />
                </Link>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <h6 className="my-3 lumi-s-title">
                    全方位寵物照護讓毛孩生活更健康
                  </h6>
                  <h3 className="mb-4 lumi-m-title">寵物照護</h3>

                  <div className="mt-3  pe-5">
                    <p className=" ">
                      我們提供專業的寵物照護服務，從日常健康管理到緊急狀況處理，為您的毛孩提供全方位的關愛。無論是飲食、運動、還是定期檢查，我們的專業團隊都會根據每隻毛孩的需求量身定制最佳方案，確保它們過上健康快樂的生活。讓我們一起守護毛孩的幸福時光，給予它們最好的照顧！
                    </p>
                    <div className="row mt-5">
                      <img
                        className={`col-3  ${styles["person"]}`}
                        src="/teacher-img/c1.jpg"
                        alt=""
                      />
                      <p className="col-9 my-4">
                        寵物照護的老師不僅擁有豐富的經驗，還能根據每隻毛孩的個性與需求提供量身定制的照護建議。學習老師的照護技巧後，我不僅提升了照顧毛孩的能力，也加深了我與毛孩之間的感情。
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link
                        className={`block mx-auto text-center text-decoration-none ${style.teacherBtn}`}
                        href="/course/list"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
                <Link className={`mb-3 col-lg-6 col-12 ${styles.image}`} href="/course/list">
                  <img src="/teacher-img/care.png" alt="" />
                </Link>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <h6 className="my-3 lumi-s-title">提升毛孩健康的最佳選擇</h6>
                  <h3 className="mb-4 lumi-m-title">商業思維與專業培訓</h3>

                  <div className="mt-3  pe-5">
                    <p className=" ">
                      我們的特定專業寵物培訓班，針對不同領域提供專業知識與技能訓練，讓您不僅能照顧毛孩的日常需求，還能掌握生命禮儀與法律相關知識。專業訓練班不僅提升您的知識和技能，還能幫助您在特殊情況下做出更為周全的決策，讓您的毛孩過上更有品質的生活。
                    </p>
                    <div className="row mt-5">
                      <img
                        className={`col-3  ${styles["person"]}`}
                        src="/teacher-img/c2.jpg"
                        alt=""
                      />
                      <p className="col-9 my-4">
                        我非常推薦專業寵物特定培訓班。特別是在寵物生命禮儀課程中，我學到了如何尊重和陪伴毛孩度過生命的最後一程，給予毛孩最溫暖的告別。
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link
                        className={`block mx-auto text-center text-decoration-none ${style.teacherBtn}`}
                        href="/course/list"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
                <Link className={`mb-3 col-lg-6 col-12 ${styles.image}`} href="/course/list">
                  <img src="/teacher-img/busin.png" alt="" />
                </Link>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseSection;
