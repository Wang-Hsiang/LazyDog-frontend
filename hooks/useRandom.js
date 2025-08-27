import { useState, useEffect } from "react";

export function useRandom() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      let API = "http://localhost:5000/teachers/random";
      try {
        const res = await fetch(API);

        if (!res.ok) throw new Error("feach teacher err"); // 檢查回應是否成功

        const result = await res.json();
        console.log("Fetched teachers:", result);

        if (!Array.isArray(result)) throw new Error(result.message);

        setTeachers(result);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchTeachers();
  }, []);


  return { teachers }; 
}
