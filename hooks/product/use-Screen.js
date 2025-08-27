"use client";
import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // 初始化螢幕大小
      handleResize();

      // 監聽螢幕大小變化
      window.addEventListener("resize", handleResize);

      // 清理事件監聽器
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return screenSize;
};

export default useScreenSize;
