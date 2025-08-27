import React from "react";
import styles from "../../../styles/modules/fontHotelHome.module.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1); // 當前頁的前一頁
    let endPage = Math.min(totalPages, currentPage + 1); // 當前頁的後一頁

    // 如果當前頁接近第一頁，顯示 1, 2, 3
    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    }
    // 如果當前頁接近最後一頁，顯示最後三頁
    else if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 2);
      endPage = totalPages;
    }

    // 生成頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container page">
      <nav aria-label="Page navigation">
        <ul
          className={`pagination justify-content-center ${styles.suPagination}`}
          id="pagination"
        >
          {/* 上一頁按鈕 */}
          <li
            className={`page-item ${currentPage === 1 ? "disabled" : ""} ${
              styles.pageItem
            }`}
          >
            <button
              className={`page-link ${styles.pageLink}`}
              aria-label="Previous"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <FaAngleLeft />
            </button>
          </li>

          {/* 顯示頁碼按鈕 */}
          {getPageNumbers().map((page) => (
            <li
              key={page}
              className={`page-item ${
                currentPage === page ? styles.pageItemActive : ""
              } ${styles.pageItem}`}
            >
              <button
                className={`page-link ${styles.pageLink}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* 下一頁按鈕 */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            } ${styles.pageItem}`}
          >
            <button
              className={`page-link ${styles.pageLink}`}
              aria-label="Next"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <FaAngleRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;