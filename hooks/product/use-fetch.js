"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import useScreenSize from "./use-Screen";
import { useAuth } from "@/hooks/use-auth";

export function useListFetch() {
  const [newUrl, setNewUrl] = useState("http://localhost:5000/api/products");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortName, setSortName] = useState("條件排序");
  const [pageNow, setPageNow] = useState(1);
  const { width, height } = useScreenSize();
  // 改變網址函式
  const changeUrl = (newUrl) => {
    setNewUrl(newUrl);
    if (pageNow !== 1) {
      setPageNow(1);
    }
  };
  // 依條件觸發改變網址
  useEffect(() => {
    changeUrl(
      `http://localhost:5000/api/products?&min=${minPrice}&max=${maxPrice}${
        sortName == "↓商品名稱"
          ? "&sort=name"
          : sortName == "↑商品價格"
          ? "&sort=price"
          : sortName == "↓商品價格"
          ? "&sort=priceDown"
          : sortName == "↑上架時間"
          ? "&sort=update"
          : sortName == "↓上架時間"
          ? "&sort=updateDown"
          : ""
      }`
    );
  }, [minPrice, maxPrice]);

  // 宣告SWR fetch方式
  const fetcher = async (newUrl) => {
    try {
      const res = await fetch(newUrl);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得資料
  const { data, isLoading, error, mutate } = useSWR(newUrl, fetcher);
  const products = data?.data;
  const emptyMessage = data?.message;

  // 設定分頁
  let pages = "";
  if (products) pages = Math.ceil(products.length / 24);
  const product = products?.slice((pageNow - 1) * 24, pageNow * 24);
  const productLine = Math.ceil(product?.length / (width >= 768 ? 4 : 2));
  const int = width >= 1200 ? 4 : width >= 768 ? 3 : 2;
  return {
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
  };
}

export function useCategoryFetch() {
  const query = useSearchParams();
  const category = query.get("category");
  const [sortName, setSortName] = useState("條件排序");
  const [newUrl, setNewUrl] = useState(
    `http://localhost:5000/api/products/category?category=${category}${
      sortName == "↓商品名稱"
        ? "&sort=name"
        : sortName == "↑商品價格"
        ? "&sort=price"
        : sortName == "↓商品價格"
        ? "&sort=priceDown"
        : sortName == "↑上架時間"
        ? "&sort=update"
        : sortName == "↓上架時間"
        ? "&sort=updateDown"
        : ""
    }`
  );
  const [keyword, setKeyword] = useState({
    主分類: [],
    種類: [],
    適用年齡: [],
    功能: [],
    口味: [],
    穀類: [],
    適用體型: [],
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [pageNow, setPageNow] = useState(1);
  const { width, height } = useScreenSize();
  // 改變網址函式
  const changeUrl = (newUrl) => {
    setNewUrl(newUrl);
    if (pageNow !== 1) {
      setPageNow(1);
    }
  };
  // 依條件觸發改變網址
  useEffect(() => {
    if (
      keyword?.主分類.length == 0 &&
      keyword?.種類.length == 0 &&
      keyword?.適用年齡.length == 0 &&
      keyword?.功能.length == 0 &&
      keyword?.口味.length == 0 &&
      keyword?.穀類.length == 0 &&
      keyword?.適用體型.length == 0
    ) {
      changeUrl(
        `http://localhost:5000/api/products/category?category=${category}&min=${minPrice}&max=${maxPrice}${
          sortName == "↓商品名稱"
            ? "&sort=name"
            : sortName == "↑商品價格"
            ? "&sort=price"
            : sortName == "↓商品價格"
            ? "&sort=priceDown"
            : sortName == "↑上架時間"
            ? "&sort=update"
            : sortName == "↓上架時間"
            ? "&sort=updateDown"
            : ""
        }`
      );

      return;
    } else {
      changeUrl(
        `http://localhost:5000/api/products/search?category=${category}&main=${keyword?.主分類.join(
          ","
        )}&type=${keyword?.種類.join(",")}&age=${keyword?.適用年齡.join(
          ","
        )}&feature=${keyword?.功能.join(",")}&flavor=${keyword?.口味.join(
          ","
        )}&cereal=${keyword?.穀類.join(",")}&size=${keyword?.適用體型.join(
          ","
        )}&min=${minPrice}&max=${maxPrice}${
          sortName == "↓商品名稱"
            ? "&sort=name"
            : sortName == "↑商品價格"
            ? "&sort=price"
            : sortName == "↓商品價格"
            ? "&sort=priceDown"
            : sortName == "↑上架時間"
            ? "&sort=update"
            : sortName == "↓上架時間"
            ? "&sort=updateDown"
            : ""
        }`
      );
    }
  }, [keyword, minPrice, maxPrice]);
  // 宣告SWR fetch方式
  const fetcher = async (newUrl) => {
    try {
      const res = await fetch(newUrl);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得資料
  const { data, isLoading, error, mutate } = useSWR(newUrl, fetcher);
  const products = data?.data;
  const emptyMessage = data?.message;
  // 設定分頁
  let pages = "";
  if (products) pages = Math.ceil(products.length / 24);
  const product = products?.slice((pageNow - 1) * 24, pageNow * 24);
  const productLine = Math.ceil(product?.length / (width >= 768 ? 4 : 2));
  const int = width >= 1200 ? 4 : width >= 768 ? 3 : 2;
  return {
    width,
    products,
    int,
    productLine,
    emptyMessage,
    category,
    keyword,
    setKeyword,
    newUrl,
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
  };
}

export function useDetailFetch(PID) {
  const { width, height } = useScreenSize();
  const { user } = useAuth();
  const query = useSearchParams();
  const product = PID ? PID : query.get("productID");
  const router = useRouter();
  const loginRoute = "/login";
  const [picNow, setPicNow] = useState(0);
  const [rate, setRate] = useState(3);
  const [amount, setAmount] = useState(1);
  const [detailPic, setDetailPic] = useState("/product/img/default.webp");
  // 宣告SWR url來源
  const url = product ? `http://localhost:5000/api/products/${product}` : null;
  const url2 =
    user?.id > 0
      ? `http://localhost:5000/api/products/order?userID=${user.id}`
      : `http://localhost:5000/api/products/order`;
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得商品資料
  const { data, isLoading, error, mutate } = useSWR(url, fetcher);
  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
    mutate: orderMutate,
  } = useSWR(url2, fetcher);
  const productData = data?.data[0];
  const productID = productData?.productID;
  const productName = productData?.name;
  // 撈出圖片資料
  const img = {
    list: [],
    img: [],
    sm: [],
    info: [],
  };
  if (productData) {
    img["list"].push(productData?.listImg);
    img["img"] = (productData?.img).split(",");
    if (productData?.smImg) img["sm"] = (productData?.smImg).split(",");
    if (productData?.infoImg) img["info"] = (productData?.infoImg).split(",");
  }
  const productDiscount = 0;
  // 撈出評論資料
  const rateData = {
    userID: [],
    user: [],
    img: [],
    rate: [],
    comment: [],
    good: [],
    date: [],
  };
  let rateAvg = 0;
  if (data?.data) {
    data?.data.map((v, i) => {
      rateData["userID"].push(v.userID);
      rateData["user"].push(v.user);
      rateData["img"].push(v.userImg);
      rateData["rate"].push(v.rate);
      rateData["comment"].push(v.comment);
      rateData["good"].push(v.good);
      rateData["date"].push(v.commentTime);
    });
    let rateSum = 0;
    for (let i = 0; i < rateData["rate"].length; i++) {
      rateSum += rateData["rate"][i];
    }
    rateAvg = (rateSum / rateData["rate"].length).toFixed(1);
  }
  let int, dec;
  if (rateAvg) {
    [int, dec] = rateAvg.toString().split(".");
    if (!dec) dec = 0;
  }
  // 使用SWR獲得歷史訂單資料
  const orders = orderData?.data;
  const userName = orderData?.userName;
  const userImg = orderData?.userImg;
  const [history, setHistory] = useState(false);
  useEffect(() => {
    if (orderData?.history.includes(productID)) setHistory(true);
  }, [orderData]);
  // 撈出熱銷商品資料
  const hotSale = useMemo(() => {
    const result = [];
    orders?.forEach((v, i) => {
      if (i < 10) result.push(v.productID);
    });
    return result;
  }, [orders]);
  // 撈出同類商品熱銷資料
  const sameBuy = useMemo(() => {
    const result = [];
    const sameCategory = data?.data[0]?.productID?.slice(0, 6);
    orders?.forEach((v) => {
      if (result.length < 10 && v.productID.includes(sameCategory)) {
        result.push(v.productID);
      }
    });
    return result;
  }, [orders, data]);
  // 設定卡片數量
  const CardInt = width >= 1200 ? 5 : width >= 992 ? 4 : width >= 768 ? 3 : 2;
  // 設定預設圖片與圖片錯誤處理
  useEffect(() => {
    if (productName) {
      const newImage = new Image();
      const encodedImageName = encodeURIComponent(productName);
      newImage.src = `/product/img/${encodedImageName}${img.img[picNow]}`;
      newImage.onload = () => setDetailPic(newImage.src);
      newImage.onerror = () => setDetailPic("/product/img/default.webp");
    }
  }, [productName]);
  return {
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
  };
}

export function useCardFetch({ productID = "" }) {
  const router = useRouter();
  const loginRoute = "/login";
  const { width, height } = useScreenSize();
  // 宣告SWR url來源
  const url = productID
    ? `http://localhost:5000/api/products/${productID}`
    : null;
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得商品資料
  const { data, isLoading, error, mutate } = useSWR(url, fetcher);
  const products = data?.data[0];
  const productName = products?.name;

  const [cardHover, setCardHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [eyeHover, setEyeHover] = useState(false);
  const [cartRate, setCartRate] = useState(0);

  // 設定卡片預設圖片與圖片錯誤處理
  const [cardPic, setCardPic] = useState("/product/img/default.webp");
  useEffect(() => {
    if (productName) {
      const img = new Image();
      const encodedImageName = encodeURIComponent(productName);
      img.src = `/product/img/${encodedImageName}_(1).webp`;
      img.onload = () => setCardPic(img.src);
      img.onerror = () =>
        setCardPic(`/product/img/${encodedImageName}_(1).webp`);
    }
  }, [productName]);
  // 模擬點擊
  const cardRef = useRef(null);
  const simulateClick = (e) => {
    if (e.target.dataset.clickable) {
      if (cardRef.current) {
        cardRef.current.click();
      }
    }
  };

  return {
    width,
    productID,
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
  };
}

export function useAsideFetch({
  changeUrl = () => {},
  keyword = "",
  setKeyword = () => {},
  minPrice = 0,
  maxPrice = 30000,
  setMaxPrice = () => {},
  setMinPrice = () => {},
  sortName = "條件排序",
}) {
  const pathname = usePathname();
  const query = useSearchParams();
  // 宣告SWR url來源
  const url = "http://localhost:5000/api/products/categoryName";
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得分類資料
  const { data, isLoading, error, mutate } = useSWR(url, fetcher);
  const categorys = data?.data;
  const categoryName = [];
  const category = {};
  const categoryClass = [];
  if (categorys) {
    categorys.map((v, i) => {
      if (!categoryName.includes(v.category)) {
        categoryName.push(v.category);
        category[v.category] = [];
      }
      category[v.category].push(v);
    });
  }
  if (category) {
    categoryName.forEach((v, i) => {
      categoryClass[i] = [];
      category[v].map((v) => {
        if (!categoryClass[i].find((e) => e == v.class)) {
          categoryClass[i].push(v.class);
        }
      });
    });
  }
  const i = categoryName.findIndex((v) => v == query.get("category"));
  useEffect(() => {}, [pathname, query]);

  return {
    changeUrl,
    keyword,
    setKeyword,
    minPrice,
    maxPrice,
    setMaxPrice,
    setMinPrice,
    sortName,
    category,
    categoryName,
    categoryClass,
    i,
    pathname,
    query,
    mutate,
    isLoading,
    error,
  };
}

export function useReviewFetch({ productID = "", userID = "" }) {
  const router = useRouter();
  const loginRoute = "/login";
  const { width, height } = useScreenSize();
  // 宣告SWR url來源
  const url = userID
    ? `http://localhost:5000/api/products/reviews?userID=${userID}`
    : null;
  // 宣告SWR fetch方式
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  // 使用SWR獲得評論資料
  const {
    data: reviewData,
    isLoading: reviewLoading,
    error: reviewError,
    mutate: reviewMutate,
  } = useSWR(url, fetcher);
  const reviews = reviewData?.data?.find((v) => v.productID == productID);
  const userReviews = reviewData?.data;

  // 設定分頁
  const [pageNow, setPageNow] = useState(1);
  let pages = "";
  if (userReviews) pages = Math.ceil(userReviews.length / 10);
  const userReview = userReviews?.slice((pageNow - 1) * 10, pageNow * 10);
  return {
    width,
    reviews,
    userReviews,
    userReview,
    pages,
    pageNow,
    setPageNow,
    reviewMutate,
    reviewLoading,
    reviewError,
  };
}
