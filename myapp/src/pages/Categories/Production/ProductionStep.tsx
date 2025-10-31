import React from "react"; // Bỏ useEffect
import Layout from "../../../layout/layout_filter";
import AdvancedTable from "../../../components/bodytable";
import PencilButton from "../../../components/PencilButtons";
import { ChevronsUpDown } from "lucide-react";
import ProductionStepEdit from "./ProductionStepEdit";
import ProductionStepInput from "./ProductionStepInput";
import { useApi } from "../../../hooks/useFetchData";

const ProductionStep: React.FC = () => {
  const basePath = `/api/process/productionprocess`;
  const fetchPath = `${basePath}?pageIndex=1&pageSize=1000`;

  // SỬA ĐỔI: Lấy 'refresh' trực tiếp, bỏ 'fetchData'
  const { data, loading, error, refresh } = useApi<{
    id: string;
    code: string;
    name: string;
    processGroupName: string;
  }>(fetchPath);

  // SỬA ĐỔI: Bỏ hàm 'refresh' thủ công
  // const refresh = () => { ... };

  // SỬA ĐỔI: Bỏ 'useEffect' load lần đầu
  // useEffect(() => { ... }, [fetchData]);

  const columns = [
    "STT",
    <div className="flex items-center gap-1" key="code">
      <span>Mã công đoạn sản xuất</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="name">
      <span>Tên công đoạn sản xuất</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="group">
      <span>Nhóm công đoạn sản xuất</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    "Sửa",
  ];

  const columnWidths = [6, 20, 47, 23, 4];

  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.code,
      row.name,
      row.processGroupName,
      <PencilButton
        key={row.id}
        id={row.id}
        // 'refresh' này là từ hook
        editElement={<ProductionStepEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];

  const navbarItems = [
    { label: "Nhóm công đoạn sản xuất", path: "/ProductionStepGroup" },
    { label: "Công đoạn sản xuất", path: "/ProductionStep" },
  ];

  return (
    <Layout>
      <div className="p-6">
        
        {/* SỬA ĐỔI: Cập nhật logic return */}

        {/* 1. Ưu tiên hiển thị lỗi */}
        {error ? (
          <div className="text-center text-red-500 py-10">Lỗi: {error}</div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Danh mục / Công đoạn sản xuất / Công đoạn sản xuất"
            title="Công đoạn sản xuất"
            columns={columns}
            columnWidths={columnWidths}
            data={tableData}
            // 'refresh' này là từ hook
            createElement={<ProductionStepInput onSuccess={refresh} />}
            basePath={basePath}
            // 'refresh' này là từ hook
            onDeleted={refresh}
            navbarMiniItems={navbarItems}
            columnLefts={['undefined','undefined','undefined','undefined','undefined']}
          />
        )}
        
        {/* 3. Hiển thị loading overlay riêng biệt */}
        {loading && (
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

export default ProductionStep;