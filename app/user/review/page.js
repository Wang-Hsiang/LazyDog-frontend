"use client";
import { useState, useEffect } from "react";
import styles from "./review.module.css";
import { useAuth } from "@/hooks/use-auth";
import { useDetailFetch, useReviewFetch } from "@/hooks/product/use-fetch";
import Link from "next/link";

export default function ReviewList() {
  const { user } = useAuth();
  const userID = user?.id;
  const { width, router, productID, mutate, isLoading, error } =
    useDetailFetch();
  const {
    userReviews,
    userReview,
    pages,
    pageNow,
    setPageNow,
    reviewMutate,
    reviewLoading,
    reviewError,
  } = useReviewFetch({
    userID,
  });
  const changepage = (path) => {
    if (path) {
      router.push(`/product/detail?productID=${path}#productRate`);
    }
  };
  const [listOpen, setListOpen] = useState(false);
  const [pageInput, setPageInput] = useState("選擇分頁");
  useEffect(() => {
    const clickOutside = (event) => {
      if (listOpen && !event.target.closest(`.${styles.dropdown}`)) {
        setListOpen(false);
      }
    };
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [listOpen]);
  return (
    <>
      {reviewLoading ? (
        <div className={styles.container2}>
          <div className={styles.loader27}></div>
        </div>
      ) : (
        <>
          <div className={`col-12 col-xl-9 container ${styles.container}`}>
            <h5 className="mb-4">評論列表</h5>
            <table
              className={`table table-striped table-hover ${styles.table}`}
            >
              <thead className="table-light">
                <tr className="row">
                  <th className="col-4 d-flex align-items-center justify-content-center">
                    商品名稱
                  </th>
                  <th className="col-2 d-flex align-items-center justify-content-center">
                    評論日期
                  </th>
                  <th className="col-1 d-flex align-items-center justify-content-center">
                    評分
                  </th>
                  <th className="col-4 d-flex align-items-center">評論內容</th>
                  <th className="col-1 d-flex align-items-center justify-content-center">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {userReview &&
                  userReview.map((v) => (
                    <tr key={v.id}>
                      <Link
                        className="row"
                        href={`/product/detail?productID=${v.productID}`}
                        styles={{ height: "70px" }}
                      >
                        <td
                          className="col-4 d-flex align-items-start"
                          styles={{ padding: "5px" }}
                        >
                          <img
                            className={styles.productPic}
                            src={`/product/img/${encodeURIComponent(
                              v.PDname
                            )}_(1).webp`}
                            alt=""
                          />
                          {v.PDname}
                        </td>
                        <td className="col-2 d-flex align-items-center justify-content-center">{`${v.updated_at.slice(
                          0,
                          10
                        )}`}</td>
                        <td className="col-1 d-flex align-items-center justify-content-center">
                          {v.rating}
                          <img
                            className={styles.star}
                            // style={{ width: "10px", paddingTop: "2px" }}
                            src="/product/font/star-fill.png"
                            alt=""
                          />
                        </td>
                        <td className="col-4 d-flex align-items-center">
                          {v.comment}
                        </td>
                        <td className="col-1 d-flex align-items-center justify-content-center">
                          <button
                            className={`btn btn-sm ${styles.btn}`}
                            onClick={(event) => {
                              event.preventDefault();
                              changepage(v.productID);
                            }}
                          >
                            檢視
                          </button>
                        </td>
                      </Link>
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav>
              <ul className={styles.ProductListPagination}>
                {userReviews?.length > 24 && (
                  <li className={`${styles.PageArrow}`}>
                    <Link
                      onClick={() => {
                        setPageNow(pageNow - 1 == 0 ? 1 : pageNow - 1);
                        pageNow - 1 > 1
                          ? setPageInput(`第 ${pageNow - 1} 頁`)
                          : setPageInput("選擇分頁");
                      }}
                      href={`/user/review?page=${
                        pageNow - 1 == 0 ? 1 : pageNow - 1
                      }`}
                    >
                      <img src="/product/font/left(orange).png" alt="" />
                    </Link>
                  </li>
                )}
                <li
                  className={`${styles.PageItem} page-item ${
                    pageNow == 1 ? styles.PageItemActive : ""
                  }`}
                >
                  <Link
                    onClick={() => {
                      setPageNow(1);
                      setPageInput("選擇分頁");
                    }}
                    className={`${styles.PageLink} page-link `}
                    href={`/user/review?page=${1}`}
                  >
                    1
                  </Link>
                </li>
                {pages >= 3 && (
                  <div
                    className={`${styles.dropdown}`}
                    onMouseEnter={() => {
                      setListOpen(true);
                    }}
                    onMouseLeave={() => {
                      setListOpen(false);
                    }}
                  >
                    <button
                      className={`btn dropdown-toggle ${
                        styles.dropdownToggle
                      } ${
                        pageInput !== "選擇分頁" ? styles.PageItemActive : ""
                      }`}
                      type="button"
                      onClick={() =>
                        width > 1024 ? "" : setListOpen(!listOpen)
                      }
                    >
                      {pageInput}
                    </button>
                    <ul
                      className={`${
                        listOpen ? styles.dropdownMenu : styles.dropdownMenuOff
                      } dropdown-menu`}
                    >
                      {[...Array(pages)].map((v, i) => {
                        if (i > 0 && i < pages - 1) {
                          return (
                            <li
                              key={`li${i}`}
                              className={`dropdown-item ${
                                styles.dropdownItem
                              } ${
                                pageNow == i + 1 ? styles.PageItemActive : ""
                              }`}
                            >
                              <Link
                                onClick={() => {
                                  setPageNow(i + 1);
                                  setPageInput(`第 ${i + 1} 頁`);
                                  setListOpen(false);
                                }}
                                className={`${styles.PageLink} page-link`}
                                href={`/user/review?page=${i + 1}`}
                              >
                                {i + 1}
                              </Link>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                )}
                {userReviews?.length > 24 && (
                  <li
                    className={`${styles.PageItem} page-item ${
                      pageNow == pages ? styles.PageItemActive : ""
                    }`}
                  >
                    <Link
                      onClick={() => {
                        setPageNow(pages);
                        setPageInput("選擇分頁");
                      }}
                      className={`${styles.PageLink} page-link `}
                      href={`/user/review?page=${pages}`}
                    >
                      {pages}
                    </Link>
                  </li>
                )}
                {userReviews?.length > 24 && (
                  <li className={`${styles.PageArrow}`}>
                    <Link
                      onClick={() => {
                        setPageNow(pageNow + 1 > pages ? pageNow : pageNow + 1);
                        pageNow + 1 >= pages
                          ? setPageInput("選擇分頁")
                          : setPageInput(`第 ${pageNow + 1} 頁`);
                      }}
                      href={`/user/review?page=${
                        pageNow + 1 > pages ? pageNow : pageNow + 1
                      }`}
                    >
                      <img src="/product/font/right(orange).png" alt="" />
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
