/* eslint-disable @next/next/no-img-element */

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import styles from "../../../styles/modules/form.module.css"

export default function SocialLogin() {
  const { googleLogin } = useAuth();

  return (
    <div className={`${styles.sociallogin}`}>
      {/* Google 登入按鈕 */}
      <button onClick={googleLogin} className={`${styles.socialloginBtn}`}>
        <img
          src="/images/Google.png"
          alt="google"
          className={`${styles.googleIcon}`}
        />
      </button>

      {/* LINE 登入按鈕 */}
      {/* <Link href="/line/google-login" className={`${styles.socialloginBtn}`}>
        <img src="/images/line.webp" alt="line" className={`${styles.lineIcon}`} />
      </Link> */}
    </div>
  );
}
