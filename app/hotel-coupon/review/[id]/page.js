"use client";
import React, { useEffect, useState, useRef } from "react";
import { useHotelReview } from "@/hooks/useHotelReview";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/layout/header";
import My from "../../../components/hotel/my";
import styles from "../../../../styles/modules/operatorCamera.module.css";
import Swal from "sweetalert2";
const ReviewList = () => {
  const { user } = useAuth();
  const [modalData, setModalData] = useState({});
  const replyInputRef = useRef(null);
  const router = useRouter();
  const [reviews, setReviews] = useState([]);

  const { id } = useParams();
  const { review } = useHotelReview();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    if (!review) return;
    const formattedReviews = review.map((item) => ({
      customer: item.user_name,
      order: item.id,
      date: formatDate(item.created_at),
      rating: item.rating,
      content: item.comment,
      replied: !!item.reply,
      reply: item.reply || "",
      status: "公開",
    }));

    setReviews(formattedReviews);
  }, [review]);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };
  const loadReview = (review) => {
    setModalData(review);
  };

  const replyReview = async () => {
    if (!user) {
      Swal.fire("請先登入", "請先登入再回覆評論", "warning");
      return;
    }

    const replyContent = replyInputRef.current.value.trim();
    if (!replyContent) {
      Swal.fire("請輸入內容", "請先填寫回覆內容", "error");
      return;
    }

    try {
      const token = localStorage.getItem("loginWithToken");
      if (!token) throw new Error("未登入，請重新登入");

      const response = await fetch(
        `http://localhost:5000/api/hotel_review/${modalData.order}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operator_id: user.id,
            reply: replyContent,
          }),
        }
      );

      if (!response.ok) throw new Error("回覆失敗");

      setModalData((prev) => ({
        ...prev,
        reply: replyContent,
      }));

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.order == modalData.order
            ? { ...r, reply: replyContent, replied: true }
            : r
        )
      );

      replyInputRef.current.value = "";
      Swal.fire("回覆成功", "您的回覆已成功送出！", "success");
    } catch (error) {
      Swal.fire("回覆失敗", "請稍後再試", "error");
      console.error("回覆評論錯誤:", error);
    }
  };

  return (
    <>
      <Header />
      <div className={`container ${styles.wrapper}`}>
        <div className="row">
          <My />
          <div className={`col-md-9 ${styles.righttop}`}>
            <h5 className="mb-4">評論列表</h5>
            <div className="table-responsive">
              <table className="table suTable table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="reviewTd1" style={{ width: "12%" }}>顧客名稱</th>
                    <th className="reviewTd2" style={{ width: "10%" }}>訂單編號</th>
                    <th className="reviewTd3" style={{ width: "12%" }}>評論日期</th>
                    <th className="reviewTd4" style={{ width: "8%" }}>評分</th>
                    <th className="reviewTd5" style={{ width: "30%" }}>評論內容</th>
                    <th className="reviewTd6" style={{ width: "10%" }}>是否回覆</th>
                    <th className="reviewTd7" style={{ width: "8%" }}>狀態</th>
                    <th className="reviewTd8" style={{ width: "10%" }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index}>
                      <td data-label="顧客名稱">{review.customer}</td>
                      <td data-label="訂單編號">{review.order}</td>
                      <td data-label="評論日期">{review.date}</td>
                      <td data-label="評分">{review.rating}</td>
                      <td data-label="評論內容">
                        {review.content.length > 10 ? (
                          <>
                            {review.content.substring(0, 10)}...
                            <button
                              className={`btn btn-sm  px-2 ${styles.moreBtn}`}
                              onClick={() => loadReview(review)}
                              data-bs-toggle="modal"
                              data-bs-target="#reviewModal"
                            >
                              更多
                            </button>
                          </>
                        ) : (
                          review.content
                        )}
                      </td>
                      <td data-label="是否回覆">
                        {review.replied ? "已回覆" : "未回覆"}
                      </td>
                      <td data-label="狀態">
                        <span
                          className={`badge ${
                            review.status === "公開" ? styles.btn3 : styles.btn
                          }`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td data-label="操作">
                        <button
                          className={`btn btn-sm ${styles.btn} w-100`}
                          data-bs-toggle="modal"
                          data-bs-target="#reviewModal"
                          onClick={() => loadReview(review)}
                        >
                          檢視 / 回覆
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="reviewModal"
          tabIndex="-1"
          aria-labelledby="reviewModalLabel"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="reviewModalLabel">
                  評論詳細資訊
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>顧客名稱：</strong> {modalData.customer || "N/A"}
                </p>
                <p>
                  <strong>訂單編號：</strong> {modalData.order || "N/A"}
                </p>
                <p>
                  <strong>評論日期：</strong> {modalData.date || "N/A"}
                </p>
                <p>
                  <strong>評分：</strong> {modalData.rating || "N/A"}
                </p>
                <p>
                  <strong>評論內容：</strong>
                </p>
                <p className="border p-2">{modalData.content || "N/A"}</p>
                <label className="form-label mt-3">回覆：</label>
                <textarea
                  ref={replyInputRef}
                  className="form-control"
                  rows="3"
                  placeholder={modalData.reply || "請輸入回覆內容..."}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles.btn2}`}
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button"
                  className={`btn ${styles.btn}`}
                  onClick={replyReview}
                >
                  送出回覆
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewList;
