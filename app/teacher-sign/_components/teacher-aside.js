'use client'

import React, { useState, useEffect } from 'react'
import styles from "../css/aside.module.css"

export default function TeacherAside() {
  return (
    <>
      <div className={`col-lg-3 col-md-12 col-12`}>
              <div className={`border ${styles.left}`}>
                  <div className={`text-center p-5 ${styles.top}`}>
                    <div className={`position-relative d-inline-block ${styles.camera}`}>
                      <img src="/course/img/25 (1).jpeg" className={`rounded-circle ${styles.avatarImg}`} alt="User Avatar" />
                      {/* 相機按鈕Dropdown) */}
                      <div className={styles.dropdown}>
                        <button className={`btn btn-light  p-0 ${styles.cameraIcon}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <img src="/course/img/camera.png" alt="相機" className={styles.cameraIconImg} />
                        </button>
                        <ul className={`dropdown-menu`}>
                          <li>
                            <button className={`dropdown-item text-danger`} id="deletePhoto">
                              刪除照片
                            </button>
                          </li>
                          <li>
                            <label htmlFor="uploadPhoto" className={`dropdown-item`}>上傳照片</label>
                            <input type="file" id="uploadPhoto" accept="image/*" className={`d-none`} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h5 className={`m-3 ${styles.tName}`}>陳大方</h5>
                    <p className={`text-muted ${styles.tGmail}`}>165846hote@gmail.com</p>
                    <button className={`btn btn-outline btn-sm ${styles.outline}`}>已認證</button>
                  </div>
                  <ul className={`list-unstyled text-start m-0`}>
                  <li className={` ${styles.lis}`}>
                      <a href="/teacher-sign/info" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi-book-fill fs-6  ${styles.icons}`}></i>我的師資
                      </a>
                    </li>
                    <li className={`${styles.lis}`}>
                      <a href="/teacher-sign/list" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi-calendar-week fs-6  ${styles.icons}`}></i>我的課程
                      </a>
                    </li>
                    <li className={`${styles.lis}`}>
                      <a href="/teacher-sign/" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi bi-chat-left-heart fs-6  ${styles.icons}`}></i>課程評論
                      </a>
                    </li>
                    <li className={`${styles.lis}`}>
                      <a href="/teacher-sign/place" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi-building-fill fs-6  ${styles.icons}`}></i>開課地點
                      </a>
                    </li>
                    <li className={`${styles.lis}`}>
                      <a href="/teacher-sign/" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi-person-fill fs-5  ${styles.icons}`}></i>會員資料
                      </a>
                    </li>
                    <li className={`${styles.lis}`}>
                      <a href="/home" className={`text-decoration-none ${styles.liText}`}>
                      <i className={`bi bi-box-arrow-right fs-5  ${styles.icons}`}></i>登出
                      </a>
                    </li>
                  </ul>
                </div>
      </div>
    </>
  )
}
