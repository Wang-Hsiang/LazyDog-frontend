"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function AppPage(props) {
  // redirect("/product/list");
  return (
    <div className="container">
      <img style={{ width: "100%" }} src="/product/404.png" />
    </div>
  );
}
