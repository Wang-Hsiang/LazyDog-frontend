// "use client";

// import React, { useState } from "react";
// import Swal from "sweetalert2";
// import hotelStyles from "../../../../styles/modules/operatorHotel.module.css";

// const RoomManager = ({ rooms, setRooms, roomTypes, hotelId }) => {
//   const [selectedRoomType, setSelectedRoomType] = useState("");
//   const [newRoomQuantity, setNewRoomQuantity] = useState(1);
//   const [newRoomPrice, setNewRoomPrice] = useState("");
//   const [newRoomImage, setNewRoomImage] = useState(null);

//   const handleAddRoom = async () => {
//     // 新增房型的邏輯
//   };

//   return (
//     <div className={`card p-3 mb-4 section ${hotelStyles.suSection}`}>
//       <h5>房型管理</h5>
//       {/* 顯示現有房型 */}
//       {rooms.map((room) => (
//         <div key={room.id}>
//           <p>{room.room_type_name}</p>
//           {/* 其他房型資訊 */}
//         </div>
//       ))}
//       {/* 新增房型表單 */}
//       <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
//         {roomTypes.map((type) => (
//           <option key={type.id} value={type.id}>{type.name}</option>
//         ))}
//       </select>
//       <button onClick={handleAddRoom}>新增房型</button>
//     </div>
//   );
// };

// export default RoomManager;