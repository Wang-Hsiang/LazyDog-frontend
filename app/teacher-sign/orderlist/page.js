"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/app/components/layout/header";
import My from "../_components/my";
import Orderlist from "../_components/orderlist";

export default function PlacePage() {
  return (
    <>
      <Header />
      <div className="container lumi-all-wrapper">
        <div className="row">
          <My />
          <Orderlist />
        </div>
      </div>
    </>
  );
}
