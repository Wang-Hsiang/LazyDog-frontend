"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./list.module.css";
import Aside from "../_components/aside/aside";
import Link from "next/link";
import Card from "../_components/card/card";
import { useListFetch, useDetailFetch } from "@/hooks/product/use-fetch";
import { useFavorite } from "@/hooks/product/use-favorite";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useDogBottom } from "@/hooks/product/use-dog";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import Thead from "@/app/components/cart/thead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import { Collapse, Carousel } from "react-bootstrap";
import { MoonLoader } from "react-spinners";

export default function ListPage(props) {
  const {
    width,
    products,
    int,
    productLine,
    emptyMessage,
    changeUrl,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortName,
    setSortName,
    pages,
    pageNow,
    setPageNow,
    product,
    mutate,
    isLoading,
    error,
  } = useListFetch();
  const { CardInt, hotSale } = useDetailFetch();
  const [hot, setHot] = useState(0);

  const { user } = useAuth();
  const {
    containerRef,
    dogRef,
    stopDog,
    TimeoutId,
    Flip,
    stopOn,
    setStopOn,
    moveDog,
  } = useDogBottom();
  const {
    productItems = [],
    courseItems = [],
    hotelItems = [],
    totalProductQty,
    totalCourseQty,
    totalHotelQty,
    onIncrease,
    onDecrease,
    onRemove,
  } = useCart();
  let totalQty = totalProductQty + totalCourseQty + totalHotelQty;
  useEffect(() => {
    totalQty = totalProductQty + totalCourseQty + totalHotelQty;
  }, [totalProductQty, totalCourseQty, totalHotelQty]);
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);
  useEffect(() => {
    stopDog();
    return () => {
      if (TimeoutId) clearTimeout(TimeoutId);
    };
  }, [dogRef.current]);
  useEffect(() => {
    if (totalQty == 0) {
      setIsOn(false);
    }
  }, [totalQty]);

  const { favorite, setFavorite } = useFavorite();
  const [dropDown, setDropDown] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [pageInput, setPageInput] = useState("選擇分頁");
  const [collapseBtn, setCollapseBtn] = useState(false);
  const collapseRef = useRef(null);

  useEffect(() => {
    const clickOutside = (event) => {
      if (listOpen && !event.target.closest(`.${styles.dropdown}`)) {
        setListOpen(false);
      }
      if (dropDown && !event.target.closest(`.${styles.TitleFilter}`)) {
        setDropDown(false);
      }
      if (collapseBtn && !event.target.closest(`.${styles.collapseAside}`)) {
        collapseRef.current.click();
      }
    };
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [listOpen, dropDown, collapseBtn]);

  // const { randomRef, randomDogRef, randomDog, constraintsRef, RandomId } =
  // useDogRandom();
  // const [Flip, setFlip] = useState(false);
  // useEffect(() => {
  //   randomDog();
  //   return () => {
  //     if (RandomId) clearTimeout(RandomId);
  //   };
  // }, []);

  // if (error) {
  //   return (
  //     <div className="container">
  //       <img style={{ width: "100%" }} src="/product/404.png" />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className={`${styles.collapseAside} d-lg-none`}>
        {/* <div className={`${styles.collapseAsideContent}`}>
          <div
            className={`${styles.collapseHorizontal} collapse collapse-horizontal`}
            id="collapseWidthExample"
          >
            <Aside
              changeUrl={changeUrl}
              setPageNow={setPageNow}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              sortName={sortName}
            />
            <button
              ref={collapseRef}
              className={`${styles.collapseAsideBtn} btn`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWidthExample"
              aria-expanded="false"
              aria-controls="collapseWidthExample"
              onClick={() => setTimeout(() => setCollapseBtn(false), 50)}
            >
              <img src={`/product/font/left(orange).png`} alt="" />
            </button>
          </div>
          {collapseBtn == false && (
            <button
              className={`${styles.collapseAsideBtn} btn`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWidthExample"
              aria-expanded="false"
              aria-controls="collapseWidthExample"
              onClick={() => setCollapseBtn(true)}
            >
              <img src={`/product/font/right(orange).png`} alt="" />
            </button>
          )}
        </div> */}
        <div className={`${styles.collapseAsideContent}`}>
          <Collapse in={collapseBtn}>
            <div
              id="example-collapse-text"
              className={`${styles.collapseHorizontal}`}
            >
              <Aside
                changeUrl={changeUrl}
                setPageNow={setPageNow}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                sortName={sortName}
              />
              <button
                ref={collapseRef}
                className={`${styles.collapseAsideBtn} btn`}
                type="button"
                onClick={() => setCollapseBtn(false)}
                aria-controls="example-collapse-text"
                aria-expanded={collapseBtn}
              >
                <img src={`/product/font/left(orange).png`} alt="" />
              </button>
            </div>
          </Collapse>
          {collapseBtn == false && (
            <button
              className={`${styles.collapseAsideBtn} btn`}
              type="button"
              aria-controls="example-collapse-text"
              aria-expanded={collapseBtn}
              onClick={() => setCollapseBtn(true)}
            >
              <img src={`/product/font/right(orange).png`} alt="" />
            </button>
          )}
        </div>
      </div>
      <div className={`${styles.Container} container`}>
        <section className={styles.DmArea}>
          <Carousel
            interval={3000}
            controls={true}
            indicators={true}
            pause="hover"
          >
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_1.webp" />
            </Carousel.Item>
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_2.webp" />
            </Carousel.Item>
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_3.webp" />
            </Carousel.Item>
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_4.webp" />
            </Carousel.Item>
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_5.webp" />
            </Carousel.Item>
            <Carousel.Item className={styles.carouselItem}>
              <img className="d-block w-100" src="/product/DM/DM_6.webp" />
            </Carousel.Item>
          </Carousel>
        </section>
        <section className={styles.BreadcrumbsTitle}>
          <div className={`${styles.Breadcrumbs} d-none d-lg-flex`}>
            <Link href="/">首頁</Link>
            <img src="/product/font/right.png" alt="" />
            <Link className={styles.BreadcrumbsActive} href="/product/list">
              商品目錄
            </Link>
          </div>
          {products && (
            <div className={styles.Title}>
              <div className="d-none d-lg-flex">
                {/* <h5>目前共{products.length}項商品</h5> */}
              </div>
              <div className={`${styles.Breadcrumbs} d-lg-none`}>
                <Link href="/">首頁</Link>
                <img src="/product/font/right.png" alt="" />
                <Link className={styles.BreadcrumbsActive} href="/product/list">
                  商品目錄
                </Link>
              </div>
              <div
                className={styles.TitleFilter}
                onMouseEnter={() => {
                  setDropDown(true);
                }}
                onMouseLeave={() => {
                  setDropDown(false);
                }}
              >
                <img
                  onClick={() => {
                    setDropDown(!dropDown);
                  }}
                  src={`/product/font/${
                    sortName.includes("名稱")
                      ? "filter-a"
                      : sortName.includes("價格")
                      ? "filter-m"
                      : sortName.includes("時間")
                      ? "filter-d"
                      : "filter"
                  }.png`}
                  alt=""
                />
                <div className={styles["dropdown"]}>
                  <li
                    onClick={() => {
                      setDropDown(!dropDown);
                    }}
                  >
                    <h6 className={styles["dropbtn"]}>{sortName}</h6>
                  </li>
                  <div
                    className={`${
                      width <= 1024 && dropDown
                        ? styles["dropdown-contentOn"]
                        : width <= 1024
                        ? styles["dropdown-contentOff"]
                        : styles["dropdown-content"]
                    }`}
                  >
                    <h6
                      className={`${styles["dropdown-link"]} ${styles["dropdown-link-top"]}`}
                      onClick={() => {
                        changeUrl(
                          `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}&sort=name`
                        );
                        setSortName("↓商品名稱");
                        setDropDown(false);
                      }}
                    >
                      ↓商品名稱
                    </h6>
                    <h6
                      className={styles["dropdown-link"]}
                      onClick={() => {
                        changeUrl(
                          `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}&sort=price`
                        );
                        setSortName("↑商品價格");
                        setDropDown(false);
                      }}
                    >
                      ↑商品價格
                    </h6>
                    <h6
                      className={styles["dropdown-link"]}
                      onClick={() => {
                        changeUrl(
                          `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}&sort=priceDown`
                        );
                        setSortName("↓商品價格");
                        setDropDown(false);
                      }}
                    >
                      ↓商品價格
                    </h6>
                    <h6
                      className={`${styles["dropdown-link"]}`}
                      onClick={() => {
                        changeUrl(
                          `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}&sort=update`
                        );
                        setSortName("↑上架時間");
                        setDropDown(false);
                      }}
                    >
                      ↑上架時間
                    </h6>
                    <h6
                      className={`${styles["dropdown-link"]} ${styles["dropdown-link-bottom"]}`}
                      onClick={() => {
                        changeUrl(
                          `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}&sort=updateDown`
                        );
                        setSortName("↓上架時間");
                        setDropDown(false);
                      }}
                    >
                      ↓上架時間
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className={styles.PdArea}>
          <div className="d-none d-lg-flex">
            <Aside
              changeUrl={changeUrl}
              setPageNow={setPageNow}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              sortName={sortName}
            />
          </div>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MoonLoader
                color="#f5842b"
                loading
                size={300}
                speedMultiplier={1}
              />
            </div>
          ) : !products ? (
            <div className={styles.empty}>
              <h2>{emptyMessage}</h2>
              <section className={styles.OtherLike}>
                <h4 className={styles.OtherLikeTitle}>要不要看看其他好物...</h4>
                <div className={styles.OtherLikeContent}>
                  <button
                    type="button"
                    className={styles.ProductInfoImgSmallBtn}
                    onClick={() => {
                      setHot(hot - 1 < 0 ? hot : hot - 1);
                    }}
                  >
                    <img src="/product/font/left(orange).png" alt="" />
                  </button>
                  <ul
                    style={{ padding: 0 }}
                    className={`${styles.OtherLikeList} row`}
                  >
                    {hotSale.length > 0 &&
                      hotSale?.map((v, i) => {
                        if (i < CardInt + hot && i >= hot) {
                          return (
                            <motion.div
                              key={`Card${i}`}
                              className="col"
                              style={{ padding: 0 }}
                              layout
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ all: 0.1 }}
                            >
                              <Card
                                productID={v}
                                favorite={favorite}
                                setFavorite={setFavorite}
                              />
                            </motion.div>
                          );
                        }
                      })}
                  </ul>
                  <button
                    type="button"
                    className={styles.ProductInfoImgSmallBtn}
                    onClick={() => {
                      setHot(
                        hot + 1 > hotSale.length - CardInt ? hot : hot + 1
                      );
                    }}
                  >
                    <img src="/product/font/right(orange).png" alt="" />
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <main className={styles.PdList}>
              {[...Array(productLine)].map((value, index) => {
                return (
                  <ul className={styles.ProductCardGroup} key={index}>
                    {product?.map((v, i) => {
                      if (index * int <= i && i < (index + 1) * int)
                        return (
                          <Card
                            key={v.productID}
                            productID={v.productID}
                            favorite={favorite}
                            setFavorite={setFavorite}
                          />
                        );
                    })}
                  </ul>
                );
              })}
              <nav>
                <ul className={styles.ProductListPagination}>
                  {products.length > 24 && (
                    <li className={`${styles.PageArrow}`}>
                      <Link
                        onClick={() => {
                          setPageNow(pageNow - 1 == 0 ? 1 : pageNow - 1);
                          pageNow - 1 > 1
                            ? setPageInput(`第 ${pageNow - 1} 頁`)
                            : setPageInput("選擇分頁");
                        }}
                        href={`/product/list?page=${
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
                      href={`/product/list?page=${1}`}
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
                          listOpen
                            ? styles.dropdownMenu
                            : styles.dropdownMenuOff
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
                                  href={`/product/list?page=${i + 1}`}
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
                  {products.length > 24 && (
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
                        href={`/product/list?page=${pages}`}
                      >
                        {pages}
                      </Link>
                    </li>
                  )}
                  {products.length > 24 && (
                    <li className={`${styles.PageArrow}`}>
                      <Link
                        onClick={() => {
                          setPageNow(
                            pageNow + 1 > pages ? pageNow : pageNow + 1
                          );
                          pageNow + 1 >= pages
                            ? setPageInput("選擇分頁")
                            : setPageInput(`第 ${pageNow + 1} 頁`);
                        }}
                        href={`/product/list?page=${
                          pageNow + 1 > pages ? pageNow : pageNow + 1
                        }`}
                      >
                        <img src="/product/font/right(orange).png" alt="" />
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </main>
          )}
        </section>
      </div>
      {width > 991 && (
        <div
          style={{
            width: "100vw",
            height: "38px",
            position: "fixed",
            bottom: 0,
            zIndex: 99999,
          }}
        >
          <div className={styles.dogApp} ref={containerRef}>
            <div
              ref={dogRef}
              className={`${styles.dog} ${styles.flip}`}
              onClick={(e) => {
                stopDog(e);
                setStopOn(!stopOn);
              }}
              onMouseEnter={(e) => {
                stopDog(e, true);
              }}
              // onMouseLeave={(e) => {
              //   stopDog(e);
              //   setStopOn(!stopOn);
              // }}
            >
              {user?.id && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSwitch();
                  }}
                  className={styles["lumi-cart-icon"]}
                  style={{ color: isOn ? "#ffffff" : "" }}
                >
                  <i className="bi bi-cart2"></i>
                  {totalQty > 0 && (
                    <div
                      className={styles["lumi-cart-count"]}
                      style={{ transform: Flip ? "" : "scaleX(-1)" }}
                    >
                      {totalQty}
                    </div>
                  )}
                </div>
              )}
            </div>
            <AnimatePresence initial={false}>
              <motion.div
                layout
                style={{
                  display: isOn ? "flex" : "none",
                  alignItems: isOn ? "center" : "",
                  justifyContent: isOn ? "center" : "",
                  width: isOn ? width : "",
                  height: isOn ? "100vh" : "",
                  position: isOn ? "fixed" : "",
                  top: isOn ? "0" : "",
                  left: isOn ? "0" : "",
                  zIndex: isOn ? "9999" : "",
                  background: isOn ? "rgba(0, 0, 0, 0.8)" : "",
                  transition: "all 0.4s",
                }}
                onClick={toggleSwitch}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div className={`${styles.customTable}`}>
                    <table className="">
                      {productItems.length > 0 && (
                        <>
                          <Thead />
                          <tbody>
                            {/* 顯示商品 */}
                            {productItems.map((cartItem) => {
                              const imgName = cartItem?.img
                                ? cartItem.img.split(",")
                                : [""];
                              return (
                                <tr key={cartItem.id}>
                                  <td className={styles.table}>
                                    <img
                                      src={`/product/img/${encodeURIComponent(
                                        cartItem.name
                                      )}${imgName[0]}`}
                                      alt={cartItem.name}
                                    />
                                  </td>
                                  <td className={styles.tableName}>
                                    {cartItem.name}
                                  </td>
                                  <td>
                                    {Number(cartItem.price).toLocaleString()}
                                  </td>
                                  <td className={`${styles.Btn}`}>
                                    <button
                                      onClick={() => onIncrease(cartItem.id)}
                                    >
                                      +
                                    </button>
                                    {cartItem.count}
                                    <button
                                      onClick={() => onDecrease(cartItem.id)}
                                    >
                                      -
                                    </button>
                                  </td>
                                  <td>
                                    {Number(
                                      cartItem.count * cartItem.price
                                    ).toLocaleString()}
                                  </td>
                                  <td>
                                    <button
                                      style={{
                                        border: "transparent",
                                        backgroundColor: "white",
                                      }}
                                      onClick={() => onRemove(cartItem.id)}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        style={{ color: "#f2662b" }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </>
                      )}

                      {courseItems.length > 0 && (
                        <>
                          <Thead />
                          <tbody>
                            {/* 顯示課程 */}
                            {courseItems.map((cartItem) => (
                              <tr key={cartItem.id}>
                                <td className={styles.table}>
                                  <img
                                    src={`/course/img/${cartItem.img_url}`}
                                    alt={cartItem.name}
                                  />
                                </td>
                                <td className={styles.tableName}>
                                  {cartItem.name}
                                </td>
                                <td>
                                  {Number(cartItem.price).toLocaleString()}
                                </td>
                                <td className={`${styles.Btn}`}>
                                  <button
                                    onClick={() => onIncrease(cartItem.id)}
                                  >
                                    +
                                  </button>
                                  {cartItem.count}
                                  <button
                                    onClick={() => onDecrease(cartItem.id)}
                                  >
                                    -
                                  </button>
                                </td>
                                <td>
                                  {Number(
                                    cartItem.count * cartItem.price
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  <button
                                    style={{
                                      border: "transparent",
                                      backgroundColor: "white",
                                    }}
                                    onClick={() => onRemove(cartItem.id)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      style={{ color: "#f2662b" }}
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </>
                      )}

                      {hotelItems.length > 0 && (
                        <>
                          <Thead />
                          <tbody>
                            {/* 顯示旅館 */}
                            {hotelItems.map((cartItem) => (
                              <tr key={cartItem.id}>
                                <td className={styles.table}>
                                  <img
                                    src={cartItem.imageUrl}
                                    alt={cartItem.name}
                                  />
                                </td>
                                <td className={styles.tableName}>
                                  {cartItem.name}
                                  {/* <br />
                          hotel_id{cartItem.hotelId}
                          <br />
                          room_id{cartItem.id} */}
                                  <br />
                                  入住: {cartItem.checkInDate || "未填寫"}
                                  <br />
                                  退房: {cartItem.checkOutDate || "未填寫"}
                                </td>
                                <td>
                                  {Number(cartItem.price).toLocaleString()}
                                </td>
                                <td className={`${styles.Btn}`}>
                                  <button
                                    onClick={() => onIncrease(cartItem.id)}
                                  >
                                    +
                                  </button>
                                  {cartItem.count}
                                  <button
                                    onClick={() => onDecrease(cartItem.id)}
                                  >
                                    -
                                  </button>
                                </td>
                                <td>
                                  {Number(
                                    cartItem.count * cartItem.price
                                  ).toLocaleString()}
                                </td>
                                {/* 新增日期顯示 */}
                                <td>
                                  <button
                                    style={{
                                      border: "transparent",
                                      backgroundColor: "white",
                                    }}
                                    onClick={() => onRemove(cartItem.id)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      style={{ color: "#f2662b" }}
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </>
                      )}
                    </table>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
      {/* <motion.div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          bottom: 0,
          overflow: "hidden",
        }}
        ref={constraintsRef}
      >
        <motion.div
          className={styles.dogApp}
          ref={randomRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
        >
          <div
            ref={randomDogRef}
            className={`${styles.dog} ${Flip ? "" : styles.flip}`}
            onClick={() => {
              setFlip(!Flip);
            }}
          ></div>
        </motion.div>
      </motion.div> */}
    </>
  );
}
