"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/layout/header";
import SocialLogin from "../components/auth/SocialLogin";
import InputFiled from "../components/forms/InputField";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import styles from "../../styles/modules/form.module.css";
import Swal from "sweetalert2";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, register } = useAuth();
  const router = useRouter();
  const dateForm = () => {
    //     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // if (!isValidEmail(email)) {
    //   return res.status(400).json({ status: "fail", message: "電子郵件格式無效" });
    // }
    if (password.length < 8) {
      // alert("密碼需至少包含 8 個字符");
      Swal.fire({
        icon: "error",
        text: "密碼需至少包含 8 個字符",
      });
      return false;
    }
    return true;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!dateForm()) return;
    if (password !== confirmPassword) {
      // alert("密碼和確認密碼不一致");
      Swal.fire({
        icon: "error",
        text: "密碼和確認密碼不一致",
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      return;
    }
    try {
      await register(email, password, confirmPassword);
    } catch (error) {
      // alert("註冊失敗！");
      Swal.fire({
        icon: "error",
        text: "註冊失敗！",
        showConfirmButton: false,
        timer: 950,
        customClass: {
          popup: styles.tsaiSwal,
        },
      });
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className={`${styles.loginWrapper}`}>
        <div className={`${styles.container}`}>
          <h4 className={`${styles.title}`}>註冊</h4>

          <form
            action="#"
            className={`${styles.lumiLogin}`}
            onSubmit={handleRegister}
          >
            <InputFiled
              type="email"
              placeholder="電子信箱"
              icon=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputFiled
              type="password"
              placeholder="密碼"
              icon=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputFiled
              type="password"
              placeholder="再次確認密碼"
              icon=""
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <p className={`${styles.agree}`}>
              點擊註冊，即表示您已閱讀並同意
              <Link href="/about/member" className={`${styles.terms}`}>
                會員條款
              </Link>
              與
              <Link href="/about/customer" className={`${styles.terms}`}>
                客戶隱私權條款
              </Link>
            </p>
            <button className={`${styles.loginbtn}`}>註冊會員</button>
            <p className={`${styles.separator}`}>
              <span>或使用社群帳號註冊</span>
            </p>
            <SocialLogin />
          </form>
          <p className={`${styles.logintext}`}>
            已經有帳號了嗎？{" "}
            <Link href="/login" className={`${styles.Login}`}>
              登入
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
