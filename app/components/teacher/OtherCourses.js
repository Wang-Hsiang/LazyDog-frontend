"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCourseRandom } from "@/hooks/useCourseRandom";
import styles from "../../../styles/modules/toggle.module.css";
const OtherCourses = () => {
  const { courses } = useCourseRandom();
  const [cards, setCards] = useState([]);

    useEffect(() => {
      if (courses.length > 0) {
        const formatCards = courses.map((teacher) => ({
          id: teacher.id,
          name: teacher.name,
          imgSrc: `/course/img/${teacher.course_img}`,
          link: `/course/${teacher.id}`,
          text: teacher.category_name,
          col: "col-6 col-md-3",
        }));

        setCards(formatCards); // 更新卡片資料
      }
    }, [courses]); 
  return (
    <>
      {cards.map((card, index) => (
        <div key={index} className="col-12 col-md-6 col-lg-3">
          <Link href={card.link} passHref className="text-decoration-none">
            <div className={styles.card7} style={{ width: "18.75rem" }}>
              <img src={card.imgSrc} className={`card-img-top ${styles.cardImg}`} alt="..." />
              <div className={styles.card7Title}>{card.name}</div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default OtherCourses;