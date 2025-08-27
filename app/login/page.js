"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header";
import SocialLogin from "../components/auth/SocialLogin";
import InputField from "../components/forms/InputField";
import { useAuth } from "@/hooks/use-auth";
// import styles from "../pages/menu.module.css";
import styles from "../../styles/modules/form.module.css";

const appKey = "loginWithToken";
export default function AppPage({ logout }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();
  const [usr, setUser] = useState(-1);
  // 點擊登入按鈕時的處理函式
  const handleLogin = async (e) => {
    e.preventDefault(); // 防止表單提交
    if (!email || !password) {
      alert("請填寫所有欄位");
      return;
    }
    try {
      await login(email, password); // 呼叫 useAuth 中的 login 函式
      // router.push("/pages"); // 登入成功後跳轉
    } catch (error) {
      alert("登入失敗，請檢查您的帳號或密碼！");
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const existingToken = localStorage.getItem(appKey);
  //   console.log(existingToken);

  //   if (existingToken) {

  //     const newUser = JSON.parse(localStorage.getItem("user"));
  //     if (newUser && newUser.role) { // 確保 newUser 和 newUser.role 存在
  //       setUser(newUser);
  //       switch (newUser.role) {
  //         case "operator":
  //           router.push("/hotel-coupon/operatorDetail"); // 轉入 operator
  //           break;
  //         case "teacher":
  //           router.push("/teacher-sign/list"); // 轉入 teacher
  //           break;
  //         case "user":
  //           router.push("/user");
  //           break;
  //         default:
  //           alert("出現錯誤，請通知管理員");
  //           break;
  //       }
  //     } else {
  //       router.push("/user");
  //     }
  //     return;
  //   }
  // }, []);

  useEffect(() => {
    const existingToken = localStorage.getItem(appKey);


    const checkUserAndRedirect = () => {


      if (existingToken) {

        const newUser = JSON.parse(localStorage.getItem("user"));
        if (newUser && newUser.role) {
          setUser(newUser);
          switch (newUser.role) {
            case "operator":
              router.push("/hotel-coupon/operatorDetail");
              break;
            case "teacher":
              router.push("/teacher-sign/list");
              break;
            case "user":
              router.push("/user");
              break;
            default:
              alert("出現錯誤，請通知管理員");
              break;
          }
        } else {
          router.push("/user");
        }
      }
    };

    checkUserAndRedirect(); // 呼叫這個函數來執行檢查和跳轉
  }, []);

  useEffect(() => {
    if (!user) setCheckingAuth(false); // 檢查登入狀態
  }, [user]);

  return (
    <>
      <Header />
      <div className={`${styles.loginWrapper}`}>
        <div className={`${styles.container}`}>
          <div className={`${styles.otherAccounts}`}>
            <h4 className={`${styles.title}`}>登入</h4>
            <div className={`${styles.otherAccountsLink}`}>
              <Link
                href="/login"
                className={`text-decoration-none ${styles.teacher}`}
              >
                師資登入
              </Link>
              <Link
                href="/login"
                className={`text-decoration-none ${styles.hotel}`}
              >
                旅館業者登入
              </Link>
            </div>
          </div>
          <form className={`${styles.lumiLogin}`} onSubmit={handleLogin}>
            <InputField
              type="email"
              placeholder="電子信件"
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

            <Link href="/forgot-password" className={`${styles.fogotpass}`}>
              忘記密碼？
            </Link>
            <button className={`${styles.loginbtn}`}>登入</button>
            <p className={`${styles.separator}`}>
              <span>或使用社群帳號登入</span>
            </p>
          </form>
          <SocialLogin />
          <p className={`${styles.signup}`}>
            還不是會員？{" "}
            <Link href="/register" className={`${styles.register}`}>
              註冊
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
