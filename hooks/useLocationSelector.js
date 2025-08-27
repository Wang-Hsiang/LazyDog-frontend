import { useState, useEffect, useRef } from "react";
import { getHotelById } from "@/services/hotelService";

export function useLocationSelector(hotelId) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(""); //  地址顯示用
  const [city, setCity] = useState(""); // 選擇的縣市
  const [district, setDistrict] = useState(""); //  選擇的區域
  const locationModalRef = useRef(null);
  const twCityRef = useRef(null);
  let modalInstance = useRef(null);

  useEffect(() => {
    // 初始化 Bootstrap Modal
    import("bootstrap").then((bootstrap) => {
      if (locationModalRef.current) {
        modalInstance.current = new bootstrap.Modal(locationModalRef.current);
      }
    });

    //  確保 `tw-city-selector` 只初始化一次
    import("tw-city-selector").then((module) => {
      if (!twCityRef.current) {
        twCityRef.current = new module.default({
          el: "#twzipcode",
          elCounty: ".county",
          elDistrict: ".district",
          hasZipcode: false,
        });
      }
    });

    if (!hotelId) {
      fetchAllHotels();
    } else {
      fetchHotelLocation(hotelId);
    }
  }, [hotelId]);

  //  取得單一飯店的地點資訊
  const fetchHotelLocation = async (hotelId) => {
    try {
      const hotelData = await getHotelById(hotelId);
      if (hotelData) {
        if (hotelData.latitude && hotelData.longitude) {
          setLocation({ lat: hotelData.latitude, lng: hotelData.longitude });
        }
        if (hotelData.address) {
          setAddress(hotelData.address);
          // 自動拆分 `city` 和 `district`
          const splitAddress = hotelData.address.split(" ");
          if (splitAddress.length >= 2) {
            setCity(splitAddress[0]);
            setDistrict(splitAddress[1]);
          }
        }
      } else {
        console.warn("無法獲取 hotel 資訊");
      }
    } catch (error) {
      console.error(" 獲取 hotel 資訊失敗:", error);
    }
  };

  //  取得所有飯店，確保 `useLocationSelector` 不影響 `SearchBar`
  const fetchAllHotels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hotels");
      const data = await res.json();
    } catch (error) {
      console.error(" 獲取所有失敗:", error);
    }
  };

  //  開啟選擇地區 Modal
  const openModal = () => {
    if (modalInstance.current) {
      modalInstance.current.show();
    }
  };

  //  關閉選擇地區 Modal
  const closeModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  //  確保選擇地區後 `SearchBar` 可以即時顯示
  const confirmLocation = () => {
    const selectedCity = document.querySelector(".county")?.value || "";
    const selectedDistrict = document.querySelector(".district")?.value || "";
    
    setCity(selectedCity);
    setDistrict(selectedDistrict);
    setAddress(`${selectedCity} ${selectedDistrict}`);
  
    closeModal();
  };
  

  const clearLocation = () => {
    console.log("🧹 清除地區選擇");
  
    // 清空狀態
    setCity("");
    setDistrict("");
    setAddress("");
  
    //  清空 `tw-city-selector` 的 UI
    if (twCityRef.current) {
      twCityRef.current.reset({
        county: "",
        district: "",
      });
    }
  };
  
  useEffect(() => {
    console.log("📍 更新地區:", city, district);
  }, [city, district]);

  // 開啟 Google 地圖，顯示飯店位置
  const openMap = () => {
    if (hotelId && location) {
      window.open(
        `https://www.google.com/maps?q=${location.lat},${location.lng}`,
        "_blank"
      );
    }
  };

  return {
    location,
    address,
    city,
    district,
    locationModalRef,
    closeModal,
    openModal,
    confirmLocation,
    clearLocation,
    openMap,
  };
}
