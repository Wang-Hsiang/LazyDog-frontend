import React, { useRef } from "react";
import styles from "../../../styles/modules/operatorCamera.module.css";
export default function ProfileCard  ({
  avatar,
  name,
  email,
  onUpload,
  onDelete,
  changepage,
}){
  const fileInputRef = useRef(null);

  return (
    <div className="d-none d-md-block col-md-3">
      <div className="card p-3 text-center">
        <div className="position-relative d-inline-block">
          <img
            src="/hotel/hotel-images/page-image/Dog2.png"
            alt="User Avatar"
            className={`rounded-circle ${styles.suAvatarImg}`}
          />
          <div className={styles.dropdownItem}>
            <button
              className={`btn btn-light ${styles.suCameraIcon}`}
              type="button"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src="/hotel/hotel-images/page-image/icon-camera.png"
                alt="相機"
                className={styles.suCameraIconImg}
              />
            </button>
            <input
              type="file"
              accept="image/*"
              className="d-none"
              ref={fileInputRef}
              onChange={onUpload}
            />
          </div>
        </div>
        <h5 className="mt-2">{name}</h5>
        <p className="text-muted">{email}</p>
        <button className="btn btn-outline-success btn-sm">已認證</button>
        <hr />
        <ul className="list-unstyled text-start">
          <li className="py-2" onClick={() => changepage("operatorDetail")}>
            <a
              className="text-decoration-none text-dark"
              style={{ cursor: "pointer" }}
            >
              負責人資訊
            </a>
          </li>
          <li className="py-2" onClick={() => changepage("hotel/${id}")}>
            <a
              className="text-decoration-none text-dark"
              style={{ cursor: "pointer" }}
            >
              旅館資訊
            </a>
          </li>
          <li className="py-2" onClick={() => changepage("review/${id}")}>
            <a
              className="text-decoration-none text-dark"
              style={{ cursor: "pointer" }}
            >
              旅館評論
            </a>
          </li>
          <li className="py-2" onClick={() => changepage("couponList")}>
            <a
              className="text-decoration-none text-dark"
              style={{ cursor: "pointer" }}
            >
              旅館優惠券
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

