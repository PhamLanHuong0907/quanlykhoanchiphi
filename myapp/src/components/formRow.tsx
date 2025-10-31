// ------------------------------------
// BẮT ĐẦU: File formrow.tsx (Đã sửa)
// ------------------------------------
import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FormRow.css";
import plusIcon from "../../assets/icon_plus.png";
import calendarIcon from "../../assets/icon_calendar.png";
import X from "../../assets/X.png";
import { Calendar } from "lucide-react";
import { PlusCircle } from "lucide-react";

// Interface này mô tả dữ liệu cho MỘT ô input
interface FieldData {
  label: string;
  placeholder: string;
  type?: "text" | "number" | "date";
  readOnly?: boolean;
  value: string | Date | null; // 'value' là bắt buộc
  onChange: (value: any) => void; // 'onChange' là bắt buộc
}

// Props của FormRow giờ nhận MỘT MẢNG CÁC HÀNG (rows)
interface FormRowProps {
  title?: string;
  title1?: string;
  // 'rows' là một mảng các hàng, mỗi hàng là một mảng các ô input (FieldData)
  rows: FieldData[][];
  onAdd?: () => void;
  onRemove?: (rowIndex: number) => void; // Prop mới để báo cho cha biết cần xóa hàng
}

const FormRow: React.FC<FormRowProps> = ({ title,title1, rows, onAdd, onRemove }) => {
  // Ref để mở lịch (vẫn giữ lại)
  const datePickerRefs = useRef<(DatePicker | null)[][]>([]);

  // XÓA BỎ: Toàn bộ state [rows, setRows] và các hàm handler nội bộ.

  return (
    <div className="form-row-container">
      {title && <div className="form-row-title">{title}</div>}

      {/* Render các hàng dựa trên state 'rows' của cha */}
      {rows.map((rowFields, rowIndex) => (
        <div className="form-row" key={rowIndex}>
          {/* Render các ô input (fields) trong hàng đó */}
          {rowFields.map((field, fieldIndex) => (
            <div className="form-field" key={fieldIndex}>
              <label>{field.label}</label>
              <div className="input-wrapper">
                {field.type === "date" ? (
                  <div className="date-input-container">
                    <DatePicker
                      ref={(el) => {
                        if (!datePickerRefs.current[rowIndex])
                          datePickerRefs.current[rowIndex] = [];
                        datePickerRefs.current[rowIndex][fieldIndex] = el;
                      }}
                      selected={field.value as Date | null} // Lấy value từ cha
                      onChange={(date) => field.onChange(date)} // Gọi hàm onChange của cha
                      dateFormat="dd/MM/yyyy"
                      placeholderText={field.placeholder}
                      className="datepicker-input"
                    />
                    <Calendar
                      alt="calendar"
                      className="calendar-overlay-icon"
                      strokeWidth={2}
                      color="rgba(30, 30, 30, 1)"
                      onClick={() =>
                        datePickerRefs.current[rowIndex]?.[
                          fieldIndex
                        ]?.setOpen(true)
                      }
                    />
                  </div>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={(field.value as string) || ""} // Lấy value từ cha
                    onChange={(e) => field.onChange(e.target.value)} // Gọi hàm onChange của cha
                    placeholder={field.placeholder}
                    readOnly={field.readOnly}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Nút Xóa: Gọi hàm 'onRemove' của cha */}
          {rows.length > 1 && ( // Chỉ hiện khi có nhiều hơn 1 hàng
            <button
              className="remove-btn"
              onClick={() => onRemove?.(rowIndex)} // Báo cho cha biết cần xóa hàng 'rowIndex'
              title="Xoá dòng"
            >
              <img src={X} alt="remove" />
            </button>
          )}
        </div>
      ))}

      {/* Nút Thêm: Gọi hàm 'onAdd' của cha */}
      {onAdd && (
        <div className="add-btn-wrapper">
          <button className="add-btn" onClick={onAdd}  title="Thêm dòng">
            <PlusCircle size={20} strokeWidth={2}
  color="rgba(0, 123, 255, 1)" alt="add"/>
            Thêm đơn giá {title1}
          </button>
        </div>
      )}
    </div>
  );
};

export default FormRow;
// ------------------------------------
// KẾT THÚC: File formrow.tsx
// ------------------------------------