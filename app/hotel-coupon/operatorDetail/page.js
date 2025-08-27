"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/modules/operatorCamera.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/header";
import My from "../../components/hotel/my";
import { read } from "@popperjs/core";
import Swal from "sweetalert2"; 
export default function OperatorDetailPage() {
  const modalRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  const [operatorInfo, setOperatorInfo] = useState({
    name: "",
    license: "",
    phone: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      setOperatorInfo({
        name: user?.name || "未提供",
        license: user?.business_license_number || "未提供",
        phone: user?.phone || "未提供",
        email: user?.email || "未提供",
        company: user?.company_name || "未提供",
      });
    }
  }, [user]);
  // 保 Bootstrap 初始化
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js")
        .then((bootstrap) => {
          if (modalRef.current) {
            modalRef.current.modalInstance = new bootstrap.Modal(
              modalRef.current
            );
          }
        })
        .catch((err) => console.error("Bootstrap 加載失敗：", err));
    }
  }, []);

  // 開啟 Modal
  const openModal = () => {
    if (modalRef.current?.modalInstance) {
      modalRef.current.modalInstance.show();
    } else {
      console.error("Modal 尚未初始化");
    }
  };

  //  關閉 Modal
  const closeModal = () => {
    if (modalRef.current?.modalInstance) {
      modalRef.current.modalInstance.hide();
    } else {
      console.error("無法關閉 Modal，modalInstance 尚未初始化");
    }
  };

  // 更新表單內容
  const handleInputChange = (e) => {
    setOperatorInfo({ ...operatorInfo, [e.target.name]: e.target.value });
  };

  // 儲存變更
  const saveChanges = () => {
    console.log("已更新：", operatorInfo);
    closeModal();
  };

  //  跳轉頁面
  const changepage = (path) => {
    if (path) {
      router.push(`/hotel-coupon/${path}`);
    }
  };

  return (
    <>
      <Header />
      <div className={`container ${styles.wrapper}`}>
        <div className="row">
          {/* 左邊 */}
          <My />
          <div className="col-12 col-md-9">
            <div className="card p-4">
              <h5 className="mb-4">負責人資訊</h5>
              <div className="row">
                <div className="col-md-6">
                  <label className="fw-bold">
                    姓名 <span style={{ color: "red" }}>*</span>
                  </label>
                  <p className="form-control-plaintext border-bottom">
                    {operatorInfo.name}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="fw-bold">
                    許可證號 <span style={{ color: "red" }}>*</span>
                  </label>
                  <p className="form-control-plaintext border-bottom">
                    {operatorInfo.license}
                  </p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="fw-bold">
                    電話 <span style={{ color: "red" }}>*</span>
                  </label>
                  <p className="form-control-plaintext border-bottom">
                    {operatorInfo.phone}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="fw-bold">
                    信箱 <span style={{ color: "red" }}>*</span>
                  </label>
                  <p className="form-control-plaintext border-bottom">
                    {operatorInfo.email}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <label className="fw-bold">公司名稱</label>
                <p className="form-control-plaintext border-bottom">
                  {operatorInfo.company}
                </p>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className={`btn me-2 ${styles.btn2}`}
                  onClick={openModal}
                >
                  編輯
                </button>
                <button type="button" className={`btn ${styles.btn}`}>
                  刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 結構 */}
      <div
        ref={modalRef}
        className="modal fade"
        id="editModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">編輯負責人資訊</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <label>姓名：</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={operatorInfo.name}
                onChange={handleInputChange}
              />

              <label className="mt-2">許可證號：</label>
              <input
                type="text"
                className="form-control"
                name="license"
                value={operatorInfo.license}
                onChange={handleInputChange}
                readOnly
              />

              <label className="mt-2">電話：</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={operatorInfo.phone}
                onChange={handleInputChange}
              />

              <label className="mt-2">信箱：</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={operatorInfo.email}
                onChange={handleInputChange}
                readOnly
              />

              <label className="mt-2">公司名稱：</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={operatorInfo.company}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn ${styles.btn2}`}
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className={`btn ${styles.btn}`}
                onClick={saveChanges}
              >
                儲存變更
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
