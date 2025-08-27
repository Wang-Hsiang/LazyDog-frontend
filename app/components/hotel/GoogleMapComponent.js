"use client";

import React, { useEffect, useRef, useState } from "react";

const GoogleMapComponent = ({ hotels }) => {
  const mapRef = useRef(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDfCdeVzmet4r4U6iU5M1C54K9ooF3WrV4&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsApiLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsApiLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isApiLoaded || !hotels.length || !mapRef.current) return;

    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 23.6978, lng: 120.9605 }, // 台灣中心點
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const infoWindow = new google.maps.InfoWindow(); // 新增 InfoWindow

    hotels.forEach((hotel, index) => {
      if (hotel.latitude && hotel.longitude) {
        const lat = Number(hotel.latitude);
        const lng = Number(hotel.longitude);

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: hotel.name,
          icon: {
            url: "/pet_hotel_logo_no_bg.png", // 標記圖示
            scaledSize: new google.maps.Size(18, 27),
          },
        });

        // 帶入飯店縮圖 (假設 hotel.image_url 是 API 傳回的圖片)
        const imageUrl =
          hotel.main_image_url && hotel.main_image_url !== "null"
            ? hotel.main_image_url
            : "/hotel/hotel-uploads/4-s-room.webp";

        // 設置 InfoWindow 的 HTML 內容
        const contentString = `
        <div style="max-width: 250px; max-height: 200px; padding: 10px; text-align: center; overflow: hidden;">
          <img src="${imageUrl}" alt="${hotel.name}" 
            style="width: 100%; max-height: 150px; height: auto; border-radius: 8px; margin-bottom: 8px;">
          <a href="/hotel-coupon/fonthotelDetail/${hotel.id}" 
             style="text-decoration: none; color: inherit;">
            <h5 style="margin: 5px 0; font-size: 12px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${hotel.name}
            </h5>
          </a>
        </div>
      `;

        marker.addListener("click", () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });
      }
    });
  }, [isApiLoaded, hotels]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMapComponent;
