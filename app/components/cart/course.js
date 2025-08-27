"use client";

import React, { useState, useEffect } from "react";

export default function Hotel(props) {
  return (
    <>
      <div>
        <h6>
          課程名稱 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="category" required>
          <option value="">請選課程</option>
          <option value="single">小</option>
          <option value="double">中</option>
          <option value="triple">大</option>
          <option value="family">家庭</option>
        </select>
      </div>
      <div>
        <h6>
          課程梯次 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="category" required>
          <option value="">請選課程梯次</option>
          <option value="single">小</option>
          <option value="double">中</option>
          <option value="triple">大</option>
          <option value="family">家庭</option>
        </select>
      </div>
      <div>
        <h6>
          參加人數 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="category" required>
          <option value="">請選報名人數</option>
          <option value="single">1</option>
          <option value="double">2</option>
          <option value="triple">3</option>
          <option value="family">4</option>
        </select>
      </div>
      <div>
        <h6>
          年齡 <span style={{ color: "red" }}>*</span>
        </h6>
        <select name="category" required>
          <option value="">請選年齡</option>
          <option value="single">12-18</option>
          <option value="double">19-25</option>
          <option value="triple">26-40</option>
          <option value="family">41-65</option>
          <option value="family">66</option>
        </select>
      </div>
      <div>
        <h6>
          姓名 <span style={{ color: "red" }}>*</span>
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
        <h6>備註</h6>
        <input type="text" name="name" value="" onChange="" required />
      </div>
    </>
  );
}
