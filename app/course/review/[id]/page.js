"use client";
import React, { useEffect, useState, useRef } from "react";
// import styles from "../../../styles/modules/operatorCamera.module.css";
import { useReview, replyReviewAPI } from "@/hooks/useCourseReview";
import { useAuth, user } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/app/components/layout/header";
import My from "@/app/teacher-sign/_components/my";
import styles from "@/styles/modules/courseReview.module.css";

const ReviewList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const replyInputRef = useRef(null);
  const router = useRouter();
  const { id } = useParams();
  const { review } = useReview(id);
  const { user } = useAuth();
  // console.log(user.teacher_id);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const reviews = review.map((item) => ({
    customer: `${item.user_name}`,
    order: `${item.id}`,
    date: `${item.created_at}`,
    rating: `${item.rating}`,
    content: `${item.comment}`,
    courseName: `${item.course_name}`,
    reply: item.reply ?? "",
    // replied: true,
    status: "公開",
  }));
  const loadReview = (review) => {
    console.log("送去Modal:", review);
    setModalData(review);
  };

  const hanleReplyReview = async () => {
    const replyContent = replyInputRef.current.value.trim();

    if (replyContent) {
      const { order: reviewId } = modalData;
      console.log("送出的資料：", { reviewId, replyContent });

      try {
        const teacherId = user.teacher_id;
        const data = await replyReviewAPI(reviewId, replyContent);
        Swal.fire({
          icon: "success",
          title: "回覆成功",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: styles.tsaiSwal },
        });
        router.refresh();
        // replyInputRef.current.value = ""; // 清空回覆框
      } catch (err) {
        Swal.fire({
          title: "回覆失敗",
          text: err.message || "回覆時發生錯誤，請稍後再試。",
          icon: "error",
          timer: 2500,
          customClass: { popup: styles.tsaiSwal },
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "請先填寫回覆內容",
        showConfirmButton: false,
        timer: 1000,
        customClass: { popup: styles.tsaiSwal },
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container lumi-all-wrapper">
        <div className="row">
          {/* 左邊*/}
          <My />
          {/* <div className={`${styles.right}`}></div> */}
          {/* 右邊 */}
          <div className={`col-md-9 ${styles.righttop}`}>
            <h4 className="mb-4">評論列表</h4>
            <div className="table-responsive">
              <table className="table suTable table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th className={styles.thTsai1}>訂單編號</th>
                    <th className={styles.thTsai}>學員</th>
                    <th className={styles.thTsai1}>評論日期</th>
                    <th className={styles.thTsai}>評分</th>
                    <th className={styles.thTsai1}>內容</th>
                    <th className={styles.thTsai}>是否回覆</th>
                    {/* <th className={styles.thTsai}>狀態</th> */}
                    <th className={styles.thTsai}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index}>
                      <td className={styles.tdTsai1}>{review?.order}</td>
                      <td className={`text-nowrap ${styles.tdTsai}`}>
                        {review?.customer}
                      </td>
                      <td className={styles.tdTsai1}>
                        {review?.date
                          ? new Date(review?.date).toLocaleDateString("zh-TW", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : ""}
                      </td>
                      <td className={styles.tdTsai}>
                        <img
                          className={styles.starRate}
                          src="/product/font/star-fill.png"
                        />
                        {review?.rating}
                      </td>
                      <td className={styles.tdTsai1}>{review?.content}</td>
                      <td className={styles.tdTsai}>
                        {review.reply !== null &&
                        review.reply !== undefined &&
                        review.reply.trim() !== ""
                          ? "已回覆"
                          : "未回覆"}
                      </td>

                      {/* <td className={`text-nowrap ${styles.tdTsai}`}>
                        <span
                          className={`badge ${
                            review.status === "公開"
                              ? [styles.btn3]
                              : [styles.btn]
                          }`}
                        >
                          {review.status}
                        </span>
                      </td> */}
                      <td className={`text-nowrap ${styles.tdTsai}`}>
                        <button
                          className={`btn ${styles.btn}`}
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
          className={`modal fade ${modalOpen ? "show" : ""}`}
          id="reviewModal"
          tabIndex="-1"
          aria-labelledby="reviewModalLabel"
          aria-hidden="true"
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
                  <strong>訂購課程：</strong> {modalData.courseName || "N/A"}
                </p>
                <p>
                  <strong>評論日期：</strong>{" "}
                  {modalData.date
                    ? new Date(modalData?.date).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </p>
                {/* <p>
                  <strong>評分：</strong> {modalData.rating || "N/A"}
                </p> */}
                <p>
                  <strong>評論內容：</strong>
                </p>
                <p className="border p-2">{modalData.content || "N/A"}</p>
                <label className="form-label mt-3">
                  <strong>回覆：</strong>{" "}
                </label>
                <textarea
                  value={modalData.reply || ""}
                  ref={replyInputRef}
                  className="form-control"
                  rows="3"
                  placeholder={
                    // review.reply ? review.reply : "請輸入回覆內容..."
                    modalData.reply ? "" : "請輸入回覆內容..."
                  }
                  onChange={(e) =>
                    setModalData({ ...modalData, reply: e.target.value })
                  }
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
                  className={`btn ${styles.btn4}`}
                  onClick={hanleReplyReview}
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
