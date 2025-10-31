import React, { useState } from "react";
import LayoutInput from "../../../layout/layout_input";
import PATHS from "../../../hooks/path";
import { useApi } from "../../../hooks/useFetchData";

interface UnitsInputProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const UnitsInput: React.FC<UnitsInputProps> = ({ onClose, onSuccess }) => {
  // ====== Base API ======
  const basePath = `/api/catalog/unitofmeasure`;
  const { postData, loading: saving, error: saveError } = useApi(basePath);

  // ====== State ======
  const [formData, setFormData] = useState({
    name: "",
  });

  // ====== Submit form ======
  const handleSubmit = async (data: Record<string, string>) => {
    const name = data["Đơn vị tính"]?.trim();
    if (!name) return alert("⚠️ Vui lòng nhập đơn vị tính!");

    console.log("📤 POST:", { name });

    await postData({ name }, () => {
      console.log("✅ Tạo đơn vị tính thành công!");
      onSuccess?.(); // refresh bảng ngoài
      onClose?.();   // đóng form
    });
  };

  // ====== Fields ======
  const fields = [
    {
      label: "Đơn vị tính",
      type: "text" as const,
      placeholder: "Nhập tên đơn vị tính, ví dụ cm",
    },
  ];

  return (
    <LayoutInput
      title01="Danh mục / Đơn vị tính"
      title="Tạo mới Đơn vị tính"
      fields={fields}
      onSubmit={handleSubmit}
      closePath={PATHS.UNIT.LIST}
      onClose={onClose}
      initialData={{
        "Đơn vị tính": formData.name,
      }}
    >
      {/* Trạng thái xử lý */}
      {saving && <p className="text-blue-500 mt-3">Đang lưu...</p>}
      {saveError && <p className="text-red-500 mt-3">Lỗi: {saveError}</p>}
    </LayoutInput>
  );
};

export default UnitsInput;
