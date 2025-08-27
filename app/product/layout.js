"use client";

import "./product.css";
import Header from "../components/layout/header";
import { FavoriteProvider } from "@/hooks/product/use-favorite";

export default function AppLayout({ children }) {
  return (
    <FavoriteProvider>
      <div className="PDLayout" suppressHydrationWarning>
        <Header />
        {children}
      </div>
    </FavoriteProvider>
  );
}
