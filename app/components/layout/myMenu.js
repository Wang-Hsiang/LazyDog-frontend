"use client";

import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/components/utils/firebase";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faTicket,
  faHeart,
  faPen,
  faCirclePlus,
  faRightFromBracket,
  faCamera,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/modules/menu.module.css";

export default function MyMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenu, setmobileMenu] = useState(false);
  const { user, logout, updateAvatar } = useAuth(); //  從 `useAuth` 獲取 `user` & `logout`
  const [profile, setProfile] = useState(null);

  //  監聽 `localStorage`，確保會員資訊即時更新
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    }
  }, [user]);

  const handleClick = () => {
    // 觸發檔案選擇框

    document.getElementById("avatarInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateAvatar(file);
      console.log(file);
    }
  };
  const handleLogout = async () => {
    try {
      console.log("執行登出...");
      await signOut(auth);
      logout(); //  清空
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setProfile(null); //  確保立即更新
      router.push("/login");
    } catch (error) {}
  };

  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/hotel/hotel-images/page-image/Dog5.png");

  const menuItems = [
    { name: "會員資料", path: "/user", icon: faUser },
    { name: "訂單紀錄", path: "/user/orders", icon: faCartShopping },
    { name: "我的優惠", path: "/user/profileCoupon", icon: faTicket },
    { name: "我的收藏", path: "/user/userFavorite", icon: faHeart },
    { name: "我的評論", path: "/user/review", icon: faComment },
    { name: "我的文章", path: "/user/my_article", icon: faPen },
    { name: "修改密碼", path: "/forgot-password", icon: faCirclePlus },
  ];

  // 點擊畫面其他地方時，自動關閉篩選選單
  useEffect(() => {
    const clickOutside = (event) => {
      if (
        mobileMenu &&
        !event.target.closest(`.${styles.asideContainer}`) &&
        !event.target.closest(`.${styles.filterButton}`)
      ) {
        setmobileMenu(false);
      }
    };

    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [mobileMenu]);

  return (
    <>
      {/* 手機版選單按鈕 */}
      <div className={`${styles.collapseAside} d-xl-none`}>
        <div className={`${styles.collapseAsideContent}`}>
          <button
            className={`btn d-md-none ${styles.right}`}
            onClick={() => setmobileMenu(!mobileMenu)}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterOffcanvas"
            aria-expanded="false"
            aria-controls="filterOffcanvas"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      {/* <div className="col-md-3 col-12"> */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="filterOffcanvas"
        aria-labelledby="filterOffcanvasLabel"
      >
        <div className="offcanvas-header">
          {/* <h5 className="offcanvas-title" id="filterOffcanvasLabel">
          篩選
        </h5> */}
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className={`text-center`}>
          {/*  顯示會員頭像與名稱 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="lumi-profile-section position-relative"
          >
            <input
              id="avatarInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* <h5 className="lumi-welcome">歡迎，{profile?.name || "會員"}！</h5> */}
            <div className={styles.CameradropdownItem}>
              {profile?.avatar ? (
                <img
                  ref={avatarRef}
                  src={profile?.avatar}
                  alt="User Avatar"
                  className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
                  width="50"
                />
              ) : (
                <img
                  ref={avatarRef}
                  src="http://localhost:5000/auth/Dog5.png"
                  alt="User Avatar"
                  className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
                  width="50"
                />
              )}
              <button
                className={`btn btn-light ${styles.suCameraIcon}`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/hotel/hotel-images/page-image/icon-camera.png"
                  alt="相機"
                  className={styles.suCameraIconImg}
                />
              </button>
              <ul className={`dropdown-menu ${styles.suDropdownMenu}`}>
                <li>
                  <button
                    className={`text-danger dropdown-item ${styles.suDropdownItem}`}
                    onClick={deletePhoto}
                  >
                    刪除照片
                  </button>
                </li>
                <li>
                  <label
                    onClick={handleClick}
                    className={`dropdown-item ${styles.dropdownItem}`}
                  >
                    上傳照片
                  </label>
                  <input
                    type="file"
                    id="uploadPhoto"
                    accept="image/*"
                    className="d-none"
                    ref={fileInputRef}
                    onChange={fileChange}
                  />
                </li>
              </ul>
            </div>
            <h5 className={`mb-4 ${styles.welcome}`}>
              歡迎，{profile?.name || "會員"}！
            </h5>
          </div>
          <hr className="mx-4" />
          <List animated selection>
            {menuItems.map((menuItem) => (
              <List.Item
                key={menuItem.path}
                active={menuItem.path === pathname}
                className={`${styles.item}`}
              >
                <Link className={`${styles.link}`} href={menuItem.path}>
                  <span>
                    <FontAwesomeIcon icon={menuItem.icon} />
                  </span>{" "}
                  {menuItem.name}
                </Link>
              </List.Item>
            ))}

            {/* Google & 一般會員通用登出按鈕 */}
            <List.Item className={`${styles.item}`} onClick={handleLogout}>
              <span>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>{" "}
              登出
            </List.Item>
          </List>
        </div>
      </div>
      <div className={`col-3 ${styles.asideContainer}`}>
        <div className={`${styles.container}`}>
          {/*  顯示會員頭像與名稱 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="lumi-profile-section position-relative"
          >
            <input
              id="avatarInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* <h5 className="lumi-welcome">歡迎，{profile?.name || "會員"}！</h5> */}
            <div className={styles.CameradropdownItem}>
              {profile?.avatar ? (
                <img
                  ref={avatarRef}
                  src={profile?.avatar}
                  alt="User Avatar"
                  className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
                  width="50"
                />
              ) : (
                <img
                  ref={avatarRef}
                  src="http://localhost:5000/auth/Dog5.png"
                  alt="User Avatar"
                  className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
                  width="50"
                />
              )}
              <button
                className={`btn btn-light ${styles.suCameraIcon}`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/hotel/hotel-images/page-image/icon-camera.png"
                  alt="相機"
                  className={styles.suCameraIconImg}
                />
              </button>
              <ul className={`dropdown-menu ${styles.suDropdownMenu}`}>
                <li>
                  <button
                    className={`text-danger dropdown-item ${styles.suDropdownItem}`}
                    onClick={deletePhoto}
                  >
                    刪除照片
                  </button>
                </li>
                <li>
                  <label
                    onClick={handleClick}
                    className={`dropdown-item ${styles.dropdownItem}`}
                  >
                    上傳照片
                  </label>
                  <input
                    type="file"
                    id="uploadPhoto"
                    accept="image/*"
                    className="d-none"
                    ref={fileInputRef}
                    onChange={fileChange}
                  />
                </li>
              </ul>
            </div>
            <h5 className={`mb-4 ${styles.welcome}`}>
              歡迎，{profile?.name || "會員"}！
            </h5>
          </div>
          <hr className="mx-4" />
          <List animated selection>
            {menuItems.map((menuItem) => (
              <List.Item
                key={menuItem.path}
                active={menuItem.path === pathname}
                className={`${styles.item}`}
              >
                <Link className={`${styles.link}`} href={menuItem.path}>
                  <span>
                    <FontAwesomeIcon icon={menuItem.icon} />
                  </span>{" "}
                  {menuItem.name}
                </Link>
              </List.Item>
            ))}

            {/* Google & 一般會員通用登出按鈕 */}
            <List.Item className={`${styles.item}`} onClick={handleLogout}>
              <span>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>{" "}
              登出
            </List.Item>
          </List>
        </div>
      </div>
    </>
  );
}
