import React from "react"; // Bỏ useEffect
import Layout from "../../../layout/layout_filter";
import AdvancedTable from "../../../components/bodytable";
import PencilButton from "../../../components/PencilButtons";
import { ChevronsUpDown } from "lucide-react";
import WorkCodeEdit from "./WorkCodeEdit";
import WorkCodeInput from "./WorkCodeInput";
import { useApi } from "../../../hooks/useFetchData";

const WorkCode: React.FC = () => {
  const basePath = `/api/catalog/assignmentcode`;
  
  const fetchPath = `${basePath}?pageIndex=1&pageSize=1000`;
  // ✅ Sửa đổi: Lấy 'refresh' trực tiếp từ useApi
  const { data, loading, error, refresh } = useApi<{
    id: string;
    code: string;
    name: string;
    unitOfMeasureName: string;
  }>(fetchPath);

  // ✅ Bỏ hàm refresh thủ công
  // const refresh = () => { ... };

  // ✅ Bỏ useEffect load lần đầu
  // useEffect(() => { ... }, [fetchData]);

  const columns = [
    "STT",
    <div className="flex items-center gap-1" key="code">
      <span>Mã giao khoán</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="name">
      <span>Tên mã giao khoán</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="unit">
      <span>ĐVT</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    "Sửa",
  ];

  const columnWidths = [6, 20, 61, 9, 4];

  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.code,
      row.name,
      row.unitOfMeasureName || "",
      <PencilButton
        key={row.id}
        id={row.id}
        // ✅ Sửa đổi: Dùng 'refresh' từ hook
        editElement={<WorkCodeEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];


  return (
    <Layout>
      <div className="p-6">
        
        {/* 1. Ưu tiên hiển thị lỗi (Logic này đã đúng) */}
        {error ? (
          <div className="text-center text-red-500 py-10">Lỗi: {error}</div>
        ) : (
          /* 2. Luôn hiển thị bảng (Logic này đã đúng) */
          <AdvancedTable
            title01="Danh mục / Mã giao khoán"
            title="Mã giao khoán"
            columns={columns}
            columnWidths={columnWidths}
            data={tableData}
            // ✅ Sửa đổi: Dùng 'refresh' từ hook
            createElement={<WorkCodeInput onSuccess={refresh} />}
            basePath={basePath}
            // ✅ Sửa đổi: Dùng 'refresh' từ hook
            onDeleted={refresh}
            columnLefts={['undefined', 'undefined', 'undefined', 6, 'undefined']}
          />
        )}
        
        {/* 3. Hiển thị loading overlay (Logic này đã đúng) */}
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

export default WorkCode;