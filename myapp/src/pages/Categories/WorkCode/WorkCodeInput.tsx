import React, { useEffect, useState } from "react";
import LayoutInput from "../../../layout/layout_input";
import PATHS from "../../../hooks/path";
import { useApi } from "../../../hooks/useFetchData";
import DropdownMenuSearchable from "../../../components/dropdown_menu_searchable";

interface WorkCodeInputProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const WorkCodeInput: React.FC<WorkCodeInputProps> = ({ onClose, onSuccess }) => {
  // ====== API setup ======
  const unitPath = `/api/catalog/unitofmeasure?pageIndex=1&pageSize=1000`;
  const assignmentPath = `/api/catalog/assignmentcode`;

  // Fetch danh sách đơn vị tính
  const {
    fetchData: fetchUnits,
    data: units,
    loading: loadingUnits,
    error: errorUnits,
  } = useApi<{ id: string; name: string }>(unitPath);

  // Post dữ liệu mã giao khoán
  const { postData, loading: saving, error: saveError } = useApi(assignmentPath);

  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  // ====== Load danh sách đơn vị tính ======
  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const unitOptions =
    units?.map((u) => ({
      value: u.id,
      label: u.name,
    })) || [];

  // ====== Submit form ======
  const handleSubmit = async (data: Record<string, string>) => {
    const code = data["Mã giao khoán"]?.trim();
    const name = data["Tên mã giao khoán"]?.trim();
    const unitOfMeasureId = selectedUnitId;

    if (!code) return alert("⚠️ Vui lòng nhập mã giao khoán!");
    if (!name) return alert("⚠️ Vui lòng nhập tên mã giao khoán!");
    if (!unitOfMeasureId)
      return alert("⚠️ Vui lòng chọn đơn vị tính!");

    console.log("📤 POST:", { code, name, unitOfMeasureId });

    await postData({ code, name, unitOfMeasureId }, () => {
      console.log("✅ Tạo mã giao khoán thành công!");
      onSuccess?.(); // refresh bảng ngoài
      onClose?.();   // đóng form
    });
  };

  // ====== Trường nhập ======
  const fields = [
    {
      label: "Mã giao khoán",
      type: "text" as const,
      placeholder: "Nhập mã giao khoán, ví dụ: VLN ",
    },
    {
      label: "Tên mã giao khoán",
      type: "text" as const,
      placeholder: "Nhập tên mã giao khoán, ví dụ: Vật liệu nổ",
    },
    { type: "custom" as const }, // nơi chèn dropdown
  ];

  return (
    // SỬA ĐỔI: Bọc bằng Fragment
      <LayoutInput
        title01="Danh mục / Mã giao khoán"
        title="Tạo mới Mã giao khoán"
        fields={fields}
        onSubmit={handleSubmit}
        closePath={PATHS.WORK_CODE.LIST}
        onClose={onClose}
        initialData={{
          "Mã giao khoán": formData.code,
          "Tên mã giao khoán": formData.name,
        }}
      >
        {/* ✅ Dropdown Đơn vị tính nằm ở cuối form */}
        {/* SỬA ĐỔI: Đổi className="mt-3" thành className="custom" để khớp với type */}
        <div className="custom" key={1}> 
          {/* Bạn có thể lồng thêm 1 div "mt-3" bên trong nếu vẫn muốn giữ margin */}
          <DropdownMenuSearchable
            label="Đơn vị tính"
            options={unitOptions}
            value={selectedUnitId}
            onChange={(value) => setSelectedUnitId(value)}
            placeholder="Chọn đơn vị tính..."
            isDisabled={loadingUnits}
          />
        </div>

        {/* Trạng thái tải và lỗi (ĐÃ XÓA KHỎI ĐÂY) */}
      </LayoutInput>
  );
};

export default WorkCodeInput;