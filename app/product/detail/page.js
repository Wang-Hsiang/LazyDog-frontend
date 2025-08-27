"use client";

import React, { useState, useEffect, useRef, use } from "react";
import styles from "./detail.module.css";
import Card from "../_components/card/card";
import RateCard from "../_components/rate/ratecard";
import StarGroup from "../_components/rate/stargroup";
import StarBar from "../_components/rate/starbar";
import Link from "next/link";

import Swal from "sweetalert2";
import { ClipLoader, MoonLoader } from "react-spinners";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useDogBottom } from "@/hooks/product/use-dog";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import Thead from "@/app/components/cart/thead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import { useDetailFetch, useReviewFetch } from "@/hooks/product/use-fetch";
import {
  DetailFavoriteProvider,
  useDetailFavorite,
} from "@/hooks/product/use-favorite";

export default function DetailPage() {
  return (
    <DetailFavoriteProvider>
      <DetailContent />
    </DetailFavoriteProvider>
  );
}

function DetailContent() {
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

  const userID = user?.id;
  const { onAddProduct } = useCart();
  const {
    userName,
    userImg,
    history,
    width,
    product,
    router,
    loginRoute,
    productData,
    productID,
    productName,
    productDiscount,
    img,
    picNow,
    setPicNow,
    rate,
    setRate,
    amount,
    setAmount,
    detailPic,
    setDetailPic,
    rateData,
    rateAvg,
    int,
    dec,
    CardInt,
    hotSale,
    sameBuy,
    mutate,
    isLoading,
    error,
  } = useDetailFetch();
  const { reviews, reviewMutate, reviewLoading, reviewError } = useReviewFetch({
    productID,
    userID,
  });
  const {
    favorite,
    setFavorite,
    heartHover,
    setHeartHover,
    heartState,
    setHeartState,
  } = useDetailFavorite();

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const scrollNow = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", scrollNow);
    return () => {
      window.removeEventListener("scroll", scrollNow);
    };
  }, []);
  const elementRef = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (elementRef.current) {
      setOffset(elementRef.current.offsetTop);
    }
  }, [elementRef.current]);

  const collapseRef = useRef(null);
  const simulateClick = () => {
    if (collapseRef.current) {
      collapseRef.current.click();
    }
  };

  const [fullInfo, setFullInfo] = useState(false);
  const [infoImg, setInfoImg] = useState(false);
  const [spec, setSpec] = useState(false);
  const [also, setAlso] = useState(0);
  const [hot, setHot] = useState(0);
  const [rateNow, setRateNow] = useState(false);
  useEffect(() => {
    if (user?.id > 0) {
      setRateNow(true);
    }
  }, [user?.id]);
  useEffect(() => {
    setAlso(0);
    setHot(0);
    setRate(width >= 1200 ? 3 : width >= 768 ? 2 : 1);
  }, [width]);

  const handleAddToCart = async (e) => {
    // 檢查用戶是否登入
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "請先登入",
        text: "您需要登入才能加入購物車！",
        showConfirmButton: true,
        confirmButtonText: "前往登入",
        confirmButtonColor: "#66c5bd", // 設定按鈕顏色
        showCancelButton: true, // 顯示取消按鈕
        cancelButtonText: "繼續逛街", // 設定取消按鈕文字
        cancelButtonColor: "#bcbcbc", // 設定取消按鈕顏色
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(loginRoute); // 跳轉到登入頁面
        }
      });
      return;
    }
    try {
      onAddProduct(productData, amount);
      // 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "加入購物車成功",
        showConfirmButton: false,
        timer: 1000, // 1.5 秒後自動關閉
      });
      if (e == true) {
        setTimeout(() => {
          router.push("/cart/CartList");
        }, 100);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "加入購物車失敗",
        text: "請稍後重試！",
      });
    }
  };
  const handleAddFavorite = async () => {
    // 檢查用戶是否登入
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "請先登入",
        text: "您需要登入才能點擊收藏！",
        showConfirmButton: true,
        confirmButtonText: "前往登入",
        confirmButtonColor: "#66c5bd", // 設定按鈕顏色
        showCancelButton: true, // 顯示取消按鈕
        cancelButtonText: "繼續逛街", // 設定取消按鈕文字
        cancelButtonColor: "#bcbcbc", // 設定取消按鈕顏色
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(loginRoute); // 跳轉到登入頁面
        }
      });
      return;
    }
    try {
      const newState = !heartState;
      setHeartState(newState);
      setFavorite((favorite) =>
        newState
          ? [...favorite, productID]
          : favorite.filter((e) => e !== productID)
      );
      if (!heartState) {
        Swal.fire({
          icon: "success",
          title: "加入收藏成功",
          showConfirmButton: false,
          timer: 1000, // 1.5 秒後自動關閉
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "取消收藏成功",
          showConfirmButton: false,
          timer: 1000, // 1.5 秒後自動關閉
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "加入收藏失敗",
        text: "請稍後重試！",
      });
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  if (error) {
    return (
      <div className="container">
        <img style={{ width: "100%" }} src="/product/404.png" />
      </div>
    );
  }

  // console.log(scrollY, offset);

  return (
    <>
      <div className={`${styles.Container} container`}>
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
            <ClipLoader
              color="#f5842b"
              loading
              size={300}
              speedMultiplier={2}
            />
          </div>
        ) : (
          <>
            <section className={styles.Breadcrumbs}>
              <Link href="/">首頁</Link>
              <img src="/product/font/right.png" alt="" />
              <Link href="/product/list"> 商品目錄 </Link>
              <img src="/product/font/right.png" alt="" />
              <Link
                className={styles.BreadcrumbsActive}
                href={`/product/list/category?category=${productData?.category}`}
              >
                {productData?.category}
              </Link>
            </section>
            <section className={`${styles.ProductInfo} row`}>
              <div className={`${styles.ProductInfoImgGroup}`}>
                <figure
                  style={{ marginLeft: width >= 768 ? "43px" : "" }}
                  className={styles.ProductInfoImg}
                >
                  {detailPic == "/product/img/default.webp" ? (
                    <div
                      style={{
                        maxWidth: "611px",
                        height: width >= 768 ? "611px" : "400px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MoonLoader
                        width={300}
                        color="#f5842b"
                        speedMultiplier={2}
                      />
                    </div>
                  ) : (
                    <motion.img
                      layout
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ all: 0.1 }}
                      src={detailPic}
                      alt=""
                      onError={() => setDetailPic("/product/img/default.webp")}
                    />
                  )}
                </figure>
                <div className={styles.ProductInfoImgSmall}>
                  {img.sm.length > 0 && width >= 768 && (
                    <button
                      type="button"
                      className={styles.ProductInfoImgSmallBtn}
                      onClick={() => {
                        setPicNow((e) => {
                          const newIndex =
                            e - 1 < 0 ? img.sm.length - 1 : e - 1;
                          const encodedImageName =
                            encodeURIComponent(productName);
                          setDetailPic(
                            `/product/img/${encodedImageName}${img.img[newIndex]}`
                          );
                          return newIndex;
                        });
                      }}
                    >
                      <img src="/product/font/left(orange).png" alt="" />
                    </button>
                  )}
                  {img.sm &&
                    img.sm.map((v, i) => {
                      if (i < (width < 768 ? 4 : 5)) {
                        return (
                          <figure
                            key={`smPic${i}`}
                            className={`${styles.ProductInfoImgSmall}  ${
                              i == picNow
                                ? styles.ProductInfoImgSmallActive
                                : ""
                            }`}
                            onClick={() => {
                              setPicNow(() => {
                                const newIndex = i;
                                const encodedImageName =
                                  encodeURIComponent(productName);
                                setDetailPic(
                                  `/product/img/${encodedImageName}${img.img[newIndex]}`
                                );
                                return newIndex;
                              });
                            }}
                          >
                            <img
                              src={`/product/img/${productName}${v}`}
                              alt=""
                            />
                          </figure>
                        );
                      }
                    })}
                  {img.sm.length > 0 && width >= 768 && (
                    <button
                      type="button"
                      className={styles.ProductInfoImgSmallBtn}
                      onClick={() => {
                        setPicNow((e) => {
                          const newIndex =
                            e + 1 > img.sm.length - 1 ? 0 : e + 1;
                          const encodedImageName =
                            encodeURIComponent(productName);
                          setDetailPic(
                            `/product/img/${encodedImageName}${img.img[newIndex]}`
                          );
                          return newIndex;
                        });
                      }}
                    >
                      <img src="/product/font/right(orange).png" alt="" />
                    </button>
                  )}
                </div>
              </div>
              <div className={`${styles.ProductInfoDetail}`}>
                <div className={styles.ProductInfoContent}>
                  <div className={styles.InfoFavoriteGroup}>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className={styles.FavoriteBtn}
                      onMouseEnter={() => setHeartHover(true)}
                      onMouseLeave={() => setHeartHover(false)}
                      onClick={() => {
                        handleAddFavorite();
                      }}
                    >
                      <img
                        src={`/product/font/${
                          heartHover || heartState
                            ? "heart-fill-big"
                            : "heart-big"
                        }.png`}
                        alt=""
                      />
                    </motion.button>
                    <h6>{heartState ? "已加入收藏" : "加入收藏"}</h6>
                  </div>
                  <h3 className={styles.InfoProductName}>
                    {productData?.name}
                  </h3>
                  <div className={styles.InfoRateGroup}>
                    {int !== "0" && dec !== "0" ? (
                      <>
                        {int > 0 &&
                          int <= 5 &&
                          [...Array(Number(int))].map((v, i) => (
                            <img
                              key={`starFill${i}`}
                              src="/product/font/star-fill.png"
                              alt=""
                            />
                          ))}
                        {int < 5 && (
                          <img
                            src={`/product/font/${
                              dec > 7
                                ? "star-fill"
                                : dec > 2
                                ? "star-half"
                                : "star"
                            }.png`}
                            alt=""
                          />
                        )}
                        {int < 4 &&
                          [...Array(4 - Number(int))].map((v, i) => (
                            <img
                              key={`star${i}`}
                              src="/product/font/star.png"
                              alt=""
                            />
                          ))}
                      </>
                    ) : (
                      <h5 style={{ color: "#f1d5b6" }}>商品目前尚無評價</h5>
                    )}
                  </div>
                  <div className={styles.InfoPriceGroup}>
                    <h5>{productDiscount > 0 ? `限時促銷價格：` : `價格：`}</h5>
                    <h4>NT$ {Number(productData?.price).toLocaleString()}</h4>
                    {productDiscount > 0 && <h4>NT$ {productData?.price}</h4>}
                  </div>
                  <div className={styles.InfoQtyGroup}>
                    <h5>購買數量</h5>
                    <button
                      className={styles.QtyMinus}
                      onClick={() => {
                        setAmount((prevAmount) =>
                          prevAmount - 1 <= 0 ? 1 : prevAmount - 1
                        );
                      }}
                    >
                      <img src="/product/font/minus.png" alt="" />
                    </button>
                    <input
                      type="number"
                      value={amount}
                      min={1}
                      max={999}
                      onChange={(e) => {
                        setAmount(() => {
                          const value = Number(e.target.value);
                          if (value >= 999) return 999;
                          if (value <= 0) return 1;
                          return value;
                        });
                      }}
                    />
                    <button
                      className={styles.QtyPlus}
                      onClick={() => {
                        setAmount((prevAmount) =>
                          prevAmount + 1 >= 999 ? 999 : prevAmount + 1
                        );
                      }}
                    >
                      <img src="/product/font/plus.png" alt="" />
                    </button>
                  </div>
                  <div className={styles.InfoBtnGroup}>
                    <button
                      className={btnHover ? "" : styles.BtnBuynow}
                      onClick={() => {
                        handleAddToCart(true);
                      }}
                      onMouseEnter={() => setBtnHover(true)}
                      onMouseLeave={() => setBtnHover(false)}
                    >
                      <h5>立即購買</h5>
                    </button>
                    <button
                      className={btnHover ? styles.BtnBuynow : ""}
                      onClick={handleAddToCart}
                    >
                      <h5>加入購物車</h5>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            {width < 768 && scrollY >= offset && (
              <nav
                className={`sticky-top ${
                  scrollY >= offset ? styles.StickyTop : styles.StickyTopOff
                }`}
              >
                <ul>
                  {productData?.full_info && (
                    <li>
                      <h5>
                        <Link
                          onClick={() => {
                            setFullInfo(true);
                          }}
                          href="#collapse-heading1"
                        >
                          商品介紹
                        </Link>
                      </h5>
                    </li>
                  )}
                  {(img.info || productData?.info_text) && (
                    <li>
                      <h5>
                        <Link
                          onClick={() => {
                            setInfoImg(true);
                          }}
                          href="#collapse-heading2"
                        >
                          商品詳細
                        </Link>
                      </h5>
                    </li>
                  )}
                  {productData?.spec && (
                    <li>
                      <h5>
                        <Link
                          onClick={() => {
                            setSpec(true);
                          }}
                          href="#collapse-heading3"
                        >
                          商品規格
                        </Link>
                      </h5>
                    </li>
                  )}
                </ul>
              </nav>
            )}
            <section
              ref={elementRef}
              className={`${styles.ProductDetail} accordion accordion-flush`}
              id=""
            >
              {productData?.full_info && (
                <div className={`accordion-item ${styles.AccordionItem}`}>
                  <div className="accordion-header" id="collapse-heading1">
                    <button
                      className={`accordion-button ${styles.AccordionButton}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse1"
                      aria-expanded="true"
                      aria-controls="collapse1"
                    >
                      <h5>商品介紹</h5>
                    </button>
                  </div>
                  <div
                    id="collapse1"
                    className={`accordion-collapse collapse show ${
                      fullInfo ? "show" : ""
                    }`}
                    aria-labelledby="collapse-heading1"
                  >
                    <div
                      className={`accordion-body ${styles.AccordionBody}`}
                      dangerouslySetInnerHTML={{
                        __html: productData?.full_info,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {(img.info || productData?.info_text) && (
                <div
                  className={`accordion-item ${styles.AccordionItem}`}
                  onClick={simulateClick}
                >
                  <div className="accordion-header" id="collapse-heading2">
                    <button
                      className={`accordion-button collapsed ${styles.AccordionButton}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                      aria-expanded="false"
                      aria-controls="collapse2"
                      ref={collapseRef}
                    >
                      <h5>商品詳細</h5>
                    </button>
                  </div>
                  <div
                    id="collapse2"
                    className={`accordion-collapse collapse ${
                      infoImg ? "show" : ""
                    }`}
                    aria-labelledby="collapse-heading2"
                  >
                    <div className={`accordion-body ${styles.AccordionBody}`}>
                      <figure>
                        {img.info &&
                          img.info.map((v, i) => (
                            <img
                              key={`infoPic${i}`}
                              src={`/product/img/${productName}${v}`}
                              alt=""
                            />
                          ))}
                      </figure>
                      <h6
                        dangerouslySetInnerHTML={{
                          __html: productData?.info_text,
                        }}
                      ></h6>
                    </div>
                  </div>
                </div>
              )}
              {productData?.spec && (
                <div className={`accordion-item ${styles.AccordionItem}`}>
                  <div className="accordion-header" id="collapse-heading3">
                    <button
                      className={`accordion-button collapsed ${styles.AccordionButton}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse3"
                      aria-expanded="false"
                      aria-controls="collapse3"
                    >
                      <h5>商品規格</h5>
                    </button>
                  </div>
                  <div
                    id="collapse3"
                    className={`accordion-collapse collapse ${
                      spec ? "show" : ""
                    }`}
                    aria-labelledby="collapse-heading3"
                  >
                    <div
                      className={`accordion-body ${styles.AccordionBody}`}
                      dangerouslySetInnerHTML={{
                        __html: productData?.spec,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              <div
                id="productRate"
                className={`accordion-item ${styles.AccordionItem} ${styles.ProductDetailRate}`}
              >
                <div className="accordion-header" id="collapse-heading4">
                  <button
                    className={`accordion-button ${styles.AccordionButton}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse4"
                    aria-expanded="true"
                    aria-controls="collapse4"
                  >
                    <h5>商品評價</h5>
                  </button>
                </div>
                <div
                  id="collapse4"
                  className="accordion-collapse collapse show"
                  aria-labelledby="collapse-heading4"
                >
                  <div className={`accordion-body ${styles.AccordionBody}`}>
                    <div className={`${styles.ScoreBarAndSetReviews} row g-3`}>
                      {rateData.date[0] !== null ? (
                        <div className={`${styles.ScoreBar} col-12 col-lg-6`}>
                          <div className={styles.Score}>
                            <h5>商品評價</h5>
                            <h2>{rateAvg}</h2>
                            <StarGroup rate={rateAvg} />
                          </div>
                          <div className={styles.StarBarGroup}>
                            {[...Array(5)].map((v, i) => (
                              <StarBar
                                key={`starBar${i}`}
                                index={5 - i}
                                rate={rateData["rate"]}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <h6 style={{ textAlign: "start" }}>商品目前尚無評價</h6>
                      )}

                      {user?.id > 0 && reviews && (
                        <div className={`${styles.SetReviews} col-12 col-lg-6`}>
                          <RateCard
                            rateNow={rateNow}
                            id={reviews.user_id}
                            productID={productID}
                            userName={reviews.user}
                            img={reviews.userImg}
                            rate={reviews.rating}
                            comment={reviews.comment}
                            goodNum={reviews.good}
                            date={reviews.updated_at_taipei}
                            mutate={mutate}
                          />
                        </div>
                      )}
                      {user?.id > 0 && history && !reviews && (
                        <div className={`${styles.SetReviews} col-12 col-lg-6`}>
                          <RateCard
                            history={history}
                            rateNow={rateNow}
                            id={userID}
                            productID={productID}
                            userName={userName}
                            img={userImg}
                            mutate={mutate}
                          />
                        </div>
                      )}
                    </div>
                    {rateData.date[0] !== null && (
                      <>
                        <div className={`${styles.RateCardGroup} row g-3`}>
                          <AnimatePresence initial={false}>
                            {rateData.rate &&
                              rateData.rate.map((v, i) => {
                                if (
                                  i < rate &&
                                  rateData.user[i] !== reviews?.user
                                ) {
                                  return (
                                    <motion.div
                                      key={`rateCard${i}`}
                                      className="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0 }}
                                    >
                                      <RateCard
                                        id={rateData.userID[i]}
                                        productID={productID}
                                        userName={rateData.user[i]}
                                        img={rateData.img[i]}
                                        rate={v}
                                        comment={rateData.comment[i]}
                                        goodNum={rateData.good[i]}
                                        date={rateData.date[i]}
                                        mutate={mutate}
                                      />
                                    </motion.div>
                                  );
                                }
                              })}
                          </AnimatePresence>
                        </div>
                        {rateData.rate &&
                          rateData.rate.length - (reviews ? 1 : 0) > rate && (
                            <motion.button
                              type="button"
                              className={styles.RateMore}
                              onClick={() => {
                                setRate(
                                  rate +
                                    (width >= 1200 ? 3 : width >= 768 ? 2 : 1)
                                );
                                setIsVisible(true);
                              }}
                              whileTap={{ y: 1 }}
                            >
                              顯示更多評價
                            </motion.button>
                          )}
                        {rateData.rate &&
                          rateData.rate.length >
                            (width >= 1200 ? 3 : width >= 768 ? 2 : 1) &&
                          rateData.rate.length <= rate && (
                            <button
                              type="button"
                              className={styles.RateMore}
                              onClick={() => {
                                setRate(
                                  width >= 1200 ? 3 : width >= 768 ? 2 : 1
                                );
                                setIsVisible(false);
                              }}
                            >
                              隱藏額外評價
                            </button>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <section className={styles.AlsoBuy}>
              <h4 className={styles.AlsoBuyTitle}>其他人也買了...</h4>
              <div className={styles.AlsoBuyContent}>
                <button
                  type="button"
                  className={styles.ProductInfoImgSmallBtn}
                  onClick={() => {
                    setAlso(also - 1 < 0 ? also : also - 1);
                  }}
                >
                  <img src="/product/font/left(orange).png" alt="" />
                </button>
                <AnimatePresence initial={false}>
                  <ul className={`${styles.AlsoBuyList} row`}>
                    {sameBuy.length > 0 &&
                      sameBuy?.map((v, i) => {
                        if (i < CardInt + also && i >= also) {
                          return (
                            <motion.div
                              key={`Card${i}`}
                              className="col"
                              style={{ padding: 0 }}
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
                </AnimatePresence>
                <button
                  type="button"
                  className={styles.ProductInfoImgSmallBtn}
                  onClick={() => {
                    setAlso(
                      also + 1 > sameBuy.length - CardInt ? also : also + 1
                    );
                  }}
                >
                  <img src="/product/font/right(orange).png" alt="" />
                </button>
              </div>
            </section>
            <section className={styles.OtherLike}>
              <h4 className={styles.OtherLikeTitle}>看看其他好物...</h4>
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
                <AnimatePresence initial={false}>
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
                </AnimatePresence>
                <button
                  type="button"
                  className={styles.ProductInfoImgSmallBtn}
                  onClick={() => {
                    setHot(hot + 1 > hotSale.length - CardInt ? hot : hot + 1);
                  }}
                >
                  <img src="/product/font/right(orange).png" alt="" />
                </button>
              </div>
            </section>
          </>
        )}
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
    </>
  );
}
