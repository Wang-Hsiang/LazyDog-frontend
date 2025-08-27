// /app/article/list/detail/page.js

"use client";

import React, { useEffect, useState, useRef } from "react"; 
import { useParams } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Card from "../../_components/detail/MoreCard";
import Comment from "../../_components/detail/Comment";
import Content from "../../_components/detail/Content";
import MyComment from "../../_components/detail/MyComment";
import styles from "./page.module.css";
import useArticles from "@/hooks/useArticle";
import Header from "../../../components/layout/header";
import Breadcrumb from "../../../components/teacher/breadcrumb";
import style from "../../../../styles/modules/operatorCamera.module.css";

export default function ArticleDetail() {
  const { id } = useParams(); // 取得網址中的文章 ID
  const { articles, article, comments, getArticle, loading, error } = useArticles();

  const [Comments, setComments] = useState(3); // 控制顯示留言數量
  const [expanded, setExpanded] = useState(false); // 記錄展開狀態

  // 創建 useRef 來追蹤組件的掛載狀態和請求的有效性
  const isActiveRef = useRef(true);

  // 修改 useEffect 來處理競態條件和組件卸載問題
  useEffect(() => {
    // 當 useEffect 運行時，確保旗標為 true
    isActiveRef.current = true;

    if (id) {
      // ⚠️ 將 isActiveRef 傳遞給 getArticle
      getArticle(id, isActiveRef);
    }

    // 清理函數：在組件卸載或依賴項 (id) 改變時執行
    return () => {
      isActiveRef.current = false; // 將旗標設置為 false，指示正在進行的請求結果應被忽略
    };
  }, [id, getArticle]); // 依賴 id 和 getArticle (getArticle 由於 useCallback 而穩定)


  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤: {error}</p>;
  if (!article) return <p>文章不存在</p>;

  const AllComments = () => {
    if (expanded) {
      setComments(3);
    } else {
      setComments(comments.length);
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <Header />
      <div className={`container ${style.container}`} style={{ marginTop: "100px" }}>
        {/* 文章內容 */}
        <div className="w-100 d-flex justify-content-center">
          <div style={{ width: "1024px" }}>
            <div className="mb-5">
              <Breadcrumb
                links={[
                  { label: "首頁 ", href: "/" },
                  { label: "毛孩文章", href: "/article/list" },
                  {
                    label: ` ${article?.title || "標題尚未加載"}`,
                    href: "/article/list/detail",
                    active: true,
                  },
                ]}
              />
            </div>
            <Content article={article} />

            {/* 留言區 */}
            <div
              className="chat"
              style={{
                background: "#FDFAF5",
                padding: "15px",
                marginTop: "80px",
                marginBottom: "80px",
                borderRadius: "20px",
                border: "none ",
                boxShadow: "0px 10px 14px rgba(0, 0, 0, 0.25)",
              }}
            >
              <h3 className="mt-3 ms-3">留言</h3>
              <ul className="list-unstyled">
                {comments.length === 0 ? (
                  <p className="mt-3 ms-3">暫無評論，快來發表你的看法吧！</p>
                ) : (
                  comments.slice(0, Comments).map((comment, index) => (
                    <Comment
                      key={index} 
                      content={comment.content}
                      author={comment.author}
                      author_img={comment.author_img}
                      id={comment.id}
                    />
                  ))
                )}
                <MyComment />
              </ul>

              {/* 如果留言數大於 3，顯示展開/收起按鈕 */}
              <div
                className="w-100 d-flex justify-content-end"
                style={{position:'relative',padding:'25px 0'}}
              >
                {comments.length > 3 && (
                  <button
                    onClick={AllComments}
                    className={styles.moreComments}
                  >
                    {expanded ? "收起留言" : "顯示更多"}
                  </button>
                )}
              </div>
            </div>

            {/* 延伸閱讀 */}
            <div className="more-read">
              <h3 className="mt-5 mb-4">延伸閱讀</h3>
              <div className="row">
                {articles
                  .sort(() => Math.random() - 0.5) // 亂數排序
                  .slice(0, 4) // 取前四篇
                  .map((article) => (
                    <Card key={article.id} {...article} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}