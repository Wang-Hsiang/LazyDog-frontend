"use client";

import React from "react";
// import Link from "next/link";
// import Header from "./components/layout/header";
// import { useAuth } from "@/hooks/use-auth";
// import styles from "../styles/modules/form.module.css";
import { redirect } from "next/navigation";
export default function HomePage() {
  // const { user } = useAuth();
  redirect("/home");
  return (
    <>
      {/* <Header />
      <div className={`${styles.loginWrapper}`}>
        <div className="lumi-home-content">
          <h1>歡迎來到首頁</h1>
          <br />
          <div className="lumi-auth-links">
            <p>
              還沒有帳號？{" "}
              <Link className={`${styles.register}`} href="/register">
                註冊
              </Link>
            </p>
            <p>
              已經有帳號了嗎？{" "}
              <Link className={`${styles.lumiLogin}`} href="/login">
                登入
              </Link>
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}
