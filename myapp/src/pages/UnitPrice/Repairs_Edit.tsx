import React, { useState } from "react";
import LayoutInput from "../../layout/layout_input";
import FormRow from "../../components/formRow"; // 🔹 Import FormRow

export default function RepairsEdit() {
  const [selectedCode, setSelectedCode] = useState<string>("");

  // 🔹 Dữ liệu vật tư hiển thị theo từng mã giao khoán
  const materialsData: Record<
    string,
    { ten: string; donGia: number; dinhMuc: number }
  > = {
    "GK001 - Máng trượt inox": { ten: "Máng trượt inox", donGia: 120000, dinhMuc: 2 },
    "GK002 - Máng nhựa PVC": { ten: "Máng nhựa PVC", donGia: 95000, dinhMuc: 3 },
    "GK003 - Máng sắt sơn tĩnh điện": {
      ten: "Máng sắt sơn tĩnh điện",
      donGia: 150000,
      dinhMuc: 1,
    },
  };

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Dữ liệu form:", data);
  };

  // 🔹 Các field cơ bản của LayoutInput
  const fields = [
    { label: "Mã định mức máng trượt", type: "text" as const, placeholder: "Input Text" },
    {
      label: "Nhóm công đoạn sản xuất",
      type: "dropdown" as const,
      placeholder: "Placeholder",
      dropdownItems: [
        { label: "May", path: "#" },
        { label: "Đóng gói", path: "#" },
        { label: "Kiểm tra", path: "#" },
      ],
    },
    {
      label: "Độ kiên cố đá/than(f)",
      type: "dropdown" as const,
      placeholder: "Placeholder",
      dropdownItems: [
        { label: "May", path: "#" },
        { label: "Đóng gói", path: "#" },
        { label: "Kiểm tra", path: "#" },
      ],
    },
    {
      label: "Hộ chiếu, Sđ, Sc",
      type: "dropdown" as const,
      placeholder: "Placeholder",
      dropdownItems: [
        { label: "May", path: "#" },
        { label: "Đóng gói", path: "#" },
        { label: "Kiểm tra", path: "#" },
      ],
    },
    {
      label: "Mã giao khoán",
      type: "dropdown" as const,
      placeholder: "Chọn mã giao khoán",
      dropdownItems: [
        { label: "GK001 - Máng trượt inox", path: "#" },
        { label: "GK002 - Máng nhựa PVC", path: "#" },
        { label: "GK003 - Máng sắt sơn tĩnh điện", path: "#" },
      ],
      // 🔹 Khi chọn mã, lưu vào state
      onChange: (value: string) => setSelectedCode(value),
    },
  ];

  // Lấy dữ liệu hiện tại từ mã được chọn
  const currentMaterial = materialsData[selectedCode] || {
    ten: "",
    donGia: 0,
    dinhMuc: 0,
  };

  return (
    <LayoutInput
      title01="Đơn giá và định mức máng trượt"
      title="Chỉnh sửa Đơn giá và định mức máng trượt"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => console.log("Đóng form")}
    >
      {/* ✅ FormRow luôn hiển thị sẵn, chỉ cập nhật nội dung khi chọn mã */}
      <div className="mt-6">
        <FormRow
          title="Danh sách vật tư / tài sản"
          fields={[
            {
              label: "Tên vật tư, tài sản",
              placeholder: currentMaterial.ten || "Nhập tên vật tư",
              type: "text",
            },
            {
              label: "Đơn giá",
              placeholder:
                currentMaterial.donGia > 0
                  ? currentMaterial.donGia.toString()
                  : "0",
              type: "number",
            },
            {
              label: "Định mức",
              placeholder:
                currentMaterial.dinhMuc > 0
                  ? currentMaterial.dinhMuc.toString()
                  : "0",
              type: "number",
            },
          ]}
        />
      </div>
    </LayoutInput>
  );
}
