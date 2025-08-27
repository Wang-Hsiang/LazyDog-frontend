"use client";

import React, { useState, useEffect } from "react";

export default function CartCartcoupon(props) {
  return (
    <>
      <div className="mb-3 d-flex justify-content-center">
        <select
          name="coupon"
          id="couponSelect"
          className="form-select w-auto ms-2"
        >
          <option value>請選擇優惠捲</option>
          <option value="discount10">10% 折扣</option>
          <option value="discount20">20% 折扣</option>
          <option value="freeShipping">免運費</option>
        </select>
      </div>
      ;
    </>
  );
}
