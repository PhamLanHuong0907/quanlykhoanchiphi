import React from "react";
// 1. Import hook useApi (giả sử vị trí file)
import { useApi } from "../../hooks/useFetchData"; 
import Layout from "../../layout/layout_filter";
import AdvancedTable from "../../components/bodytable";
import PencilButton from "../../components/PencilButtons";
import SlideRailsInput from "./SlideRailInput";
import SlideRailsEdit from "./SlideRailEdit";
import EyeToggle from "../../components/eye";
import SlideRailExample from "../../layout/SCTX_test";

// === 2. Định nghĩa Interface cho dữ liệu API ===
interface MaintainUnitPrice {
  equipmentId: string;
  equipmentCode: string;
  totalPrice: number;
  // Chúng ta không cần 'maintainUnitPriceEquipment' cho bảng này
}

// === 3. Hàm trợ giúp định dạng số ===
const formatNumber = (num: number, digits: number = 2): string => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString("vi-VN", { maximumFractionDigits: digits });
}

const SlideRails: React.FC = () => {
  // === 4. Cập nhật cột ===
  const columns = [
    "STT",
    "Mã thiết bị",
    "Tổng tiền", // Thêm cột mới
    "Xem",
    "Sửa",
  ];

  // === 5. Cập nhật độ rộng cột ===
  const columnWidths = [
    6,  // STT
    72.5, // Mã thiết bị (giảm bớt)
    14.5, // Tổng tiền (cột mới)
    3,  // Xem
    4   // Sửa
  ];

  // ✅ Navbar mini (giữ nguyên)
  const items = [
    { label: "Đào lò", path: "/SlideRails" },
    { label: "Lò chợ", path: "/MarketRails" },
  ];

  // === 6. Gọi API (SỬA ĐỔI) ===
  const basePath = "/api/pricing/maintainunitpriceequipment?pageIndex=1&pageSize=1000";
  // SỬA ĐỔI: Lấy 'apiData', 'loading', 'error', 'refresh'
  const { data: apiData, loading, error, refresh } = useApi<MaintainUnitPrice>(
    basePath
  );

  // === 7. Map dữ liệu API sang định dạng cho bảng ===
  const tableData =
    apiData?.map((row, index) => [
      index + 1, // STT là index
      row.equipmentCode, // Mã thiết bị
      formatNumber(row.totalPrice), // Tổng tiền đã định dạng
      
      // Pass equipmentId cho component con
      <EyeToggle
            key={row.equipmentId}
            // 👈 TỐI ƯU LAZY LOAD
            renderDetailComponent={() => (
              <SlideRailExample id={row.equipmentId} />
            )}
          />,
      <PencilButton
        key={`${row.equipmentId}-pencil`} // Thêm key
        id={row.equipmentId}
        // SỬA ĐỔI: Thêm onSuccess={refresh}
        editElement={<SlideRailsEdit id={row.equipmentId} onSuccess={refresh} />}
      />,
    ]) || []; // Thêm fallback || []

  // === 8. Cập nhật columnLefts ===
  const columnLefts = ['undefined','undefined','undefined',10,'undefined','undefined','undefined','undefined','undefined'];

  // === 9. Xử lý trạng thái loading (SỬA ĐỔI) ===
  // Bỏ khối `if (loading)`
  const isLoading = loading;
  const anyError = error;

  return (
    <Layout>
      <div className="p-6">
        
        {/* SỬA ĐỔI: Cập nhật logic return */}

        {/* 1. Ưu tiên hiển thị lỗi */}
        {anyError ? (
          <div className="text-center text-red-500 py-10">
            Lỗi: {anyError.toString()}
          </div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Đơn giá và định mức / Đơn giá và định mức sửa chữa thường xuyên"
            title="Đơn giá và định mức sửa chữa thường xuyên"
            columns={columns}
            columnWidths={columnWidths}
            data={tableData} // Sử dụng dữ liệu từ API
            
            // SỬA ĐỔI: Thêm các prop cần thiết
            createElement={<SlideRailsInput onSuccess={refresh} />}
            navbarMiniItems={items}
            basePath={basePath}
            onDeleted={refresh}
            
            columnLefts={columnLefts} // Sử dụng columnLefts đã cập nhật
          />
        )}
        
        {/* 3. Hiển thị loading overlay riêng biệt */}
        {isLoading && (
          <div style={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '10px 20px',
            borderRadius: '8px',
            zIndex: 100
          }}>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SlideRails;