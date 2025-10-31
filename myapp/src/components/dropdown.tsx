import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";

interface DropdownMenuProps {
  icon: React.ReactNode;
  label?: React.ReactNode;
  items: { label: string; path: string }[];
  onSelect?: (value: string) => void;
  className?: string;
  width?: string;
  left?:string;
  padding?:string;
  top?:string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  icon,
  label,
  items,
  onSelect,
  className,
  width ,
  left,
  padding,
  top,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className={`menu-item ${className || ""} ${showDropdown ? "active" : ""}`}
      ref={dropdownRef}
    >
      {/* Nút mở dropdown */}
      <div
        className="menu-trigger"
        onClick={() => setShowDropdown((prev) => !prev)}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", padding }}
      >
        {icon}
        {label}
      </div>

      {/* Danh sách item */}
      {showDropdown && (
        <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} style={{ width, left, top }}>
          {items.map((item, idx) => (
            <div className="Wrapper" key={idx}>
              <div className="Menu-item">
                <div className="Text-item">
                  {/* ✅ Dùng Link để điều hướng */}
                  <Link
                    to={item.path}
                    className="dropdown-item"
                    onClick={() => {
                      if (onSelect) onSelect(item.label);
                      setShowDropdown(false);
                    }}
                  >
                    {item.label}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
