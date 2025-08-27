"use client";
import React, { useEffect, useRef } from "react";
import ListStyles from "../../../styles/modules/operatorHotel.module.css";
import styles from "../../../styles/modules/operatorCamera.module.css";
import { useRouter } from "next/navigation";
import My from "../../components/hotel/my"
import Header from "../../components/layout/header";
export default function PagesHotelList() {
  const router = useRouter();
  
  const changepage = (path) => {
    if (path) {
      router.push(`/hotel-coupon/${path}`);
    }
  };
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* 左邊*/}
          <My />

          {/* 右邊 */}
          <div className="col-12 col-md-9">
            <h3 className="mb-4">旅館名稱</h3>
            <table className={`table ${ListStyles.hotelTable}`}>
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>所在地</th>
                  <th>剩餘房數</th>
                  <th>價格範圍</th>
                  <th>評分</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="d-flex align-items-center gap-2">
                    <img
                      src="/hotel/hotel-uploads/30-outside.png"
                      className={`${ListStyles.hotelImg} rounded`}
                      alt="寵物之星"
                    />
                    <span className="ms-3">寵物之星</span>
                  </td>

                  <td>台北</td>
                  <td>5 間</td>
                  <td>$1500 - $5000</td>
                  <td className="text-warning">4.8 ⭐</td>
                  <td>
                    <span className="badge bg-success">營業中</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => changepage("hotel")}
                    >
                      檢視
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => changepage("hotelEdit")}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${ListStyles.btnOrange}`}
                      id="deleteBtn"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="d-flex align-items-center gap-2">
                    <img
                      src="/hotel/hotel-uploads/10-outside.png"
                      className={`${ListStyles.hotelImg} rounded`}
                      alt="象山寵物旅館"
                    />
                    <span className="ms-3">象山寵物</span>
                  </td>
                  <td>新北</td>
                  <td>2 間</td>
                  <td>$1200 - $4000</td>
                  <td className="text-warning">4.5 ⭐</td>
                  <td>
                    <span className="badge bg-danger">已關閉</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => changepage("hotel")}
                    >
                      檢視
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => changepage("hotelEdit")}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${ListStyles.suBtnDanger}`}
                      id="deleteBtn"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-end mt-3">
              <button
                className={ListStyles.suBtnAdd}
                onClick={() => changepage("hotelCreate")}
              >
                + 新增旅館
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
