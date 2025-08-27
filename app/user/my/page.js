"use client";

import React from "react";
import { List } from "semantic-ui-react";
import Link from "next/link"; // 使用 Next.js 的 Link 元件
import { usePathname } from "next/navigation";
import Header from "../components/layout/header";

export default function MyMenu() {
  const pathname = usePathname();
  const menuItems = [
    { name: "會員資料", path: "/my/settings" },
    { name: "訂單紀錄", path: "/orders" },
    { name: "我的優惠", path: "/my/coupons" },
    { name: "我的收藏", path: "/my/favorite" },
    { name: "我的文章", path: "/my/posts" },
    { name: "修改密碼", path: "/my/password" },
  ];

  return (
    <>
      <Header />
      <div className="menu-container">
        <List animated selection>
          {menuItems.map((menuItem) => (
            <List.Item key={menuItem.path} active={menuItem.path === pathname}>
              <Link href={menuItem.path}>{menuItem.name}</Link>
            </List.Item>
          ))}
        </List>
      </div>
    </>
  );
}
