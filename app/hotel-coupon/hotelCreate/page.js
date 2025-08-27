"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "../../../styles/modules/operatorCamera.module.css";
import hotelStyles from "../../../styles/modules/operatorHotel.module.css";
import { useRouter } from "next/navigation";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import My from "../../components/hotel/my"
import Header from "../../components/layout/header";
import Menu from "../../components/hotel/menu";
export default function HotelEditPage(props) {
  const imageUploadRef = useRef(null);
  const [rooms, setRooms] = useState([
    { type: "", quantity: 0, price: "", extra: "" },
  ]);

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms([...rooms, { type: "", quantity: 0, price: "", extra: "" }]);
  };

  const removeRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const router = useRouter();
  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/hotel/hotel-images/page-image/Dog5.png");

  const changepage = (path) => {
    if (path) {
      router.push(`/hotel-coupon/${path}`);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* 左邊*/}
          {/* <Menu/> */}
          <My />

          {/* 右邊 */}
          <div className="col-12 col-md-9">
            <h3 className="mb-3">新增旅館</h3>
            <form>
              <div className={`section ${hotelStyles.suSection}`}>
                <h5>基本資訊</h5>
                <div className="mb-3">
                  <label className="form-label">旅館名稱 *</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">地址 *</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">電話 *</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>

              <div className={`section ${hotelStyles.suSection}`}>
                <h5>旅館圖片</h5>
                <div
                  id="imagePreviewContainer"
                  className="d-flex flex-wrap gap-3 mb-2"
                >
                  <div className={hotelStyles.suImageCard}>
                    <img
                      src="/hotel/hotel-uploads/11-room.webp"
                      alt="旅館圖片1"
                    />
                    <button type="button" className={hotelStyles.suDeleteBtn}>
                      &times;
                    </button>
                  </div>
                  <div className={hotelStyles.suImageCard}>
                    <img
                      src="/hotel/hotel-uploads/6-s-room.jpg"
                      alt="旅館圖片2"
                    />
                    <button type="button" className={hotelStyles.suDeleteBtn}>
                      &times;
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={imageUploadRef}
                  className="form-control d-none"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-2"
                  onClick={uploadPhoto}
                >
                  + 新增圖片
                </button>
              </div>
              <div className={`section ${hotelStyles.suSection}`}>
                <h5>房型</h5>
                <div id="roomContainer">
                  {rooms.map((room, index) => (
                    <div
                      className="row g-2 align-items-center mb-2 room-entry"
                      key={index}
                    >
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          name="room_type"
                          placeholder="房型 (如大、中、小)"
                          value={room.type}
                          onChange={(e) =>
                            handleRoomChange(index, "type", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="number"
                          className="form-control"
                          name="room_quantity"
                          placeholder="數量"
                          value={room.quantity}
                          onChange={(e) =>
                            handleRoomChange(index, "quantity", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          name="room_price"
                          placeholder="金額"
                          value={room.price}
                          onChange={(e) =>
                            handleRoomChange(index, "price", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-md-3 d-flex">
                        <input
                          type="text"
                          className="form-control"
                          name="room_extra"
                          placeholder="訂金"
                          value={room.extra}
                          onChange={(e) =>
                            handleRoomChange(index, "extra", e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2 remove-room"
                          onClick={() => removeRoom(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-2"
                  id="addRoom"
                  onClick={addRoom}
                >
                  + 新增房型
                </button>
              </div>

              <div className={`section ${hotelStyles.suSection}`}>
                <h5>營業時間</h5>
                <div className="mb-3">
                  <label className="form-label">營業時間</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="營業時間"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">最早入住時間</label>
                  <input type="time" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">最晚退房時間</label>
                  <input type="time" className="form-control" required />
                </div>
              </div>
              <div className={`section ${hotelStyles.suSection}`}>
                <h5>其他資訊</h5>
                <div className="mb-3">
                  <label className="form-label">標籤</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="如: 寵物友善, 免費早餐"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">旅館簡介</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">注意事項</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className={`btn  btn-sm px-4  ${hotelStyles.suBtnSecondary}`}
                  onClick={() => changepage("hotel")}
                >
                  返回
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm px-4 ${hotelStyles.suBtnSuccess}`}
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
