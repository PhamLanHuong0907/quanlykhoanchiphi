import React from "react"; // Bỏ useEffect, useMemo
import Layout from "../../../layout/layout_filter";
import AdvancedTable from "../../../components/bodytable";
import PencilButton from "../../../components/PencilButtons";
import { ChevronsUpDown } from "lucide-react";
import MaterialsInput from "./MaterialsInput";
import MaterialsEdit from "./MaterialsEdit";
import { useApi } from "../../../hooks/useFetchData"; // Đảm bảo useApi trả về data là mảng

// SỬA ĐỔI: Interface này phải khớp với JSON API trả về
interface Material {
  id: string;
  code: string;
  name: string;
  assigmentCodeId: string;
  assigmentCode: string; // <-- Trường mới
  unitOfMeasureId: string;
  unitOfMeasureName: string; // <-- Trường mới
  costAmmount: number; // <-- Trường mới (Lưu ý tên "Ammount")
  // 'costs' không có ở đây
}

const Materials: React.FC = () => {
  const basePath = `/api/catalog/material`;
  const fetchPath = `${basePath}?pageIndex=1&pageSize=1000`;
  // 1. SỬA ĐỔI: Chỉ cần gọi 1 API chính, lấy 'refresh'
  const { data, loading, error, refresh } = useApi<Material>(fetchPath);

  // (Các useApi không cần thiết đã bị xóa)

  // 2. SỬA ĐỔI: Bỏ hàm 'refresh' thủ công
  // const refresh = () => fetchData();

  // 3. SỬA ĐỔI: Bỏ 'useEffect' load lần đầu
  // useEffect(() => { ... }, [fetchData]);

  // (Các useMemo không cần thiết đã bị xóa)

  // ====== Định nghĩa Cột ======
  const columns = [
    "STT",
    <div className="flex items-center gap-1" key="assigmentCode">
      <span>Mã giao khoán</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="code">
      <span>Mã vật tư, tài sản</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="name">
      <span>Tên vật tư, tài sản</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    "ĐVT",
    "Đơn giá",
    "Sửa",
  ];

  const columnWidths = [6, 15, 15, 38, 9, 13, 4];

  // 4. SỬA ĐỔI: tableData đọc trực tiếp từ các trường API
  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.assigmentCode || "", // <-- Đọc trực tiếp
      row.code || "",
      row.name || "",
      row.unitOfMeasureName || "", // <-- Đọc trực tiếp
      
      // SỬA ĐỔI: Đọc 'costAmmount' thay vì 'costs[0].amount'
      row.costAmmount?.toLocaleString() || "0", 

      <PencilButton
        key={row.id}
        id={row.id}
        // 'refresh' này là từ hook
        editElement={<MaterialsEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];

  // 5. SỬA ĐỔI: Đơn giản hóa loading/error
  const isLoading = loading;
  const anyError = error;

  return (
    <Layout>
      <div className="p-6">
        <style>{`
          th > div {
            display: inline-flex;
            align-items: center;
            gap: 3px;
          }
          th > div span:last-child {
            font-size: 5px;
            color: gray;
          }
        `}</style>
        
        {/* 6. SỬA ĐỔI: Cập nhật logic return */}

        {/* 1. Ưu tiên hiển thị lỗi */}
        {anyError ? (
          <div className="text-center text-red-500 py-10">
            Lỗi: {anyError.toString()}
          </div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Danh mục / Vật tư, tài sản"
            title="Vật tư, tài sản"
            columns={columns} // Truyền trực tiếp, không cần map
            columnWidths={columnWidths}
            data={tableData}
            // 'refresh' này là từ hook
            createElement={<MaterialsInput onSuccess={refresh} />}
            basePath={basePath}
            // 'refresh' này là từ hook
            onDeleted={refresh}
            columnLefts={['undefined','undefined','undefined','undefined',5.5,'undefined','undefined']}
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

export default Materials;