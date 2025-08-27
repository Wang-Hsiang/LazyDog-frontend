"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/modules/toggle.module.css"

const TeacherCard = ({ imgSrc, col, name, text, link }) => {
  return (
   
      <div className={`mb-5 ${col}`}>
        <Link href={link} passHref className="text-decoration-none">
          <div className={styles.card6} >
            <img src={imgSrc} className="card-img-top" alt="..." />
            <div className={styles.card6Title} style={{}}>
              {name}
            </div>
            <p className={styles.card6Description} style={{ color: "#ff9538" }}>
              {text}
            </p>
          </div>
        </Link>
      </div>
  );
};

export default TeacherCard;
