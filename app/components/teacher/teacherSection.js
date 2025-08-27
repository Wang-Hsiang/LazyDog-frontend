"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/modules/toggle.module.css";
import OtherTeacher from "./otherTeacher";
import style from "../../../styles/modules/teacher.module.css";
export default function TeacherSection() {
  const [state, setState] = useState(null);

  return (
    <section className="">
      <div className={` pt-5 text-center ${style.teacher} `}>
        <div className={`mt-5 ${styles.textContainer}`}>
          <h3 className="mb-5 lumi-m-title">嚴選的師資團隊</h3>
          <div className={`mb-5 ${styles.container}`}>
            <p>
              我們對寵物師資的挑選份外嚴格，必須有豐富的經驗、耐心、傾聽能力、堅強的心志，才能陪伴飼主和狗狗一起經歷改變。
            </p>
            <p>
              我們的宗旨是：用愛與同理將每個毛孩當成自己的孩子來教導與照護，用正向的方式引導毛孩的心理及生理，相信每個毛孩都有機會改變！
            </p>
          </div>

          <div className={`${styles.imagesContainer}`}>
            <img
              className={`${styles.leftImage}`}
              src="/teacher-img/18.svg"
              alt=""
            />
            <img
              className={`${styles.rightImage}`}
              src="/teacher-img/23.svg"
              alt=""
            />
          </div>

          <div className="d-flex mb-5 justify-content-center">
            <Link
              className={`text-center text-decoration-none ${style.teacherBtn}`}
              href="/teacher/list"
            >
              READ MORE
            </Link>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <img
            style={{ width: "100%" }}
            className=""
            src="/teacher-img/yellow.png"
            alt=""
          />
        </div>
      </div>

      <div className={`text-center ${style.container} ${styles.container}`}>
        <div className={`text-center row ${style.dog}`}>
          {/* 左邊數據 */}
          <div className={`col-4`}>
            <div>803</div>
            <div>蛻變的狗狗</div>
          </div>

          {/* 中間圖片 */}
          <div className={`col-4 ${style.img}`}>
            <img
              className={`${styles["dog-image"]}`}
              src="/teacher-img/dog.png"
              alt=""
            />
          </div>

          {/* 右邊數據 */}
          <div className={`col-4`}>
            <div>5525</div>
            <div>為狗狗服務時數</div>
          </div>

          {/* 三張裝飾圖片 */}
          {/* <div className={`${styles.imageContainer}`}>
           
            <div className={styles.leftImages}>
              <img
                className={styles.leftImage}
                src="/teacher-img/11.svg"
                alt=""
              />
              <img
                className={styles.leftImage}
                src="/teacher-img/20.svg"
                alt=""
              />
            </div>

           
            <img
              className={styles.rightImage}
              src="/teacher-img/22.svg"
              alt=""
            />
          </div> */}
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <img
          style={{ width: "100%" }}
          className=""
          src="/teacher-img/yello2.png"
          alt=""
        />
      </div>
      <div className={`lumi-all-wrapper pb-5 ${styles.container}`}>
        <h3 className="my-5 lumi-m-title ">推薦師資</h3>
        <OtherTeacher />
      </div>
      <div style={{ width: "100%" }}>
        <img
          style={{ width: "100%" }}
          className=""
          src="/teacher-img/rice.png"
          alt=""
        />
      </div>
    </section>
  );
}
