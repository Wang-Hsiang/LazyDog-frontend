"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/modules/footer.module.css";
// import styles from "../../styles/modules/footerGlobals.module.css"

export default function HomePage(props) {
  return (
    <>
      <footer className={styles.footer}>
        <section className={styles.footerTop}>
          <img className={styles.topWave} src="/footer/img/footer_top.png"   alt="" />
        </section>
        <section className={styles.footerMiddle}>
          <ul className={styles.infos}>
            <li className={styles.footerList1}>
              <a className={styles.connects} href><figure><img className={styles.logoPic} src="/footer/img/logo_pic(white).png"/></figure></a>
              <article className={styles.place}>
                <div className={styles.address}>
                  <p className={styles.addInfo}>320桃園市中壢區新生路二段421號</p>
                  <p className={styles.addInfo}>03-4532632</p>
                </div>
                <div className={styles.time}>
                  <p className={styles.timeInfo}>
                    營業期間：09:30-19:30<br />
                    入住時間：15:00-19:00&nbsp;&nbsp;&nbsp;&nbsp;退房時間：11:00-14:00
                  </p>
                </div>
              </article>
            </li>
            <li className={styles.footerList2}>
              <h1 className={styles.clientService}>客戶服務</h1>
              <p><a className={styles.service} href>關於LAZYDOG</a></p>
              <p><a className={styles.service} href>寵物週邊</a></p>
              <p><a className={styles.service} href>線上訂房</a></p>
              <p><a className={styles.service} href>寵物課程</a></p>
              <p><a className={styles.service} href>毛孩新知</a></p>
            </li>
            <li className={styles.footerList3}>
              <h1 className={styles.clientService}>其他服務</h1>
              <p><a className={styles.service} href>會員集點</a></p>
              <p><a className={styles.service} href>優惠券</a></p>
              <p><a className={styles.service} href>常見問題</a></p>
            </li>
            <li className={styles.footerList4}>
              <form className={styles.footerEmail} action="">
                <input className={styles.enterMail} type="text" placeholder="Enter your email" />
                <button className={styles.planeBtn}><img src="/footer/img/plane.png" alt="" /></button>
              </form>
              <p className={styles.discount}>輸入Email~首次購買即可享 15% 折扣！</p>
              <div className={styles.footerIcon}>
                <a href><img className={styles.icons} src="/footer/img/FB.png"   alt="" /></a>
                <a href><img className={styles.icons} src="/footer/img/IG.png"   alt="" /></a>
                <a href><img className={styles.icons} src="/footer/img/YT.png"   alt="" /></a>
              </div>
            </li>
          </ul>
        </section>
        <section className={styles.footerBottom}>COPYRIGHT © 2024 &nbsp;LAZYDOG&nbsp;</section>
      </footer>

    </>
  );
}
