import { useState, useEffect } from "react";

export function useFavorites(id) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchFavorites = async () => {
      let API = `http://localhost:5000/favorite/${id}`;
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("無法獲取收藏列表");

        const result = await res.json();
        setFavorites(result);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchFavorites();
  }, [id]);

  const favorite = async (teacherId) => {
    let API = `http://localhost:5000/favorite`;
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, teacherId }),
      });

      if (!res.ok) throw new Error("更新收藏失敗");

      const updateFavorite = await res.json();
      setFavorites(updateFavorite);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { favorites, favorite };
}
