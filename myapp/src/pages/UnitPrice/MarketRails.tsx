import React from "react";
import Layout from "../../layout/layout_filter";
import AdvancedTable from "../../components/bodytable";
import PencilButton from "../../components/PencilButtons";
import MarketRailsInput from "./MarketRailsInput";
import MarketRailsEdit from "./MarketRailsEdit";

const MarketRails: React.FC = () => {
  const columns = [
    "STT",
    "Mã thiết bị",
    "Tên phụ tùng",
    "ĐVT",
    "Đơn giá vật tư",
    "Định mức thời gian thay thế (tháng)",
    "Số lượng vật tư 1 lần thay thế",
    "Sản lượng than bình quân tháng (1000T)",
    "Định mức SCVT cho 1 thiết bị/1000 tấn than NK ",
    "Chi phí đầu tư SCTX cho 1 thiết bị/1 tấn than NK",
    "Ghi chú",
    "Sửa",
  ];

  const columnWidths = [
    6, 8, 20.8, 4, 10, 7, 7, 9, 10, 10, 5, 4,
  ];

  // ✅ Navbar mini như file mẫu Specification01
  const items = [
    { label: "Đào lò", path: "/SlideRails" },
    { label: "Lò chợ", path: "/MarketRails" },
  ];

  // ✅ Dữ liệu gốc
  const dataRows = [
    {
      id: "1",
      ma: "TN01",
      ten: "Thuốc nổ",
      dvt: "kg",
      donGia: "41.973",
      dinhMucThang: "12",
      soLuong: "10",
      sanLuong: "150",
      scvt: "1.2",
      chiPhi: "5.000.000",
      ghiChu: "",
    },
    {
      id: "2",
      ma: "KD01",
      ten: "Kíp điện",
      dvt: "Cái",
      donGia: "13.710",
      dinhMucThang: "24",
      soLuong: "5",
      sanLuong: "200",
      scvt: "0.8",
      chiPhi: "3.000.000",
      ghiChu: "",
    },
    {
      id: "3",
      ma: "EBH52",
      ten: "Khớp nối đàn hồi máy đào lò",
      dvt: "Cái",
      donGia: "5.700.000",
      dinhMucThang: "18",
      soLuong: "2",
      sanLuong: "100",
      scvt: "1.0",
      chiPhi: "10.000.000",
      ghiChu: "",
    },
  ];

  // ✅ Map dataRows => data (giống file mẫu)
  const data = dataRows.map((row) => [
    row.id,
    row.ma,
    row.ten,
    row.dvt,
    row.donGia,
    row.dinhMucThang,
    row.soLuong,
    row.sanLuong,
    row.scvt,
    row.chiPhi,
    row.ghiChu,
    <PencilButton id={row.id} editElement={<MarketRailsEdit/>}/>,
  ]);

  return (
    <Layout>
      <div className="p-6">
        <AdvancedTable
          title01="Đơn giá và định mức  /  Đơn giá và định mức sửa chữa thường xuyên"
          title="Đơn giá và định mức sửa chữa thường xuyên"
          columns={columns}
          columnWidths={columnWidths}
          data={data}
          createElement={<MarketRailsInput/>}
          navbarMiniItems={items}
          columnLefts={['undefined','undefined','undefined','undefined','undefined','undefined','undefined','undefined','undefined','undefined','undefined']}
        />
      </div>
    </Layout>
  );
};

export default MarketRails;
