"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRandom } from "@/hooks/useRandom";
import styles from "../../../styles/modules/toggle.module.css";

const TeacherCard = () => {
  const { teachers } = useRandom();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (teachers.length > 0) {
      const formatCards = teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        imgSrc: `/teacher-img/${teacher.img}`, 
        link: `/teacher/info/${teacher.id}`,
        text: teacher.category_name ,
        col: "col-6 col-md-3", 
      }));

      setCards(formatCards); // 更新卡片資料
    }
  }, [teachers]); 

  return (
    <div className="row mb-5">
      {cards.map((card, index) => (
        <div key={index} className={`mb-5 ${card.col}`}>
          <Link href={card.link} passHref className="text-decoration-none">
            <div className={styles.card6}>
              <img src={card.imgSrc} className="card-img-top" alt={card.name} />
              <div className={styles.card6Title}>{card.name}</div>
              <p className={` ${styles.card6Description}`} style={{}}>
                {card.text}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TeacherCard;
