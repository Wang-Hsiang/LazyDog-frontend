import React, { useState, useEffect } from "react";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { List } from "semantic-ui-react";
import Link from "next/link";
import styles from "../../../styles/modules/operatorCamera.module.css";
import style from "../../../styles/modules/menu.module.css"
export default function My() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenu, setmobileMenu] = useState(false);
  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/hotel/hotel-images/page-image/Dog5.png");

  const menuItems = [
    {
      name: "業者資訊",
      path: "/hotel-coupon/operatorDetail",
      icon: <i className="bi bi-person-fill me-2"></i>,
    },
    {
      name: "旅館資訊",
      path: `/hotel-coupon/hotel/${user.id}`,
      icon: <i className="bi bi-house-heart-fill me-2"></i>,
    },
    {
      name: "旅館評論",
      path: `/hotel-coupon/review/${user.id}`,
      icon: <i className="bi bi-card-list me-2"></i>,
    },
    {
      name: "旅館優惠",
      path: "/hotel-coupon/couponList",
      icon: <i className="bi bi-ticket-perforated me-2"></i>,
    },
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
      <div className={`${styles.collapseAside} d-lg-none`}>
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
        <div className={` p-3 text-center`}>
          <div className="text-center">
            <div className="position-relative d-inline-block">
              <img
                ref={avatarRef}
                src={user.avatar}
                alt="User Avatar"
                className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
              />

              <div className={styles.dropdownItem}>
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
                      onClick={uploadPhoto}
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
            </div>
            <h5 className="mt-2">{user?.name}</h5>
            <p className="text-muted">{user?.email}</p>
            <button
              className={`btn btn-outline-success btn-sm ${styles.suBtnSecondary}`}
            >
              已認證
            </button>
          </div>
          <hr />
          <List animated selection>
            {menuItems.map((menuItem) => (
              <List.Item
                key={menuItem.path}
                active={menuItem.path === pathname}
                className={`${style.item}`}
              >
                <Link className={`${style.link}`} href={menuItem.path}>
                  <span>{menuItem.icon}</span> {menuItem.name}
                </Link>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
      <div className={`col-3 ${styles.asideContainer}`}>
        <div className={` p-3 ${style.container}`}>
          <div className="text-center">
            <div className="position-relative d-inline-block">
              <img
                ref={avatarRef}
                src={user.avatar}
                alt="User Avatar"
                className={`mb-4 rounded-circle ${styles.suAvatarImg}`}
              />

              <div className={styles.dropdownItem}>
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
                      onClick={uploadPhoto}
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
            </div>
            <h5 className="mt-2">{user?.name}</h5>
            <p className="text-muted">{user?.email}</p>
            <button
              className={`btn btn-outline-success btn-sm ${styles.suBtnSecondary}`}
            >
              已認證
            </button>
          </div>
          <hr />
          <List animated selection>
            {menuItems.map((menuItem) => (
              <List.Item
                key={menuItem.path}
                active={menuItem.path === pathname}
                className={`${style.item}`}
              >
                <Link className={`${style.link}`} href={menuItem.path}>
                  <span>{menuItem.icon}</span> {menuItem.name}
                </Link>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
