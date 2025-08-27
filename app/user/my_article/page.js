"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import useMyArticles from "@/hooks/useMyArticles"; // ✅ 改用新 Hook
import MyCard2 from "@/app/article/_components/my_article/article_card2";
import Link from "next/link";
import {
  ScrollMotionContainer,
  ScrollMotionItem,
} from "@/app/article/ListMotion";
import styles from "./page.module.css";

export default function MyArticle() {
  const { user } = useAuth();
  const userId = user?.id;
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { articles } = useMyArticles(userId); // ✅ 只載入該用戶的文章

  useEffect(() => {
    if (articles === -1 ||articles.length > 0) {
      setCheckingAuth(false);
    }
  }, [articles]);

  // **顯示 loading 畫面**
  if (checkingAuth) {
    return (
      <div className={styles.container2}>
        <div className={styles.loader27}></div>
      </div>
    );
  }

  return (
    <div className="col-12 col-md-9">
      <div className="w-100">
        <div>
          {/* 標題 + 按鈕 */}
          <div className="d-flex justify-content-between my-2">
            <h4>我的文章</h4>
            <button className={styles.post}>
              <Link href="/article/add_article" className={styles.postLink}>
                <i className="bi bi-check-circle"></i> 發布文章
              </Link>
            </button>
          </div>

          {/* 選單 */}
          <ul className="nav nav-tabs mt-4">
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                href="#"
                style={{ color: "white", backgroundColor: "#f5842b" }}
              >
                文章
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/user/my_comment"
                style={{ color: "#f5842b", backgroundColor: "white" }}
              >
                留言
              </Link>
            </li>
          </ul>

          
          {articles === -1 ? (
            <div className={styles.container2}>
              <div>您還未發表過文章</div>
            </div>
          ) : (
            // 否則顯示文章列表
            <ScrollMotionContainer
              style={{
                borderRadius: "5px",
                height: "750px",
                overflowY: "scroll",
              }}
            >
              {articles.map((article) => (
                <ScrollMotionItem type="up" key={article.id}>
                  <MyCard2
                    id={article.id}
                    title={article.title}
                    cover_image={article.cover_image || "/images/default-cover.jpg"}
                    created_at={new Date(article.created_at).toLocaleDateString()}
                  />
                </ScrollMotionItem>
              ))}
            </ScrollMotionContainer>
          )}
        </div>
      </div>
    </div>
  );
}
