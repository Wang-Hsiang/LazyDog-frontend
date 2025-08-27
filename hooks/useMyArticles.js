import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api/articles";

export default function useMyArticles(userId) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 取得該用戶的文章
  const getMyArticles = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/author/${userId}`);
      if (!response.ok) {
        setArticles(-1); 
        setError("無法獲取作者的文章");
        return;
      }

      const data = await response.json();
      setArticles(data);
      console.log(data);
    } catch (err) {
      setArticles(-1);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 頁面載入時執行
  useEffect(() => {
    getMyArticles();
  }, [getMyArticles]);

  return { articles, loading, error };
}
