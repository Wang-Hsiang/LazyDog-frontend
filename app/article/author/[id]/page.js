"use client";

import { useState } from "react";
import styles from './page.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from "next/link";
import useMyArticles from '@/hooks/useMyArticles'
import { useParams } from "next/navigation";
import MainCard from '../../_components/author/ListCard';
import { useAuth } from "@/hooks/use-auth";
import Header from "../../../components/layout/header";
import style from '../../../../styles/modules/operatorCamera.module.css';
import Breadcrumb from "../../../components/teacher/breadcrumb";

const ArticlePage = () => {
    const { id } = useParams(); // 取得網址中的文章 ID
    const { articles } = useMyArticles(id);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;
    const { user } = useAuth()
    const authorNames = articles?.[0]?.author_name || "";
    console.log(authorNames);
    


    // 判斷有無使用者登入
    const handleClick = (event) => {
        if (!user) {
            event.preventDefault(); // 阻止預設跳轉行為
            window.location.href = "http://localhost:3000/login"; // 跳轉到登入頁
        }
    };

    // 搜尋處理
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // 每次搜尋重置頁碼
    };

    // 過濾分類
    const filteredByCategory = selectedCategory
        ? articles.filter(article => article.category_id === selectedCategory)
        : articles;

    // 過濾搜尋結果
    const filteredArticles = filteredByCategory.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 排序文章
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
    const currentArticles = sortedArticles.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // 分類選擇
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setActiveCategory(categoryId);
        setPage(1);
    };

    // 排序切換
    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        setPage(1);
    };

    // 分頁處理
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    return (
        <>
            <Header />
            <div className={`${styles.mainDog} mb-3`}>
                <h1 style={{ fontWeight: 'bold' }}>毛孩文章</h1>
            </div>

            <div className={`container ${style.container}`}>
                {/* 發布文章按鈕 */}
                <div className={styles.postButton}>
                    <Breadcrumb
                        links={[
                            { label: "首頁 ", href: "/" },
                            { label: "毛孩文章", href: "/article/list" },
                            {
                                label: ` ${authorNames
                                    || "標題尚未加載"}`,
                                href: "/article/list/detail",
                                active: true,
                            },
                        ]}
                    />
                    <button className={` ${styles.post}`}>
                        <Link
                            href="http://localhost:3000/article/add_article"
                            className={styles.postLink}
                            onClick={handleClick} // 點擊時檢查是否已登入
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
                                style={{ border: 'none', height: '40px', borderRadius: '5px' }}
                                placeholder="搜尋文章..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <label className="input-group-text" style={{ background: 'none', border: 'none' }}>
                                <i className="bi bi-search"></i>
                            </label>
                        </div>
                        <div className={styles.asideCategory}>
                            <h4 className='mb-3'>類別</h4>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategorySelect(null); // 選擇「全部」
                                }}
                            >
                                <p
                                    className={activeCategory === null ? styles.asideCategoryPA : styles.asideCategoryP}
                                >
                                    全部
                                </p>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategorySelect(1); // 選擇「保健與營養」
                                }}
                            >
                                <p className={activeCategory === 1 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                    保健與營養
                                </p>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategorySelect(5); // 選擇「開箱」
                                }}
                            >
                                <p className={activeCategory === 5 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                    開箱
                                </p>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategorySelect(2); // 選擇「食譜」
                                }}
                            >
                                <p className={activeCategory === 2 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                    食譜
                                </p>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategorySelect(3); // 選擇「善終」
                                }}
                            >
                                <p className={activeCategory === 3 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                    善終
                                </p>
                            </a>
                        </div>
                        {/* <div >
              <h4 className={styles.H4}>延伸閱讀</h4>
              {articles
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
                .map((article) => (
                  <AsideCard key={article.id} {...article} />
                ))}
            </div> */}
                    </aside>

                    {/* 主要內容 */}
                    <main
                    // style={{display:'flex',flexDirection:'column',gap:'25px'}}       
                    >

                        <div className={styles.RWDfilter}>
                            <div className="input-group my-3" style={{ border: '.2px solid grey', borderRadius: '5px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ border: 'none', height: '40px', borderRadius: '5px' }}
                                    placeholder="搜尋文章..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
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
                                        style={{width:'366px'}}
                                        >
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect(null); // 選擇「全部」
                                                }}
                                            >
                                                <p
                                                    className={activeCategory === null ? styles.asideCategoryPA : styles.asideCategoryP}
                                                >
                                                    全部
                                                </p>
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect(1); // 選擇「保健與營養」
                                                }}
                                            >
                                                <p className={activeCategory === 1 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                                    保健與營養
                                                </p>
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect(5); // 選擇「開箱」
                                                }}
                                            >
                                                <p className={activeCategory === 5 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                                    開箱
                                                </p>
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect(2); // 選擇「食譜」
                                                }}
                                            >
                                                <p className={activeCategory === 2 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                                    食譜
                                                </p>
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect(3); // 選擇「善終」
                                                }}
                                            >
                                                <p className={activeCategory === 3 ? styles.asideCategoryPA : styles.asideCategoryP}>
                                                    善終
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={styles.filter} onClick={handleSortToggle}>
                            <i className="bi bi-filter"></i> 依時間排序 {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                        <div
                            className={styles.main}
                        // style={{ display: 'flex', flexDirection: 'column', gap: '25px',paddingBottom:'100px' }}
                        >
                            {currentArticles.length > 0 ? (
                                currentArticles.map((article) => (

                                    // element="div"

                                    <MainCard key={article.id} {...article} />

                                ))
                            ) : (
                                <p>沒有符合條件的文章</p>
                            )}
                        </div>


                        {/* <div >
              <h4 className={styles.RWDH4}>延伸閱讀</h4>
              {articles
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
                .map((article) => (
                  <AsideCard2
                    key={article.id} {...article} />
                ))}
            </div> */}
                    </main>

                </div>
                {totalPages > 1 && (
                    <nav className="page">
                        <ul className={styles.ArticlePage}>
                            {/* 前一页按钮 */}
                            <li className={`${styles.PageItem} page-item ${page === 1 ? 'disabled' : ''}`}>
                                <a
                                    className={`${styles.PageLink} page-link`}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) handlePageChange(page - 1);
                                    }}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                </a>
                            </li>

                            {/* 动态生成页码范围 */}
                            {[...Array(totalPages)]
                                .map((_, i) => i + 1) // 生成 1 到 totalPages 的数组
                                .filter((i) => i >= page - 1 && i <= page + 1) // 只保留当前页及其前后各一页
                                .map((i) => (
                                    <li key={i} className={`${styles.PageItem} page-item`}>
                                        <a
                                            className={`${styles.PageLink} page-link ${page === i ? styles.activePage : ''}`} // 当前页添加 activePage 类
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(i);
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
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) handlePageChange(page + 1);
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