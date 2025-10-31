/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from "../components/dropdown";
import Compare_navbarMini from "../components/compare";
import "./layout_input.css";

interface InputField {
  label?: string;
  placeholder?: string;
  type?: "text" | "dropdown" | `custom${string}`;
  dropdownItems?: { label: string; path: string }[];
  onChange?: (value: string) => void;
  readOnly?: boolean;
  enableCompare?: boolean;
}

interface LayoutInputProps {
  title01: string;
  title: string;
  fields: InputField[];
  children?: React.ReactNode;
  onSubmit?: (data: Record<string, string>) => void;
  onCancel?: () => void;
  formRowComponent?: React.ReactNode;
  closePath?: string;
  onClose?: () => void;
  initialData?: Record<string, string>;
  shouldSyncInitialData?: boolean; // ✅ Thêm prop này để điều khiển việc sync
}

const LayoutInput: React.FC<LayoutInputProps> = ({
  title01,
  title,
  fields,
  onSubmit,
  onCancel,
  formRowComponent,
  closePath,
  children,
  onClose,
  initialData = {},
  shouldSyncInitialData = false, // ✅ Mặc định là false (Input)
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ✅ Chỉ đồng bộ lại formData nếu prop shouldSyncInitialData = true
  useEffect(() => {
    if (shouldSyncInitialData && initialData) {
      setFormData(initialData);
    }
  }, [initialData, shouldSyncInitialData]);

  const navigate = useNavigate();
  const location = useLocation();

  const parentPath =
    closePath || location.pathname.split("/").slice(0, -1).join("/") || "/";

  const handleSelect = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleClose = () => {
    onClose?.();
    if (!onClose && closePath) navigate(closePath);
  };

  const handleSubmit = () => {
    console.log("📤 Gửi dữ liệu form:", formData);
    onSubmit?.(formData);
    onClose?.();
    if (!onClose && closePath) navigate(closePath);
  };

  const handleSymbolInsert = (label: string, symbol: string) => {
    const input = inputRefs.current[label];
    if (!input) return;

    const cursorStart = input.selectionStart || 0;
    const cursorEnd = input.selectionEnd || 0;
    const currentValue = formData[label] || "";

    const newValue =
      currentValue.slice(0, cursorStart) + symbol + currentValue.slice(cursorEnd);

    setFormData((prev) => ({ ...prev, [label]: newValue }));

    setTimeout(() => {
      input.focus();
      const newPos = cursorStart + symbol.length;
      input.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // BỔ SUNG: Chuyển {children} thành một mảng để có thể tìm kiếm
  const childrenArray = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement[];

  return (
    <div className="layout-input-container" style={{ position: "relative", zIndex: 10000 }}>
      {/* Nút đóng */}
      

      {/* Header */}
      <div className="layout-input-header">
        <button className="close-btn" onClick={handleClose} title="Đóng">
        <X size={16} />
      </button>
        <div className="header01">{title01}</div>
        <div className="line"></div>
        <div className="header02">{title}</div>
      </div>

      {/* Form body */}
      <div className="layout-input-body">
        <div className="padding" style={{width: "40px", height : "100%", backgroundColor: "red", zIndex: "100", flexShrink: 0}}></div>
        {fields.map((field, index) => {
          // ✅ Nếu là field custom → render children tại đây
          // Bỏ comment và kiểm tra điều kiện 'custom'
          if (field.type && field.type.startsWith("custom")) {
            // BỔ SUNG: Tìm 'child' con tương ứng có className khớp với field.type
            const matchingChild = childrenArray.find(
              (child : any) => child.props.className === field.type
            );

            return (
              <div key={index} className={`input-row custom-slot ${field.type}`}>
                {/* SỬA ĐỔI: Chỉ render 'child' con đã tìm thấy */}
                {matchingChild || null}
              </div>
            );
          }

          // ✅ Field thường
          return (
            <div key={index} className="input-row">
              <label htmlFor={field.label}>{field.label}</label>

              {field.type === "dropdown" && field.dropdownItems ? (
                <DropdownMenu
                  icon={null}
                  className={
                    formData[field.label || ""] ? "dropdown-selected" : "dropdown-placeholder"
                  }
                  label={
                    <div className="dropdown-label-box">
                      {formData[field.label || ""] || field.placeholder || "Chọn giá trị"}
                      <ChevronDown className="dropdown-arrow" />
                    </div>
                  }
                  items={field.dropdownItems.map((item) => ({
                    label: item.label,
                    path: item.path,
                  }))}
                  onSelect={(val) => {
                    if (field.label) {
                      handleSelect(field.label, val);
                      field.onChange?.(val);
                    }
                  }}
                  width="680px"
                  left="0px"
                  top="100%"
                  padding="0"
                />
              ) : (
                <input
                  ref={(el) => {
                    if (field.label) inputRefs.current[field.label] = el;
                  }}
                  type={field.type || "text"}
                  id={field.label}
                  name={field.label}
                  placeholder={field.placeholder || ""}
                  className="input-text"
                  value={formData[field.label || ""] || ""}
                  onChange={(e) => {
                    if (field.label)
                      setFormData((prev) => ({
                        ...prev,
                        [field.label!]: e.target.value,
                      }));
                  }}
                  readOnly={field.readOnly}
                  autoComplete="off"
                />
              )}

              {field.enableCompare && (
                <div className="compare-wrapper">
                  <Compare_navbarMini
                    onSelect={(symbol) =>
                      field.label && handleSymbolInsert(field.label, symbol)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Optional sections */}
        {formRowComponent && <div className="layout-formrow-wrapper">{formRowComponent}</div>}
      </div>

      {/* === PHẦN FOOTER ĐÃ DI CHUYỂN VÀO ĐÂY === */}
      <div className="layout-input-footer">
        <button className="btn-cancel" onClick={handleClose}>
          Hủy
        </button>
        <button className="btn-confirm" onClick={handleSubmit}>
          Xác nhận
        </button>
      </div>

    </div> // <-- Đây là thẻ </div> đóng của "layout-input-container"
  ); // <-- Đây là dấu ); đóng của "return ("
};

export default LayoutInput;
// <-- ĐÃ XÓA DẤU ); THỪA Ở ĐÂY