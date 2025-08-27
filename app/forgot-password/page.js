"use client";
import { useState, useEffect } from "react";
import styles from "./member.module.css";
import Link from "next/link";
import Header from "../components/layout/header";
// import useAuth from "../hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";

export default function ForgetPasswordForm() {
  const { generateOtp, resetPassword,user } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userOtp, setUserOtp] = useState(""); // 使用者輸入的驗證碼
  const [newPassword, setNewPassword] = useState(""); // 使用者輸入的新密碼
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // 使用者再次確認的新密碼
  useEffect(() => {
    // otp 有新值時，在這裡執行一些操作，例如 log 出新值
    if (otp) {
      console.log("New OTP token:", otp);
    }
  }, [otp]);
  const handleGetOtp = async () => {
    if (!email) {
      setError("請輸入電子郵件地址");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const token = await generateOtp(email);
      setOtp(token);
      // setOtpToken(otpToken)

      setMessage("驗證碼已發送至您的電子郵件");
    } catch (err) {
      console.log(err);

      setError("獲取驗證碼失敗，請稍後再試");
    }
    setLoading(false);

  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!userOtp || !newPassword || !confirmNewPassword) {
      setError("請填寫所有欄位");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("密碼與確認密碼不符");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await resetPassword(
        otp,
        userOtp,
        newPassword,
        confirmNewPassword
      );

      if (result.status === "success") {
        setMessage(result.message); // 密碼重置成功訊息
      } else {
        setError(result.message || "密碼重設失敗");
      }
    } catch (err) {
      console.log(err);
      setError("密碼重設失敗，請稍後再試");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="lumi-all-wrapper">
        <main className={`w-100 m-auto text-center ${styles["container"]}`}>
          <h4 className={`text-center mb-4 ${styles["text"]}`}>重設密碼</h4>
          <p className={`text-center mb-4 ${styles["text-note"]}`}>
            輸入你的會員電子郵件地址，按下"取得驗證碼"按鈕後，我們會將密碼重設指示寄送給你。
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="row mb-4">
              <div className={`col-sm-12 ${styles["input"]}`}>
                <input
                  type="email"
                  name="email"
                  className={`form-control w-100 ${styles["formControl"]}`}
                  placeholder="電子郵件地址"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className={`col-sm-12 ${styles["input"]}`}>
                <div className="input-group">
                  <input
                    type="text"
                    name="otp"
                    className={`form-control ${styles["formControl"]}`}
                    placeholder="電子郵件驗證碼"
                    onChange={(e) => setUserOtp(e.target.value)}
                  />
                  <button
                    className={`btn ${styles["submit"]}`}
                    type="button"
                    id="button-addon2"
                    onClick={handleGetOtp}
                    disabled={loading}
                  >
                    {loading ? "發送中..." : "取得驗證碼"}
                  </button>
                </div>
              </div>
            </div>
            {message && <p className={styles["success-message"]}>{message}</p>}
            {error && <p className={styles["error-message"]}>{error}</p>}

            <div className="row mb-4">
              <div className="col-sm-12">
                <input
                  type="password"
                  name="newPassword"
                  autocomplete="new-password"
                  className={`form-control w-100 ${styles['formControl']} ${styles['invalid']} `}
                  placeholder="密碼"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

            </div>
            <div className="row mb-4">
              <div className="col-sm-12">
                <input
                  type="password"
                  name="confirmNewPassword"
                  autocomplete="off"
                  className={`form-control w-100 ${styles['formControl']} ${styles['invalid']} `}
                  placeholder="確認密碼"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

            </div>

            <button type="submit" className={`btn mb-4 w-100 ${styles['submit']}`}>
              確定
            </button>

            <div className="row mt-2">
              {!user && (<p className={`${styles['notice']}`}>
                還不是會員？
                <Link className={`${styles['join']}`} href="/register">加入我們</Link>。
              </p>)}

            </div>
          </form>
        </main>
      </div>
    </>
  );
}
