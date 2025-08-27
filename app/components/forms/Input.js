"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/user/menu.module.css";
export default function ComponentsInputFiled({
  type,
  name,
  placeholder,
  icon,
  value,
  onChange,
}) {
  console.log(styles);
  return (
    <>
      <div className={`mb-3 ${styles.teacherInput}`}>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={` p-2 rounded ${styles.filed}`}
          value={value} // 綁定 value 到狀態
          onChange={onChange}
        />
        <i>{icon}</i>
        {/* {type === "password" && <i>visibility_off</i>} */}
      </div>
    </>
  );
}
