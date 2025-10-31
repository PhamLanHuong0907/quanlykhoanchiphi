// navbar_mini.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./navbar_mini.css";

export interface NavItem {
  label: string;
  path: string;
}

interface NavbarMiniProps {
  items: NavItem[];
}

const NavbarMini: React.FC<NavbarMiniProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const findActiveIndex = () => {
    const currentPath = location.pathname;
    const index = items.findIndex((item) => item.path === currentPath);
    return index !== -1 ? index : 0;
  };

  const [activeIndex, setActiveIndex] = useState<number>(findActiveIndex);

  // Cập nhật activeIndex khi URL thay đổi (ví dụ khi dùng back/forward trình duyệt)
  useEffect(() => {
    setActiveIndex(findActiveIndex());
  }, [location.pathname]);

  const handleClick = (index: number, path: string) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <div className="navbar_mini">
      {items.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${index === activeIndex ? "active" : ""}`}
          onClick={() => handleClick(index, item.path)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default NavbarMini;
