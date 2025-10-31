import React from "react"; // Bỏ useEffect và useMemo
import Layout from "../../../layout/layout_filter";
import AdvancedTable from "../../../components/bodytable";
import PencilButton from "../../../components/PencilButtons";
import { ChevronsUpDown } from "lucide-react";
import SparePartsInput from "./SparePartsInput";
import SparePartsEdit from "./SparePartEdit";
import { useApi } from "../../../hooks/useFetchData";

// 1. SỬA ĐỔI: Interface khớp hoàn toàn với JSON result
interface SparePart {
  id: string;
  code: string;           // Mã phụ tùng
  name: string;           // Tên phụ tùng
  unitOfMeasureId: string;
  unitOfMeasureName: string; // <-- API đã cung cấp
  equipmentId: string;
  equipmentCode: string;     // <-- API đã cung cấp
  costAmmount: number;       // <-- Tên đúng từ API (có typo)
}

// (Các interface không cần thiết đã bị xóa)

const SpareParts: React.FC = () => {
  const basePath = `/api/catalog/part`;
  const fetchPath = `${basePath}?pageIndex=1&pageSize=1000`;
  // 2. SỬA ĐỔI: Gọi 1 API chính, lấy 'refresh' trực tiếp
  const { data, loading, error, refresh } = useApi<SparePart>(fetchPath);

  // (Các useApi không cần thiết đã bị xóa)

  // 3. SỬA ĐỔI: Bỏ 'refresh' thủ công và 'useEffect'
  // (useApi sẽ tự động fetch lần đầu)

  // (Các useMemo không cần thiết đã bị xóa)

  // ====== Định nghĩa Cột (Key nên khớp tên field API nếu có thể) ======
  const columns = [
    "STT",
    <div className="flex items-center gap-1" key="equipmentCode"> {/* Sửa key */}
      <span>Mã thiết bị</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="code">
      <span>Mã phụ tùng</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="name">
      <span>Tên phụ tùng</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    "ĐVT",
    "Đơn giá",
    "Sửa",
  ];

  const columnWidths = [6, 15, 15, 36, 10, 14, 4];

  // 4. SỬA ĐỔI: tableData đọc trực tiếp các trường từ API data
  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.equipmentCode || "",     // <-- Đọc trực tiếp từ API
      row.code || "",
      row.name || "",
      row.unitOfMeasureName || "", // <-- Đọc trực tiếp từ API
      // SỬA ĐỔI: Đọc đúng tên trường 'costAmmount'
      row.costAmmount?.toLocaleString() || "0",
      <PencilButton
        key={row.id}
        id={row.id}
        // 'refresh' này là từ hook
        editElement={<SparePartsEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];

  // 5. SỬA ĐỔI: Đơn giản hóa loading/error
  const isLoading = loading;
  const anyError = error;

  return (
    <Layout>
      <div className="p-6">
        {/* Style cho sort icon */}
        <style>{`
          th > div { display: inline-flex; align-items: center; gap: 3px; }
          th > div span:last-child { font-size: 5px; color: gray; }
        `}</style>

        {/* 6. SỬA ĐỔI: Cập nhật logic return */}
        
        {/* 1. Ưu tiên hiển thị lỗi */}
        {anyError ? (
          <div className="text-center text-red-500 py-10">Lỗi: {anyError.toString()}</div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Danh mục / Phụ tùng"
            title="Phụ tùng"
            columns={columns}
            columnWidths={columnWidths}
            data={tableData}
            // 'refresh' này là từ hook
            createElement={<SparePartsInput onSuccess={refresh} />}
            basePath={basePath}
            // 'refresh' này là từ hook
            onDeleted={refresh}
            columnLefts={['undefined','undefined','undefined','undefined',6,'undefined','undefined']}
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

export default SpareParts;