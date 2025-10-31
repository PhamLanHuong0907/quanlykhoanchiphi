import LayoutInput from "../../../layout/layout_input";
import FormRow from "../../../components/formRow";

export default function UnitsInput() {
  const handleSubmit = (data: Record<string, string>) => {
    console.log("Dữ liệu form:", data);
  };

  const fields = [
    {
      label: "Nhóm công đoạn sản xuất",
      type: "dropdown" as const,
      placeholder: "Chọn nhóm",
      dropdownItems: [
        { label: "May", path: "#" },
        { label: "Đóng gói", path: "#" },
        { label: "Kiểm tra", path: "#" },
      ],
    },
    { label: "Đơn vị tính", type: "text" as const, placeholder: "Input Text" },
    { label: "Tên công đoạn sản xuất", type: "text" as const, placeholder: "Nhập tên" },
  ];

 const formRowFields = [
  { label: "Ngày bắt đầu", placeholder: "Chọn ngày", type: "date" as const },
  { label: "Ngày kết thúc", placeholder: "Chọn ngày", type: "date" as const },
  { label: "Đơn giá vật tư", placeholder: "Nhập đơn giá", type: "number" as const },
];


  return (
      <LayoutInput
        title01="Danh mục/ Công đoạn sản xuất/ Công đoạn sản xuất"
        title="Tạo mới Công đoạn sản xuất"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => console.log("Đóng form")}
        formRowComponent={
          <FormRow 
          title="Bảng vật tư"
          fields={formRowFields} onAdd={() => console.log("Thêm dòng mới")} />
        }
      />
  );
}
