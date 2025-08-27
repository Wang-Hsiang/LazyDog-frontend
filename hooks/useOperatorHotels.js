import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useOperatorHotels() {
    const { user, loading: authLoading } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchOperatorHotels = async () => {
            const token = localStorage.getItem("loginWithToken");
            if (!token) {
                console.error(" Token 不存在，請重新登入");
                return;
            }
        
            try {
                const res = await fetch("http://localhost:5000/api/hotels/operator", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
        
                if (!res.ok) {
                    throw new Error(` 錯誤碼: ${res.status}`);
                }
        
                const result = await res.json();
                console.log(" 取得負責人飯店資料:", result);
                setHotels(result.data); // 確保取到 `data`
            } catch (err) {
                console.error(" 取得旅館失敗:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        

        fetchOperatorHotels();
    }, [user, authLoading]);

    return { hotels, loading, error };
}
