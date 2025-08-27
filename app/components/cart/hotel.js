"use client";

import React, { useState, useEffect } from "react";

export default function Hotel(props) {
  return (
    <>
      <div className="">
        <h6>
          入住日期 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="date" name="birthday" value="" onChange="" required />
      </div>
      <div className="">
        <h6>
          退房日期 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="date" name="birthday" value="" onChange="" required />
      </div>
      <div>
        <h6>
          房型 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="category" required>
          <option value="">請選房型類別</option>
          <option value="single">小</option>
          <option value="double">中</option>
          <option value="triple">大</option>
          <option value="family">家庭</option>
        </select>
      </div>
      <div>
        <h6>
          主人姓名 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="text" name="name" value="" onChange="" required />
      </div>
      <div>
        <h6>
          手機 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="tel" name="phone" value="" onChange="" required />
      </div>
      <div>
        <h6>
          入住寵物姓名 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="text" name="name" value="" onChange="" required />
      </div>
      <div>
        <h6>
          入住寵物性別 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="gender" required>
          <option value="">請選寵物性別</option>
          <option value="male">男孩</option>
          <option value="female">女孩</option>
        </select>
      </div>
      <div>
        <h6>
          寵物身體狀況 <span style={{ color: "red" }}>*</span>
        </h6>
        <input type="text" name="name" value="" onChange="" required />
      </div>
      <div>
        <h6>備註</h6>
        <input type="text" name="name" value="" onChange="" required />
      </div>
    </>
  );
}
