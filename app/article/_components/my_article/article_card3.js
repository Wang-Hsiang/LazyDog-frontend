"use client";

import useArticle from "@/hooks/useArticle"; // 確保導入正確的 Hook
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import styles from "../my_article/page.module.css";
import Link from "next/link";

export default function MyCard3({ title, content, article_id, author }) {
    const { user } = useAuth();
    // console.log(user)
    return (
        <>
            <Link
                href={{ pathname: `/article/detail/${article_id}`, query: { list: "true" } }}
                className={`card mb-3 ${styles.commentCard}`}
            >
                <div
                    className={`row g-0 ${styles.author}`}
                >
                    <div
                        className="col-md-1 "
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '10px', height: '100%' }}
                    >
                        <div
                            style={{ width: '80px' }}
                        >
                            <div
                                className="avatar ratio ratio-1x1 rounded-circle overflow-hidden"
                            >
                                <img className="object-fit-cover" 
                                src={user.avatar} 

                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <div>{author}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-md-11 "
                        style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div
                                    className={`${styles.link}`}
                                >
                                    {content}
                                </div>
                            </div>
                            <p
                                className="card-text mt-3"
                                style={{ maxHeight: '30px', overflow: 'hidden' }}
                            >
                                <small className="text-muted">文章標題 : {title}
                                </small></p>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};
