import React from "react"; // Bỏ useEffect
import Layout from "../../../layout/layout_filter";
import AdvancedTable from "../../../components/bodytable";
import PencilButton from "../../../components/PencilButtons";
import { ChevronsUpDown } from "lucide-react";
import ProductsEdit from "./ProductsEdit";
import ProductsInput from "./ProductsInput";
import { useApi } from "../../../hooks/useFetchData";

// 1. Interface (giữ nguyên)
interface Product {
  id: string;
  code: string;
  name: string;
  processGroupId: string;
  processGroupCode: string;
  hardnessId: string;
  hardnessValue: string;
  stoneClampRatioId: string;
  stoneClampRatioValue: string;
  insertItemId: string;
  insertItemValue: string;
}

const Products: React.FC = () => {
  const basePath = `/api/product/product`;
  
  const fetchPath = `${basePath}?pageIndex=1&pageSize=1000`;
  // SỬA ĐỔI: Lấy 'refresh' trực tiếp, bỏ 'fetchData'
  const { data, loading, error, refresh } = useApi<Product>(fetchPath);

  // SỬA ĐỔI: Bỏ 'refresh' thủ công
  // const refresh = () => fetchData();

  // SỬA ĐỔI: Bỏ 'useEffect'
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // 2. Cập nhật Columns (giữ nguyên)
  const columns = [
    "STT",
      <div className="flex items-center gap-1" key="groupCode">
      {/* Rút gọn tiêu đề để có thêm không gian */}
      <span>Mã nhóm CĐSX</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="code">
      <span>Mã sản phẩm</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="name">
      <span>Tên sản phẩm</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    // Cột mới
    "Sửa",
  ];

  // 3. Cập nhật ColumnWidths (giữ nguyên)
  const columnWidths = [6, 20, 20, 50, 4];

  // 4. Map dữ liệu từ API (giữ nguyên)
  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.processGroupCode || "",
      row.code || "",
      row.name || "",
      <PencilButton
        key={row.id}
        id={row.id}
        // 'refresh' này giờ là từ hook
        editElement={<ProductsEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];

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
        
        {/* SỬA ĐỔI: Cập nhật logic return */}

        {/* 1. Ưu tiên hiển thị lỗi */}
        {anyError ? (
          <div className="text-center text-red-500 py-10">
            Lỗi: {anyError.toString()}
          </div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Danh mục / Sản phẩm"
            title="Sản phẩm"
            columns={columns} // Cột đã cập nhật
            columnWidths={columnWidths} // Widths đã cập nhật
            data={tableData} // Dữ liệu đã cập nhật
            // 'refresh' này giờ là từ hook
            createElement={<ProductsInput onSuccess={refresh} />} 
            basePath={basePath}
            // 'refresh' này giờ là từ hook
            onDeleted={refresh}
            columnLefts={['undefined','undefined','undefined','undefined','undefined','undefined','undefined','undefined']}
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

export default Products;