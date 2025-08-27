import React, { useEffect, useRef } from "react";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const PriceSlider = ({ minPrice, maxPrice, onUpdate }) => {
  const priceSliderRef = useRef(null);

  useEffect(() => {
    if (!priceSliderRef.current) return;

    if (!priceSliderRef.current.noUiSlider) {
      noUiSlider.create(priceSliderRef.current, {
        start: [minPrice, maxPrice],
        connect: true,
        range: { min: 0, max: 10000 },
        step: 100,
      });

      priceSliderRef.current.noUiSlider.on("update", (values) => {
        onUpdate(parseFloat(values[0]), parseFloat(values[1]));
      });
    }
  }, [minPrice, maxPrice, onUpdate]);

  return <div id="priceRange" ref={priceSliderRef} className="mt-5"></div>;
};

export default PriceSlider;