"use client";

import React, { useState, useEffect } from "react";
import styles from "./aside.module.css";
import Link from "next/link";

export default function FilterLinkGroup({ category = {}, name = "" }) {
  const [showMore, setShowMore] = useState(false);
  const categorys = category;
  const categoryClass = [];
  if (categorys) {
    categorys.map((v, i) => {
      if (!categoryClass.includes(v.class)) categoryClass.push(v.class);
    });
  }
  return (
    <>
      <div className={styles.FilterGroup}>
        <Link
          href={`/product/list/category?category=${name}`}
          className={styles.FilterLinkTitle}
        >
          {name}
        </Link>
        {/* {categoryClass.map((v, i) => {
          if (i < 3) {
            return (
              <Link
                href={`/product/list/category?category=${name}`}
                className={styles.FormLink}
                key={`FilterLink${i}`}
              >
                {v}
              </Link>
            );
          }
        })}
        {showMore && (
          <>
            {categoryClass.map((v, i) => {
              if (i >= 3) {
                return (
                  <Link
                    href={`/product/list/category?category=${name}`}
                    className={styles.FormLink}
                    key={`FilterLink${i}`}
                  >
                    {v}
                  </Link>
                );
              }
            })}
          </>
        )}
        {categoryClass.length > 3 && (
          <span
            className={styles.ShowLinkMore}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "收起 ▲" : "顯示全部 ▼"}
          </span>
        )} */}
      </div>
    </>
  );
}
