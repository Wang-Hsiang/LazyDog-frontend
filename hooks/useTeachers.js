import { useState, useEffect } from "react";

export function useTeachers() {

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTeachers = async () => {
      let API = "http://localhost:5000/teachers/list";
      try {
        const res = await fetch(API);
        
        if (!res.ok) throw new Error("feach teacher err"); // 檢查回應是否成功

        const result = await res.json(); 
        console.log("Fetched teachers:", result);

       if (!Array.isArray(result)) throw new Error(result.message); 

        setTeachers(result); 

      } catch (err) {
        console.log(err.message);
      }finally {
        setLoading(false);
    }
    };

    fetchTeachers();
  }, []); 
useEffect(() => {

}, [teachers]);
  return { teachers, loading  }; // 返回 teachers 資料
}
