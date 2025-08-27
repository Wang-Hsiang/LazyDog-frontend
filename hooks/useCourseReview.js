import { useState, useEffect } from "react";

export function useReview(id) {
  const [review, setReview] = useState([]);
  useEffect(() => {
    const fetchReview = async () => {
      const token = localStorage.getItem("token");
      let API = `http://localhost:5000/api/course_reviews/${id}`;
      try {
        const res = await fetch(API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
          },
        });
        if (!res.ok) {
          throw new Error("無法取得資料");
        }
        const result = await res.json();
        console.log("Fetched :", result);
        if (result?.data?.data && Array.isArray(result.data.data)) {
          setReview(result.data.data);
        } else {
          throw new Error("資料格式錯誤，找不到 data.data");
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchReview();
  }, [id]);

  return { review };
}

async function replyReviewAPI(reviewId, replyContent) {
  const API = `http://localhost:5000/api/course_reviews/reply`;

  console.log("發送到後端的資料：", { reviewId, replyContent });

  const response = await fetch(API, {
    method: "PUT", // 假設是 PUT 方法來更新回覆
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
    },
    body: JSON.stringify({ reviewId, reply: replyContent }),
  });

  if (!response.ok) {
    throw new Error("回覆提交失敗");
  }

  const result = await response.json();
  return result;
}

export { replyReviewAPI };
