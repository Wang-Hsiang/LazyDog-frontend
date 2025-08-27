import { useEffect, useState } from "react";

export function useFetch(url, options) {
  // fetch後得到的資料
  const [data, setData] = useState(null);
  // 載入指示開關
  const [loading, setLoading] = useState(true);
  // 錯誤物件
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [url, options]);

  return { data, loading, error };
}
