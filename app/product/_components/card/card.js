"use client";

import React, { useState, useEffect } from "react";
import styles from "./card.module.css";
import Link from "next/link";

import Swal from "sweetalert2";
import { MoonLoader } from "react-spinners";
import * as motion from "motion/react-client";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useCardFetch, useDetailFetch } from "@/hooks/product/use-fetch";
import {
  CardFavoriteProvider,
  useCardFavorite,
} from "@/hooks/product/use-favorite";

export default function CardPage({
  productID = "",
  favorite = [],
  setFavorite = () => {},
}) {
  return (
    <CardFavoriteProvider
      productID={productID}
      favorite={favorite}
      setFavorite={setFavorite}
    >
      <CardContent productID={productID} />
    </CardFavoriteProvider>
  );
}

function CardContent({ productID = "" }) {
  const { user } = useAuth();
  const { onAddProduct, productItems } = useCart();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const newCount = productItems?.filter((v) => v.productID == productID);
    if (newCount && newCount[0]?.count !== undefined) {
      if (productCount !== newCount[0].count) {
        setProductCount(newCount[0].count);
      }
    }
  }, [productItems]);
  const {
    width,
    router,
    loginRoute,
    products,
    productName,
    cardHover,
    setCardHover,
    cartHover,
    setCartHover,
    eyeHover,
    setEyeHover,
    cartRate,
    setCartRate,
    cardPic,
    setCardPic,
    cardRef,
    simulateClick,
    mutate,
    isLoading,
    error,
  } = useCardFetch({ productID });
  const { detailPic, setDetailPic, img, picNow, setPicNow } =
    useDetailFetch(productID);
  const { setFavorite, heartHover, setHeartHover, heartState, setHeartState } =
    useCardFavorite();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
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
      setCartRate(cartRate + 1);
      onAddProduct(products, 1);
      // 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "加入購物車成功",
        showConfirmButton: false,
        timer: 1000, // 1.5 秒後自動關閉
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "加入購物車失敗",
        text: "請稍後重試！",
      });
    }
  };

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
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
          // text: `${productName} 已成功加入收藏！`,
          showConfirmButton: false,
          timer: 1000, // 1.5 秒後自動關閉
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "取消收藏成功",
          // text: `${productName} 已成功取消收藏！`,
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
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // 在組件卸載時清除 interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <>
      {isLoading ? (
        <li
          className={`${styles.ProductCard} col`}
          style={{
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoonLoader color="#f5842b" speedMultiplier={1} />
        </li>
      ) : (
        <>
          <li className={`${styles.ProductCard} col`}>
            <motion.div
              layout
              style={{
                translate: isOn ? "" : !isOn && cardHover ? "0 -10px" : "",
                width: isOn ? width : "",
                height: isOn ? "100vh" : "",
                position: isOn ? "fixed" : "",
                display: isOn ? "flex" : "",
                justifyContent: isOn ? "center" : "",
                alignItems: isOn ? "center" : "",
                top: isOn ? "0%" : "",
                left: isOn ? "0%" : "",
                zIndex: isOn ? "999" : "",
              }}
              onClick={toggleSwitch}
            >
              <motion.div
                layout
                style={{
                  display: isOn ? "flex" : "",
                  justifyContent: isOn ? "center" : "",
                  flexDirection: isOn ? "column" : "",
                  background: isOn ? "#ffffff" : "",
                  boxShadow: isOn ? "0px 0px 10px rgba(0, 0, 0, 0.2)" : "",
                  borderRadius: isOn ? "15px" : "",
                  overflow: isOn ? "hidden" : "",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  layout
                  style={{
                    display: isOn ? "none" : "",
                  }}
                  className={
                    cardHover
                      ? styles.ProductCardHeartOff
                      : styles.ProductCardHeart
                  }
                >
                  <img
                    src={`/product/font/${
                      heartState ? "heart-fill" : "heart"
                    }.png`}
                    alt=""
                  />
                </motion.div>
                <motion.div
                  layout
                  style={{
                    display: isOn ? "none" : "",
                  }}
                  className={
                    cardHover
                      ? styles.ProductCardCartOff
                      : (productCount ?? 0) > 0 || (cartRate ?? 0) > 0
                      ? styles.ProductCardCart
                      : styles.ProductCardCartOff
                  }
                >
                  <img src={`/product/font/cart-fill-big.png`} alt="" />
                  <p>{productCount > 0 ? productCount : cartRate}</p>
                </motion.div>
                <motion.figure
                  layout
                  style={{
                    width: isOn && width >= 768 ? "400px" : isOn ? "250px" : "",
                    position: isOn ? "relative" : "",
                  }}
                  className={styles.ProductCardImg}
                >
                  {!isOn && productName && (
                    <img
                      src={cardPic}
                      alt=""
                      onError={() => setCardPic("/product/img/default.webp")}
                    />
                  )}
                  {isOn && (
                    <div className={`${styles.ProductInfoImgGroup} col`}>
                      <motion.figure
                        layout
                        style={{
                          marginLeft: isOn ? "0px" : "",
                        }}
                        className={styles.ProductInfoImg}
                      >
                        {detailPic == "/product/img/default.webp" ? (
                          <div
                            style={{
                              width: width >= 768 ? "400px" : "250px",
                              height: width >= 768 ? "400px" : "250px",
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
                          <img
                            src={detailPic}
                            alt=""
                            onError={() =>
                              setDetailPic("/product/img/default.webp")
                            }
                          />
                        )}
                      </motion.figure>
                      <div
                        className={styles.ProductInfoImgSmall}
                        style={{ gap: width >= 768 ? "2px" : "1px" }}
                      >
                        {img.sm &&
                          img.sm.map((v, i) => {
                            if (i < (width < 768 ? 4 : 5)) {
                              return (
                                <figure
                                  key={`smPic${i}`}
                                  style={{
                                    maxWidth: width >= 768 ? "100px" : "67px",
                                  }}
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
                      </div>
                    </div>
                  )}
                  {isOn && (
                    <motion.div
                      layout
                      style={{
                        display: isOn ? "flex" : "none",
                        flexDirection: isOn ? "column" : "",
                        position: isOn ? "absolute" : "",
                        top: isOn ? "0" : "",
                        right: isOn ? "0" : "",
                        padding: isOn ? "10px 5px" : "",
                        gap: isOn ? "7px" : "",
                      }}
                    >
                      <button
                        type="button"
                        className={`${styles.HoverIcon} `}
                        onMouseEnter={() => setHeartHover(true)}
                        onMouseLeave={() => setHeartHover(false)}
                        onClick={(e) => {
                          handleAddFavorite(e);
                        }}
                      >
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          src={`/product/font/${
                            heartHover || heartState
                              ? "heart-fill-big"
                              : "heart-big"
                          }.png`}
                          alt=""
                        />
                      </button>
                      <button
                        type="button"
                        className={`${styles.HoverIcon} ${
                          cartRate > 0 ? styles.CartBtn : styles.CartBtnOff
                        }`}
                        onMouseEnter={() => setCartHover(true)}
                        onMouseLeave={() => setCartHover(false)}
                        onClick={(e) => {
                          handleAddToCart(e);
                        }}
                        style={{ paddingRight: isOn ? "9px" : "" }}
                      >
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          src={`/product/font/${
                            cartHover ? "cart-add" : "cart"
                          }.png`}
                          alt=""
                        />
                      </button>
                      <Link
                        onMouseEnter={() => {
                          const id = setInterval(() => {
                            setTimeout(() => {
                              setEyeHover((prev) => !prev);
                            }, 200);
                            setTimeout(() => {
                              setEyeHover((prev) => !prev);
                            }, 900);
                          }, 2000);
                          setIntervalId(id);
                        }}
                        onMouseLeave={() => {
                          if (intervalId) {
                            clearInterval(intervalId);
                            setIntervalId(null);
                          }
                        }}
                        href={`/product/detail?productID=${productID}`}
                        className={styles.HoverIcon}
                        ref={cardRef}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          src={`/product/font/${
                            eyeHover ? "listOff2" : "list"
                          }.png`}
                          alt=""
                        />
                      </Link>
                    </motion.div>
                  )}
                </motion.figure>
                <motion.div
                  layout
                  style={{
                    background: isOn ? "black" : "",
                    paddingTop: isOn ? "14px" : "",
                  }}
                  className={styles.ProductCardInfo}
                >
                  <motion.p
                    layout
                    style={{
                      maxWidth: isOn ? "360px" : "",
                      height: isOn ? "auto" : "",
                      color: isOn ? "white" : "",
                      fontSize: isOn ? "20px" : "",
                    }}
                    className={`${styles.ProductCardName} d-none d-xxl-flex`}
                  >
                    {productName}
                  </motion.p>
                  <motion.p
                    layout
                    style={{
                      maxWidth:
                        isOn && width >= 768 ? "360px" : isOn ? "210px" : "",
                      height: isOn ? "auto" : "",
                      color: isOn ? "white" : "",
                    }}
                    className={`${styles.ProductCardNameSm} d-xxl-none`}
                  >
                    {productName}
                  </motion.p>
                  <motion.h5
                    layout
                    style={{
                      color: isOn ? "#f6ce5b" : "",
                    }}
                    className={`${styles.ProductCardPrice} d-none d-xl-block`}
                  >
                    NT$ {Number(products?.price).toLocaleString()}
                  </motion.h5>
                  <motion.h5
                    layout
                    style={{
                      color: isOn ? "#f6ce5b" : "",
                    }}
                    className={`${styles.ProductCardPriceSm} d-xl-none`}
                  >
                    NT$ {Number(products?.price).toLocaleString()}
                  </motion.h5>
                </motion.div>
                <motion.div
                  layout
                  style={{
                    display: isOn ? "none" : "",
                  }}
                  className={`${
                    width > 1024
                      ? styles.ProductCardHover
                      : cardHover
                      ? styles.ProductCardClickOn
                      : styles.ProductCardClickOff
                  }`}
                  onClick={toggleSwitch}
                  onMouseEnter={() => setCardHover(true)}
                  onMouseLeave={() => setCardHover(false)}
                  data-clickable="true"
                >
                  <button
                    type="button"
                    className={`${styles.HoverIcon} `}
                    onMouseEnter={() => setHeartHover(true)}
                    onMouseLeave={() => setHeartHover(false)}
                    onClick={(e) => {
                      handleAddFavorite(e);
                    }}
                  >
                    <motion.img
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      src={`/product/font/${
                        heartHover || heartState
                          ? "heart-fill-big"
                          : "heart-big"
                      }.png`}
                      alt=""
                    />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    type="button"
                    className={`${styles.HoverIcon} ${
                      cartRate > 0 ? styles.CartBtn : styles.CartBtnOff
                    }`}
                    onMouseEnter={() => setCartHover(true)}
                    onMouseLeave={() => setCartHover(false)}
                    onClick={(e) => {
                      handleAddToCart(e);
                    }}
                    style={{ paddingRight: "9px" }}
                  >
                    <motion.img
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      src={`/product/font/${
                        cartHover ? "cart-add" : "cart"
                      }.png`}
                      alt=""
                    />
                  </motion.button>
                  <Link
                    onMouseEnter={() => {
                      const id = setInterval(() => {
                        setTimeout(() => {
                          setEyeHover((prev) => !prev);
                        }, 200);
                        setTimeout(() => {
                          setEyeHover((prev) => !prev);
                        }, 900);
                      }, 2000);
                      setIntervalId(id);
                    }}
                    onMouseLeave={() => {
                      if (intervalId) {
                        clearInterval(intervalId);
                        setIntervalId(null);
                      }
                    }}
                    href={`/product/detail?productID=${productID}`}
                    className={styles.HoverIcon}
                    ref={cardRef}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <motion.img
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      src={`/product/font/${
                        eyeHover ? "listOff2" : "list"
                      }.png`}
                      alt=""
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              layout
              style={{
                width: isOn ? width : "",
                height: isOn ? "100vh" : "",
                position: isOn ? "fixed" : "",
                top: isOn ? "0%" : "",
                left: isOn ? "0%" : "",
                zIndex: isOn ? "998" : "",
                background: isOn ? "rgba(0, 0, 0, 0.8)" : "",
                transition: "all 0.4s",
              }}
            ></motion.div>
          </li>
        </>
      )}
    </>
  );
}
