"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import styles from "../css/CartList.module.css";
// import "../css/CartList.css";
import { useCart } from "@/hooks/use-cart";
import Header from "@/app/components/layout/header";
import Breadcrumb from "../../components/teacher/breadcrumb";
import Thead from "@/app/components/cart/thead";
import Other from "../../components/teacher/otherTeacher";
import OtherCourse from "@/app/components/cart/otherCourse";
import Link from "next/link";

import Card from "@/app/product/_components/card/card";
import * as motion from "motion/react-client";
import { useDetailFetch } from "@/hooks/product/use-fetch";
import { useDetailFavorite } from "@/hooks/product/use-favorite";

export default function CartListPage(props) {
  const {
    productItems = [],
    courseItems = [],
    hotelItems = [],
    totalProductAmount,
    totalProductQty,
    totalCourseAmount,
    totalCourseQty,
    totalHotelAmount,
    totalHotelQty,
    onIncrease,
    onDecrease,
    onRemove,
  } = useCart();

  const totalAmount = totalProductAmount + totalCourseAmount + totalHotelAmount;

  const teacherData = [
    {
      imgSrc: "/teacher-img/Zoe.png",
      col: "col-6 col-md-3",
      name: "Zoe",
      text: "寵物訓練",
      link: "/teacher/info",
    },
    {
      imgSrc: "/teacher-img/Zoe.png",
      col: "col-6 col-md-3",
      name: "Zoe",
      text: "寵物訓練",
      link: "/teacher/info",
    },
    {
      imgSrc: "/teacher-img/Zoe.png",
      col: "col-6 col-md-3",
      name: "Zoe",
      text: "寵物訓練",
      link: "/teacher/info",
    },
    {
      imgSrc: "/teacher-img/Zoe.png",
      col: "col-6 col-md-3",
      name: "Zoe",
      text: "寵物訓練",
      link: "/teacher/info",
    },
  ];

  const { CardInt, hotSale } = useDetailFetch();
  const { favorite, setFavorite } = useDetailFavorite();
  const [hot, setHot] = useState(0);

  return (
    <>
      <Header />
      <div>
        <div className={styles.cartImg}>
          <img src="/cart/cattlist.png" />
        </div>

        <div className={`container ${styles.height}`}>
          <Breadcrumb
            links={[
              { label: "首頁 ", href: "/" },
              {
                label: " 購物車",
                href: "/cart/CartList",
                active: true,
              },
            ]}
          />
          <div className={`${styles.customTable} row my-5 `}>
            <table className="col-lg-8 col-12 mb-5 ">
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
                              className={styles.img}
                              src={`/product/img/${encodeURIComponent(
                                cartItem.name
                              )}${imgName[0]}`}
                              alt={cartItem.name}
                            />
                          </td>
                          <td>{cartItem.name}</td>
                          <td>{Number(cartItem.price).toLocaleString()}</td>
                          <td className={`${styles.Btn}`}>
                            <button onClick={() => onIncrease(cartItem.id)}>
                              +
                            </button>
                            {cartItem.count}
                            <button onClick={() => onDecrease(cartItem.id)}>
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
                            className={styles.img}
                            src={`/course/img/${cartItem.img_url}`}
                            alt={cartItem.name}
                          />
                        </td>
                        <td>{cartItem.name}</td>
                        <td>{Number(cartItem.price).toLocaleString()}</td>
                        <td className={`${styles.Btn}`}>
                          <button onClick={() => onIncrease(cartItem.id)}>
                            +
                          </button>
                          {cartItem.count}
                          <button onClick={() => onDecrease(cartItem.id)}>
                            -
                          </button>
                        </td>
                        <td>{Number(cartItem.count * cartItem.price).toLocaleString()}</td>
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
                          <img src={cartItem.imageUrl} alt={cartItem.name} className={styles.img} />
                        </td>
                        <td>
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
                        <td>{Number(cartItem.price).toLocaleString()}</td>
                        <td className={`${styles.Btn}`}>
                          <button onClick={() => onIncrease(cartItem.id)}>
                            +
                          </button>
                          {cartItem.count}
                          <button onClick={() => onDecrease(cartItem.id)}>
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

            {/* 顯示摘要區 */}
            <aside className={`${styles.aside} col-lg-3 col-12 mb-5`}>
              <div className={`${styles.summary} aside-card mb-5`}>
                <h5 className="mb-4">訂單明細</h5>
                <div
                  className={`${styles.summaryItem} d-flex justify-content-between`}
                >
                  <span>商品小計</span>
                  <span>{`NT$ ${Number(
                    totalProductAmount
                  ).toLocaleString()}`}</span>
                </div>
                <div
                  className={`${styles.summaryItem} d-flex justify-content-between`}
                >
                  <span>課程小計</span>
                  <span>{`NT$ ${Number(
                    totalCourseAmount
                  ).toLocaleString()}`}</span>
                </div>
                <div
                  className={`${styles.summaryItem} d-flex justify-content-between`}
                >
                  <span>旅館小計</span>
                  <span>{`NT$ ${Number(
                    totalHotelAmount
                  ).toLocaleString()}`}</span>
                </div>
              </div>

              {/* 折扣區 */}
              <div
                className={`${styles.summaryItem} ${styles.summaryItem2} d-flex justify-content-between`}
              >
                <span>折扣金額</span>
                <span>-</span>
              </div>
              <div
                className={`${styles.summaryItem} ${styles.summaryItem2} d-flex justify-content-between`}
              >
                <span>總金額:</span>
                <span className={styles.totalmoney}>{`NT$ ${Number(
                  totalAmount
                ).toLocaleString()}`}</span>
              </div>

              {/* 結帳按鈕 */}
              <div className="d-flex justify-content-center pt-5 ">
                {courseItems.length > 0 ||
                hotelItems.length > 0 ||
                productItems.length > 0 ? (
                  <Link
                    className={`btn w-50 ${styles.btn}`}
                    href={{
                      pathname: "/cart/CartListPay",
                    }}
                  >
                    前往結帳
                  </Link>
                ) : (
                  <Link
                    className={`btn w-50 ${styles.btn}`}
                    href={{
                      pathname: "/product/list",
                    }}
                  >
                    還沒有商品 前往訂購
                  </Link>
                )}
              </div>
            </aside>
          </div>

          {/* 推薦商品區 */}
          <div className="main2">
            <div>
              <h4 className="mb-5">加購其他熱銷商品</h4>
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
                            layout
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
            </div>
            <hr className="mb-5" />
            <div>
              <h4 className="mb-5">看看其他精選課程 </h4>
              <OtherCourse />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
