"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import useComment from "@/hooks/useComment";
import MyCard3 from "@/app/article/_components/my_article/article_card3";
import Link from "next/link";
import {
  ScrollMotionContainer,
  ScrollMotionItem,
} from "@/app/article/ListMotion";
import styles from "./page.module.css";

export default function MyArticle() {
  const { user } = useAuth();
  const userid = user?.id;
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { comments, getComments, loading } = useComment(userid);
  const [commentData, setCommentData] = useState([]); // 初始化為空陣列
  
  console.log(commentData)

  const trueUrl = (imagePath) => {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `http://localhost:5000/auth/${imagePath}`;
  };

  useEffect(() => {
    if (userid) {
      getComments(userid)
        .then((result) => {
          if (result === -1) {
            setCommentData([]); // 如果是 -1，設置為空陣列
          } else {
            setCommentData(result); // 設置留言資料
          }
          setCheckingAuth(false);
        })
        .catch((err) => {
          console.error("獲取留言失敗:", err);
          setCommentData([]); // 發生錯誤時也設置為空陣列
          setCheckingAuth(false);
        });
    }
  }, [userid]);

  if (checkingAuth || loading) {
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
          <div className="d-flex justify-content-between my-2">
            <h4>我的文章</h4>
            <button className={styles.post}>
              <Link href="/article/add_article" className={styles.postLink}>
                <i className="bi bi-check-circle"></i> 發布文章
              </Link>
            </button>
          </div>

          <ul className="nav nav-tabs mt-4">
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/user/my_article"
                style={{ color: "#f5842b" }}
              >
                文章
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                href=""
                style={{ color: "white", backgroundColor: "#f5842b" }}
              >
                留言
              </Link>
            </li>
          </ul>

          {commentData.length === 0 ? (
            <div className={styles.container2}>
              <div>您還未發表過留言</div>
            </div>
          ) : (
            <ScrollMotionContainer
              style={{
                borderRadius: "5px",
                height: "750px",
                overflowY: "scroll",
              }}
            >
              {commentData.map((comment) => (
                <ScrollMotionItem className={styles.card} key={comment.id} type="up">
                  <MyCard3
                    key={comment.id}
                    article_id={comment.article_id}
                    author={user.name}
                    title={comment.title}
                    content={comment.content}
                    author_image={trueUrl(comment.user_img || "/images/default-cover.jpg")}
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
