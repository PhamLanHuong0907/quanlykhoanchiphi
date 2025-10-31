import React, { useState } from "react";
import "./compare.css";

interface CompareNavbarProps {
  defaultValue?: string; // Ký hiệu mặc định
  onSelect?: (symbol: string) => void; // Gửi ký hiệu ra ngoài khi chọn
}

const Compare_navbarMini: React.FC<CompareNavbarProps> = ({
  defaultValue,
  onSelect,
}) => {
  // Danh sách mặc định các ký hiệu
  const symbols = ["≥", "≤", "<", ">", "%", "°","=","-","_"];

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const defaultIndex = symbols.findIndex((s) => s === defaultValue);
    return defaultIndex !== -1 ? defaultIndex : 0;
  });

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onSelect?.(symbols[index]); // Gửi ký hiệu ra ngoài
  };

  return (
    <div className="Compare_navbar_mini">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className={`compare-item ${index === activeIndex ? "active" : ""}`}
          onClick={() => handleClick(index)}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default Compare_navbarMini;
