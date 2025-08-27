"use client";

import React, { useState, useEffect } from "react";
import styles from "../css/orderlist.module.css";
// import Pagination from "@/app/course/_components/list/page";

export default function Orderlist() {
  const [activeTab, setActiveTab] = useState("course"); // 預設顯示課程訂單
  return (
    <>
      <div className={`col-md-9`}>
        <div
          className={`border rounded p-5 ${styles.right}  ${styles.scrollOrg}`}
        >
          <h3 className={`mb-5 ${styles.tTitle}`}>購買清單</h3>
          {/* Tabs 分頁導覽 */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "product" ? "active" : ""
                }`}
                onClick={() => setActiveTab("product")}
              >
                產品
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "hotel" ? "active" : ""}`}
                onClick={() => setActiveTab("hotel")}
              >
                旅館
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "course" ? "active" : ""}`}
                onClick={() => setActiveTab("course")}
              >
                課程
              </button>
            </li>
          </ul>

          {/* 內容區塊 */}
          <div className="mt-4">
            {activeTab === "course" && <CourseOrderList />}
            {activeTab === "product" && <ProductOrderList />}
            {activeTab === "hotel" && <HotelOrderList />}
          </div>
        </div>
      </div>
    </>
  );
}

// 課程訂單元件
function CourseOrderList() {
  return (
    <div>
      <h5 className={`mb-5 ${styles.tTitle}`}>第 1 種 設計</h5>
      <div className={`mb-4 ${styles.orderCard1}`}>
        <div className={`row`}>
          <div className={`col-12 bg-dark-subtle mb-3  ${styles.orderNum}`}>
            訂單編號 : <span>20250303015646853</span>
          </div>
          <div className={`col-12 px-5 py-2`}>
            訂單建立 : <span>2025/03/07/ 15:00</span>
          </div>
          <div className={`col-12 px-5 py-2`}>
            訂單金額 : <span>$ 3,850</span>
          </div>
          <div className={`col-12 px-5 py-2`}>
            付款方式 : <span>信用卡一次付清</span>
          </div>
          <div className={`col-12 px-5 py-2`}>
            優惠使用 : <span>66大順好康優惠券</span>
          </div>
          {/* 收合 bootstrap - Accordion */}
          <div className="accordion accordion-flush p-0" id="accordionFlushExample">
            {/* 訂單詳情 */}
            <div className="accordion-item border border-0">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed px-5 py-3 "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  訂單詳情
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body mb-3">
                  {/* 欄位 */}
                  <div className={`row border-bottom border-warning pb-1`}>
                    <div className="col-3  text-center"></div>
                    <div className="col-4  text-center">課程名稱</div>

                    <div className="col-2 text-center">數量</div>
                    <div className="col-3 text-center">單價</div>
                  </div>
                  {/* map 每一列資料 */}
                  <div className={`row py-3`}>
                    <div className="col-3 text-center">
                      <img
                        src="/course/img/1 (1).jpeg"
                        style={{ height: 100 }}
                      ></img>
                    </div>
                    <div className="col-4 align-self-center text-center">
                      一對一寵物美容教學實作
                    </div>

                    <div className="col-2 align-self-center text-center">
                      x 1
                    </div>
                    <div className="col-3 align-self-center text-center">
                      1,000
                    </div>
                  </div>
                  <div className={`row py-3`}>
                    <div className="col-3 text-center">
                      <img
                        src="/course/img/1 (1).jpeg"
                        style={{ height: 100 }}
                      ></img>
                    </div>
                    <div className="col-4 align-self-center text-center">
                      一對一寵物美容教學實作
                    </div>

                    <div className="col-2 align-self-center text-center">
                      x 1
                    </div>
                    <div className="col-3 align-self-center text-center">
                      1,000
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 評價 */}
            <div className="accordion-item ">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed px-5 py-3 "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  評價
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body p-5">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    rows={6}
                    // style="height: 100px"
                  ></textarea>
                  <div className="d-grid gap-2 col-2 mx-auto mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      送出
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 產品訂單元件
function ProductOrderList() {
  return (
    <div>
      <h5 className={`mb-5 ${styles.tTitle}`}>第 1 種 設計</h5>
      <div className={`mb-3 ${styles.orderCard}`}>
        <div className={`row rounded border border-dark-subtle`}>
          <div className={`col-12 bg-dark-subtle p-3 mb-3 `}>
            訂單編號 : <span>20250303015646853</span>
          </div>
          <div className={`col-12 px-4 py-2`}>
            訂單建立 : <span>2025/03/07/ 15:00</span>
          </div>
          <div className={`col-12 px-4 py-2`}>
            訂單金額 : <span>$ 3,850</span>
          </div>
          <div className={`col-12 px-4 py-2`}>
            付款方式 : <span>信用卡一次付清</span>
          </div>
          <div className={`col-12 px-4 py-2`}>
            優惠使用 : <span>66大順好康優惠券</span>
          </div>
          <div className={`col-12 px-4 py-2`}>訂單詳情 :</div>

          {/* 欄位 */}
          <div className={`row border-bottom border-warning mx-2 pb-1`}>
            <div className="col-3  text-center"></div>
            <div className="col-4  text-center">課程名稱</div>

            <div className="col-2 text-center">數量</div>
            <div className="col-3 text-center">單價</div>
          </div>
          {/* map 每一列資料 */}
          <div className={`row py-3`}>
            <div className="col-3 text-center">
              <img src="/course/img/1 (1).jpeg" style={{ height: 100 }}></img>
            </div>
            <div className="col-4 align-self-center text-center">
              一對一寵物美容教學實作
            </div>

            <div className="col-2 align-self-center text-center">x 1</div>
            <div className="col-3 align-self-center text-center">1,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 旅館訂單元件
function HotelOrderList() {
  return (
    <div>
      <h5 className="mb-4">🏨 旅館訂單</h5>
      <p>這裡顯示旅館訂單的內容...</p>
    </div>
  );
}
