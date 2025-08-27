import { useState, useEffect } from "react";

export function useTeacherDetail (id) {
    const [teacher, setTeacher] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // console.log("useEffect 觸發，id:", id);
        //  if (!id) {
        //    setTeacher(null);
        //    return;
        //  } 

        const fetchTeacher = async () => {
             let API = `http://localhost:5000/teachers/info/${id}`;
            try {
                const res = await fetch(API);
               if (!res.ok) {
                 throw new Error("無法取得資料");
               }
               const result = await res.json();
                console.log("Fetched teachers:", result);
               setTeacher(result); 
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [id]);

    return { teacher, loading } ;
};