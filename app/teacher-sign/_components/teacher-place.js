"use client";

import React, { useState, useEffect } from "react";
import styles from "../css/teacherSignPlace.module.css";
import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";
export default function TeacherPlace() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/createGet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPlaces(data.data.places);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // 點擊地點時的處理函式
  const handlePlaceClick = (p, index) => {
    if (index < 3) {
      // 第一～第三筆資料連結到 Google Maps
      const googleMapsUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(
        p.address
      )}`;
      window.open(googleMapsUrl, "_blank");
    } else if (index < 5) {
      // 第四～第五筆資料彈出 Swal 對話框
      Swal.fire({
        html: `
          <p>
            <a href="https://reurl.cc/XRdR6j" target="_blank" style="color: blue; text-decoration: underline;">
              <strong>ZOOM下載使用教學參考</strong>
            </a>
          </p>
          <p>
            <a href="https://reurl.cc/nv9vz8" target="_blank" style="color: blue; text-decoration: underline;">
              <strong>直播觀看教學方式說明</strong>
            </a>
          </p>
          
        `,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <div className={`col-md-9 col-12`}>
        <div className={`border rounded p-5 ${styles.right}`}>
          <h4 className={`mb-4 ${styles.tTitle}`}>開課地點</h4>
          <div className={`${styles.cTable} ${styles.bottom}`}>
            {/* 第一～第三筆資料 */}
            {places.slice(0, 3).map((p, index) => (
              <div key={p.id} className={`row ${styles.cTbody}`}>
                <div className={`col-5 col-md-1 ${styles.cTd1}`}>
                  {p.region}
                </div>
                <div
                  className={`col-7 col-md-9 ${styles.cTd2}`}
                  onClick={() => handlePlaceClick(p, index)}
                >
                  <i className="bi bi-geo-alt-fill"></i> {p.address}
                </div>
              </div>
            ))}

            {/* 第四～第五筆資料 */}
            {places.slice(3, 5).map((p, index) => (
              <div key={p.id} className={`row ${styles.cTbody}`}>
                <div className={`col-5 col-md-1 ${styles.cTd1}`}>
                  {p.region}
                </div>
                <div
                  className={`col-7 col-md-9 ${styles.cTd2}`}
                  onClick={() => handlePlaceClick(p, index + 3)}
                >
                  <i className="bi bi-info-circle-fill"></i> {p.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
