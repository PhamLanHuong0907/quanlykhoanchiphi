import React from "react"; // 1. Bỏ useEffect
import Layout from "../../layout/layout_filter";
import AdvancedTable from "../../components/bodytable";
import EyeToggle from "../../components/eye";
import Repairs_Grouped from "../../layout/test1";
import RepairsInput from "./Repairs_Input";
import { useApi } from "../../hooks/useFetchData"; 
import { ChevronsUpDown } from "lucide-react"; 
import RepairsEdit from "./Repairs_Edit";
import PencilButton from "../../components/PencilButtons";

// 1. Định nghĩa Interface (Giữ nguyên)
interface SlideUnitPrice {
  id: string;
  code: string; // "Đơn giá và định mức máng trượt"
  processGroupId: string;
  processGroupName: string; // "Nhóm công đoạn sản xuất"
  passportId: string;
  hardnessId: string;
  totalPrice: number; // "Thành tiền"
}

const Repairs: React.FC = () => {
  // 2. Khai báo API (SỬA ĐỔI)
  const basePath = `api/pricing/slideunitprice`; 
  // Lấy 'refresh' trực tiếp, bỏ 'fetchData'
  const { data, loading, error, refresh } = useApi<SlideUnitPrice>(basePath);

  // 3. SỬA ĐỔI: Bỏ 'useEffect' và 'refresh' thủ công
  // const refresh = () => fetchData();
  // useEffect(() => { ... }, [fetchData]);

  // 4. Cập nhật Columns (Giữ nguyên)
  const columns = [
    "STT",
    <div className="flex items-center gap-1" key="processGroupName">
      {/* SỬA: Đổi tên theo yêu cầu */}
      <span>Nhóm công đoạn sản xuất</span> 
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="code">
      <span>Mã định mức máng trượt</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    <div className="flex items-center gap-1" key="total">
      <span>Tổng tiền</span>
      <ChevronsUpDown size={13} className="text-gray-100 text-xs" />
    </div>,
    "Xem", 
    "Sửa"
  ];

  // Chiều rộng từng cột (Giữ nguyên)
  const columnWidths = [6, 18, 57, 10, 3, 4];

  // 5. Map dữ liệu từ API
  const tableData =
    data?.map((row, index) => [
      index + 1,
      row.processGroupName || "", // SỬA: Dùng processGroupName
      row.code || "", 
      row.totalPrice?.toLocaleString() || "0", 
      <EyeToggle
        key={`${row.id}-eye`} // Thêm key
        // Giả định component "test" (Materials_Ingredient_Grouped)
        // có thể xử lý ID từ slideunitprice
        detailComponent={<Repairs_Grouped id={row.id} />}
      />,
      <PencilButton
        key={`${row.id}-pencil`} // Thêm key
        id={row.id}
        // SỬA ĐỔI: Thêm id và onSuccess vào editElement
        editElement={<RepairsEdit id={row.id} onSuccess={refresh} />}
      />,
    ]) || [];

  // 6. Biến loading/error
  const isLoading = loading;
  const anyError = error;

  return (
    <Layout>
      <div className="p-6">
        {/* Thêm style (giữ nguyên) */}
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
        
        {/* 7. Xử lý UI - Đã cập nhật */}
        
        {/* 1. Ưu tiên hiển thị lỗi */}
        {anyError ? (
          <div className="text-center text-red-500 py-10">
            Lỗi: {anyError.toString()}
          </div>
        ) : (
          /* 2. Luôn hiển thị bảng (ngay cả khi đang tải) */
          <AdvancedTable
            title01="Đơn giá và định mức / Đơn giá và định mức máng trượt"
            title="Đơn giá và định mức máng trượt"
            columns={columns}
            columnWidths={columnWidths}
            data={tableData} // Dùng dữ liệu động
            // 'refresh' này là từ hook
            createElement={<RepairsInput onSuccess={refresh} />} 
            basePath={basePath} // Thêm basePath
            // 'refresh' này là từ hook
            onDeleted={refresh} 
            columnLefts={['undefined','undefined','undefined','undefined','undefined']}
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

export default Repairs;