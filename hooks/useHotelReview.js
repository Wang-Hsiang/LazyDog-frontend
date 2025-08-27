import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useHotelReview() { 
  const { user, loading: authLoading } = useAuth(); 
  const [review, setReview] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return; // 確保已載入 user 身分

    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("loginWithToken");
        if (!token) throw new Error("未登入，請重新登入");

        //  直接請求不帶 hotel_id，讓後端自動查 `operator_id` 擁有的飯店
        const res = await fetch(`http://localhost:5000/api/hotel_review`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("無法取得評論");

        const result = await res.json();
        console.log("Fetched Reviews:", result);

        if (result?.data && Array.isArray(result.data)) {
          setReview(result.data);
        } else {
          throw new Error("資料格式錯誤，找不到 data");
        }
      } catch (err) {
        setError(err.message);
        console.error("獲取評論失敗:", err.message);
      }
    };

    fetchReviews();
  }, [user, authLoading]);

  return { review, error };
}
