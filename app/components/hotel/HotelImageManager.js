// "use client";

// import React from "react";
// import Swal from "sweetalert2";
// import hotelStyles from "../../../../styles/modules/operatorHotel.module.css";

// const HotelImageManager = ({ images, setImages, hotelId }) => {
//   const handleSetMainImage = async (imageId) => {
//     // 設為主圖片的邏輯
//   };

//   const handleDeleteImage = async (imageId) => {
//     // 刪除圖片的邏輯
//   };

//   const handleUploadImage = async (event) => {
//     // 上傳圖片的邏輯
//   };

//   return (
//     <div className="section">
//       <h5>旅館圖片</h5>
//       <div className="d-flex flex-wrap gap-3 mb-2">
//         {images.map((img) => (
//           <div key={img.id} className="position-relative">
//             <img src={img.url} alt="旅館圖片" className="img-thumbnail" />
//             <button onClick={() => handleSetMainImage(img.id)}>設為主圖片</button>
//             <button onClick={() => handleDeleteImage(img.id)}>刪除</button>
//           </div>
//         ))}
//       </div>
//       <input type="file" onChange={handleUploadImage} />
//     </div>
//   );
// };

// export default HotelImageManager;