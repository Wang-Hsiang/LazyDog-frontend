"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../layout/header"; 
import MyMenu from "../layout/myMenu"; 
import SocialLogin from "./SocialLogin"; 
import InputField from "../forms/InputField"; 
import axios from "axios";
import "firebase/auth";
import { app } from "../utils/firebase";
import styles from "../../../styles/modules/form.module.css"


export default function AppPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("提交的登入資料:", { email, password });
    // 發送登入請求到後端
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({})); // 處理非 JSON 回應
        throw new Error(errData.message || `HTTP ${response.status}`);
      } else {
        const data = await response.json();
        // 登入成功後的處理
        localStorage.setItem("token", data.token); // 儲存 token 以供後續使用
        alert("登入成功");
      }
    } catch (error) {
      console.log(error);
      alert("登入過程中發生錯誤");
    }
  };

  return (
    <>
      <Header />
      <div className={`${styles.container}`}>
        <h2 className={`${styles.title}`}>登入</h2>

        <form className={`${styles.lumiLogin}`} onSubmit={handleLogin}>
          <InputField
            type="email"
            placeholder="電子信件或手機號碼"
            icon=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="密碼"
            icon=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="#" className={`${styles.fogotpass}`}>
            忘記密碼？
          </a>
          <button className={`${styles.loginbtn}`}>登入</button>
          <p className={`${styles.separator}`}>
            <span>或使用社群帳號登入</span>
          </p>
          <SocialLogin />
        </form>
        <p className={`${styles.signup}`}>
          還不是會員？{" "}
          <Link href="/register" className={`${styles.register}`}>
            註冊
          </Link>
        </p>
      </div>
    </>
  );
}

