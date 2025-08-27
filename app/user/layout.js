"use client";
// import styles from "./user.module.css";
import MyMenu from "../components/layout/myMenu";
import Header from "../components/layout/header";
import style from "../../styles/modules/menu.module.css";
import Bread from "../components/teacher/breadcrumb";

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <div className={`lumi-all-wrapper`}>
        <Bread
          links={[
            { label: "首頁 ", href: "/" },
            {
              label: "個人資料",
              href: "/user",
              active: true,
            },
          ]}
        />
      </div>
      <div className="row">
        <div className={`${style.wrapper}`}>
          <MyMenu />
          {children}
        </div>
      </div>
    </>
  );
}
