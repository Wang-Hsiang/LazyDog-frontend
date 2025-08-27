import { useState, useEffect } from "react";

export function useCourseRandom() {
  // 新增用來獲取隨機課程資料的 API 請求
  
    const [courses, setCourses] = useState([]);
useEffect(() => {
  const fetchCourses = async () => {
    let API = "http://localhost:5000/teachers/courseRandom";
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Fetch courses failed");

      const result = await res.json();
      console.log("Fetched courses:", result);

      if (!Array.isArray(result)) throw new Error(result.message);

      setCourses(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  fetchCourses();
}, []);
  return { courses };
}
