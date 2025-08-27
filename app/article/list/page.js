"use client";

import { useState } from "react";
import styles from './page.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from "next/link";
import useArticles from '@/hooks/useArticle';
import MainCard from '../_components/list/ListCard';
import AsideCard from '../_components/list/AsideCard';
import AsideCard2 from '../_components/list/AsideCard2';
import { useAuth } from "@/hooks/use-auth";
import Header from "../../components/layout/header";
import style from '../../../styles/modules/operatorCamera.module.css';

const ArticlePage = () => {
  const { articles, loading, error } = useArticles();
  const [page, setPage] = useState(1);
  const [Category, setCategory] = useState(null);
  const [CategoryStyle, setCategoryStyle] = useState(null);
  const [SortOrder, setSortOrder] = useState('desc');
  const [SearchTing, setSearchTing] = useState("");
  const PageMax = 5;
  const { user } = useAuth()


  // 判斷有無使用者登入
  const userLogin = (event) => {
    console.log(user);
    if (!user) {
      event.preventDefault(); // 阻止預設跳轉行為
      window.location.href = "http://localhost:3000/login"; // 跳轉到登入頁
    }
  };

  // 分類
  const CategorySelect = (categoryId) => {
    setCategory(categoryId);
    setCategoryStyle(categoryId);
    setPage(1);
  };
  const filter = Category
    ? articles.filter(article => article.category_id === Category)
    : articles;

  // 搜尋
  const SearchIng = (e) => {
    setSearchTing(e.target.value);
    setPage(1); // 每次搜尋重置頁碼
  };
  const filteredArticles = filter.filter(article =>
    article.title.toLowerCase().includes(SearchTing.toLowerCase())
  );

  // 排序
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return SortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  const Sort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };
  const Articles = sortedArticles.slice(
    (page - 1) * PageMax,
    page * PageMax
  );
  // 分頁
  const totalPages = Math.ceil(sortedArticles.length / PageMax);
  const Page = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };


  if (loading) return <p>載入中...</p>;
  if (error) return <p className="text-red-500">錯誤：{error}</p>;

  return (
    <>
      <Header />
      <div className={`${styles.mainDog} mb-3`}>
        <h1 style={{ fontWeight: 'bold' }}>毛孩文章</h1>
      </div>

      <div className={`container ${style.container}`}>
        {/* 發布文章按鈕 */}
        <div className={styles.postButton}>
          <button className={` ${styles.post}`}>
            <Link
              href="http://localhost:3000/article/add_article"
              className={styles.postLink}
              onClick={userLogin} // 點擊時檢查是否已登入
            >
              <i className="bi bi-check-circle"></i> 發布文章
            </Link>
          </button>
        </div>

        {/* 左側搜尋與分類 */}
        <div className={styles.content}>
          <aside className={styles.aside} >
            <div className="input-group my-3" style={{ border: '.2px solid grey', borderRadius: '5px' }}>
              <input
                type="text"
                className="form-control"
                style={{ border: 'none', height: '100%', borderRadius: '5px' }}
                placeholder="搜尋文章..."
                value={SearchTing}
                onChange={SearchIng}
              />
              <label className="input-group-text" style={{ background: 'none', border: 'none' }}>
                <i className="bi bi-search"></i>
              </label>
            </div>
            <div className={styles.asideCategory}>
              <h4 className='mb-3'>類別</h4>
              <a
                onClick={() => {
                  CategorySelect(null); // 選擇「全部」
                }}
              >
                <p
                  className={CategoryStyle === null ? styles.asideCategoryPA : styles.asideCategoryP}
                >
                  全部
                </p>
              </a>
              <a
                onClick={() => {
                  CategorySelect(1); // 選擇「保健與營養」
                }}
              >
                <p className={CategoryStyle === 1 ? styles.asideCategoryPA : styles.asideCategoryP}>
                  保健與營養
                </p>
              </a>
              <a
                onClick={() => {
                  CategorySelect(5); // 選擇「開箱」
                }}
              >
                <p className={CategoryStyle === 5 ? styles.asideCategoryPA : styles.asideCategoryP}>
                  開箱
                </p>
              </a>
              <a
                onClick={() => {
                  CategorySelect(2); // 選擇「食譜」
                }}
              >
                <p className={CategoryStyle === 2 ? styles.asideCategoryPA : styles.asideCategoryP}>
                  食譜
                </p>
              </a>
              <a
                onClick={() => {
                  CategorySelect(3); // 選擇「善終」
                }}
              >
                <p className={CategoryStyle === 3 ? styles.asideCategoryPA : styles.asideCategoryP}>
                  善終
                </p>
              </a>
              <a
                onClick={() => {
                  CategorySelect(4); // 選擇「行為知識」
                }}
              >
                <p className={CategoryStyle === 4 ? styles.asideCategoryPA : styles.asideCategoryP}>
                  行為知識
                </p>
              </a>
            </div>
            <div >
              <h4 className={styles.H4}>延伸閱讀</h4>
              {
                [...articles]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
                  .map((article) => (
                    <AsideCard key={article.id} {...article} />
                  ))
              }
            </div>
          </aside>

          {/* 主要內容 */}
          <main>

            <div className={styles.RWDfilter}>
              <div className="input-group my-3" style={{ border: '.2px solid grey', borderRadius: '5px' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ border: 'none', height: '100%', borderRadius: '5px' }}
                  placeholder="搜尋文章..."
                  value={SearchTing}
                  onChange={SearchIng}
                />
                <label className="input-group-text" style={{ background: 'none', border: 'none' }}>
                  <i className="bi bi-search"></i>
                </label>
              </div>
              <div className="accordion accordion-flush">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne">
                      類別
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body"
                      style={{ width: '366px' }}
                    >
                      <a
                        onClick={() => {
                          CategorySelect(null); // 選擇「全部」
                        }}
                      >
                        <p
                          className={CategoryStyle === null ? styles.asideCategoryPA : styles.asideCategoryP}
                        >
                          全部
                        </p>
                      </a>
                      <a
                        onClick={() => {
                          CategorySelect(1); // 選擇「保健與營養」
                        }}
                      >
                        <p className={CategoryStyle === 1 ? styles.asideCategoryPA : styles.asideCategoryP}>
                          保健與營養
                        </p>
                      </a>
                      <a
                        onClick={() => {
                          CategorySelect(5); // 選擇「開箱」
                        }}
                      >
                        <p className={CategoryStyle === 5 ? styles.asideCategoryPA : styles.asideCategoryP}>
                          開箱
                        </p>
                      </a>
                      <a
                        onClick={() => {
                          CategorySelect(2); // 選擇「食譜」
                        }}
                      >
                        <p className={CategoryStyle === 2 ? styles.asideCategoryPA : styles.asideCategoryP}>
                          食譜
                        </p>
                      </a>
                      <a

                        onClick={() => {

                          CategorySelect(3); // 選擇「善終」
                        }}
                      >
                        <p className={CategoryStyle === 3 ? styles.asideCategoryPA : styles.asideCategoryP}>
                          善終
                        </p>
                      </a>
                      <a

                        onClick={() => {

                          CategorySelect(4); // 選擇「行為知識」
                        }}
                      >
                        <p className={CategoryStyle === 4 ? styles.asideCategoryPA : styles.asideCategoryP}>
                          行為知識
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className={styles.filter} onClick={Sort}>
              <i className="bi bi-filter"></i> 依時間排序 {SortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <div
              className={styles.main}
            >
              {Articles.map((article) => (
                <MainCard key={article.id} {...article} />
              ))}
            </div>
            <div >
              <h4 className={styles.RWDH4}>延伸閱讀</h4>
              {
                [...articles]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
                  .map((article) => (
                    <AsideCard2
                      key={article.id} {...article} />
                  ))}
            </div>
          </main>

        </div>
        {totalPages > 1 && (
          <nav className="page">
            <ul className={styles.ArticlePage}>
              {/* 前一页按钮 */}
              <li className={`${styles.PageItem} page-item`}>
                <a
                  className={`${styles.PageLink} page-link`}

                  onClick={() => {
                    if (page > 1) Page(page - 1);
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                </a>
              </li>
              {[...Array(totalPages)]
                .map((_, i) => i + 1)
                .map((i) => (
                  <a key={i} className={`${styles.PageItem} page-item`}>
                    <li
                      className={`${styles.PageLink} page-link ${page === i ? styles.activePage : ''}`}

                      onClick={() => {

                        Page(i);
                      }}
                    >
                      {i}
                    </li>
                  </a>
                ))}

              {/* 下一页按钮 */}
              <li className={`${styles.PageItem} page-item`}>
                <a
                  className={`${styles.PageLink} page-link`}

                  onClick={() => {

                    if (page < totalPages) Page(page + 1);
                  }}
                >
                  <i className="bi bi-arrow-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        )}
        {totalPages > 1 && (
          <nav className="page">
            <ul className={styles.ArticlePageRWD}>
              {/* 前一页按钮 */}
              <li className={`${styles.PageItem} page-item ${page === 1 ? 'disabled' : ''}`}>
                <a
                  className={`${styles.PageLink} page-link`}
                  onClick={() => {
                    if (page > 1) Page(page - 1);
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                </a>
              </li>

              {[...Array(totalPages)]
                .map((_, i) => i + 1) 
                .filter((i) => i >= page - 1 && i <= page + 1) 
                .map((i) => (
                  <li key={i} className={`${styles.PageItem} page-item`}>
                    <a
                      className={`${styles.PageLink} page-link ${page === i ? styles.activePage : ''}`} 
                      onClick={() => {
                        Page(i);
                      }}
                    >
                      {i}
                    </a>
                  </li>
                ))}

              {/* 下一页按钮 */}
              <li className={`${styles.PageItem} page-item ${page === totalPages ? 'disabled' : ''}`}>
                <a
                  className={`${styles.PageLink} page-link`}
                  onClick={() => {
                    if (page < totalPages) Page(page + 1);
                  }}
                >
                  <i className="bi bi-arrow-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>

    </>
  );
};

export default ArticlePage;