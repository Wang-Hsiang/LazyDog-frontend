"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Card from "../../_components/detail/MoreCard";
import Comment from "../../_components/detail/Comment";
import Content from "../../_components/detail/Content";
import styles from "./page.module.css";
import useArticles from "@/hooks/useArticle";
import Header from "../../../components/layout/header";
import Breadcrumb from "../../../components/teacher/breadcrumb";
import style from "../../../../styles/modules/operatorCamera.module.css";

export default function ArticleDetail() {
  const { id } = useParams(); // 取得網址中的文章 ID
  const searchParams = useSearchParams();
  const isFromList = searchParams.get("list"); // 解析 Query String
  const { article, getArticle, loading, error, } = useArticles()


  const isActiveRef = useRef(true);
  // **當 ID 變更時，載入對應的文章**
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
   }, [id, getArticle]);

  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤: {error}</p>;
  if (!article) return <p>文章不存在</p>;



  return (
    <>
      <Header />
      <div className={`container ${style.container}`} style={{ marginTop: '90px' }}>
        <div className="w-100 d-flex justify-content-center">

          <div
            style={{ width: '1024px' }}
          >
            <div className="mb-5">
              <Breadcrumb
                links={[
                  { label: "首頁 ", href: "/" },
                  { label: " 我的文章", href: "/user/my_article" },
                  { label: ` ${article?.title || "標題尚未加載"}`, href: "/article/list/detail", active: true },
                ]}
              />
            </div>
            {/* 文章內容 */}
            <Content article={article} /> {/* 傳遞文章資料給 Content 組件 */}
          </div>
        </div>
      </div>
    </>
  );
}