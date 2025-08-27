// useSafeData.js
import { useState, useEffect } from "react";

/**
 * 確保數據安全使用，避免 undefined / null 錯誤
 * @param {Object} initialData - 初始數據
 * @param {Function} fetchFunction - 獲取數據的 API 方法
 * @param {Array} dependencies - useEffect 監聽的變數
 * @returns {Object} { data, loading, error, refetch }
 */
export default function useSafeData(initialData, fetchFunction, dependencies = []) {
  // 參數驗證
  if (typeof fetchFunction !== "function") {
    throw new Error("fetchFunction must be a function");
  }

  if (!Array.isArray(dependencies)) {
    console.warn("dependencies must be an array. Defaulting to empty array.");
    dependencies = [];
  }

  // 狀態管理
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取數據的函數
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();

      // 檢查數據是否為 null 或 undefined
      if (result === null || result === undefined) {
        throw new Error("Data is null or undefined");
      }

      setData(result);
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDataSafe = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    fetchDataSafe();

    // 清理函數=
    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}