import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5000/api/articles';

function useArticles() {
    const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 取得所有文章（列表用）
    const getArticles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('無法取得文章');
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // ✅ 

    // 取得單篇文章（詳情用）
    const getArticle = useCallback(async (id, isActiveRef) => {
        if (!id) {
            // 由於 id 為 null，直接返回，不會觸發加載狀態
            if (isActiveRef.current) { // 僅在有效時重置狀態
            
                setArticle(null);
                setComments([]);
            }
            return null;
        }
        try {
            if (isActiveRef.current) { // 僅在請求有效時設置加載狀態
                setLoading(true);
                setError(null);
            }
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            data.comments.forEach((comment) => {
                comment.author_img = `http://localhost:5000/auth/${comment.author_img}`;
            });
            setArticle(data);
            setComments(data.comments || []);
            return data; // 返回文章資料
        } catch (err) {
            if (isActiveRef.current) {
                setError(err.message);
                setArticle(null);
            }
        }
        return null; // 如果請求無效或出錯，返回 null
    }, []);

    // 新增文章
    const createArticle = useCallback(async (newArticle) => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle),
            });
            if (!response.ok) throw new Error('無法新增文章');
            const createdArticle = await response.json();
            setArticles((prev) => [createdArticle, ...prev]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);
    // 更新文章
    const updateArticle = useCallback(async (id, updatedData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('無法更新文章');

            const updatedArticle = await response.json();
            setArticles((prev) =>
                prev.map((article) => (article.id === id ? updatedArticle : article))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // 刪除文章
    const deleteArticle = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('無法刪除文章');
            setArticles((prev) => prev.filter((article) => article.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // 在元件載入時自動取得文章
    useEffect(() => {
        getArticles();
    }, [getArticles]); // ✅ 依賴 getArticles

    return {
        articles,
        article,
        comments,
        loading,
        error,
        getArticles,
        getArticle,
        createArticle,
        updateArticle,
        deleteArticle,
    };
}

export default useArticles;