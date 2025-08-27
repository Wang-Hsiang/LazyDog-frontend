'use client'

import React, { useState, useEffect } from 'react'
import styles from "../../../styles/modules/form.module.css"
import { Eye, EyeOff } from "lucide-react"; // 使用 lucide-react 來顯示眼睛圖標

export default function ComponentsInputFiled({ type, placeholder, icon, value, onChange }) {
  const [password, setPassword] = useState(false); // 控制密碼可見性

  // 切換密碼顯示狀態
  const togglePassword = () => {
    setPassword((prev) => !prev);
  };

  return (
    <>
      <div className={`${styles.inputWrapper}`}>
        <input
          type={type === "password" && !password ? "password" : "text"}
          placeholder={placeholder}
          className={`${styles.inputfiled}`}
          required
          value={value} // 綁定 value 到狀態
          onChange={onChange}
        />
        <i>{icon}</i>
        {type === "password" && (
        <button
          type="button"
          className={styles.eyeButton}
          onClick={togglePassword}
        >
          {password ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      </div>
    </>
  );
}

