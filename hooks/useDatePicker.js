import { useRef, useState, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export function useDatePicker() {
  const dateRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fp = flatpickr(dateRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["日", "一", "二", "三", "四", "五", "六"],
          longhand: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ],
        },
        rangeSeparator: " 至 ",
      },
      onClose: (selectedDates, dateStr) => {
        setSelectedDate(dateStr);
      },
    });

    return () => {
      fp.destroy(); // 清除 flatpickr
    };
  }, []);

  // 清除日期的函數
  const clearDate = () => {
    setSelectedDate("");
    if (dateRef.current && dateRef.current._flatpickr) {
      dateRef.current._flatpickr.clear();
    }
  };

  return { dateRef, selectedDate, setSelectedDate, clearDate };
}
