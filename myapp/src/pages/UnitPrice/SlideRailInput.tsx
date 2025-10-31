import React, { useState, useMemo, } from "react";
import { X} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select
import { useApi } from "../../hooks/useFetchData"; // Import hook API
import PATHS from "../../hooks/path"; // Import PATHS
import "../../layout/layout_input.css";
import "../../components/transactionselector.css"; // Import CSS cho react-select

// === Định nghĩa interface cho dữ liệu ===

// Dữ liệu từ API /api/catalog/equipment
interface Equipment {
  id: string;
  code: string;
  name: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
}

// Dữ liệu từ API /api/catalog/part
interface Part {
  id: string;
  code: string;
  name: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  equipmentId: string;
  equipmentCode: string;
  costAmmount: number; // Đây có vẻ là "Đơn giá vật tư"
}

// Dữ liệu cho mỗi hàng phụ tùng hiển thị trên UI
interface PartRowData {
  // Dữ liệu gốc từ API
  partId: string;
  equipmentId: string;
  tenPhuTung: string;
  donGiaVatTu: number;
  donViTinh: string;
  // Dữ liệu người dùng nhập
  dinhMucThoiGian: string;
  soLuongVatTu: string;
  sanLuongMetLo: string;
  // Dữ liệu tính toán
  dinhMucVatTuSCTX: string;
  chiPhiVatTuSCTX: string;
}

// === THAY ĐỔI: CẬP NHẬT CẤU TRÚC PAYLOAD MỚI ===
// Interface cho từng item trong mảng 'costs'
interface CostItem {
  equipmentId: string;
  partId: string;
  quantity: number;
  replacementTimeStandard: number;
  averageMonthlyTunnelProduction: number;
}

// Interface cho payload chính gửi đi
interface PostPayload {
  costs: CostItem[];
}
// === KẾT THÚC THAY ĐỔI ===

export default function SlideRailsInput({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const closePath = PATHS.SLIDE_RAILS.LIST;

  // === Gọi API ===
  // 1. API GET cho dropdown Mã thiết bị
  const { data: equipmentData = [] } = useApi<Equipment>(
    "/api/catalog/equipment"
  );
  // 2. API GET cho tất cả phụ tùng
  const { data: allPartsData = [] } = useApi<Part>("/api/catalog/part");

  // === THAY ĐỔI: CẬP NHẬT API POST VÀ BASEPATH ===
  const { postData, loading: isSubmitting } = useApi<PostPayload>(
    "/api/pricing/maintainunitpriceequipment" // Cập nhật basePath
  );
  // === KẾT THÚC THAY ĐỔI ===

  // === State ===
  // Lưu ID của các thiết bị được chọn
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);
  // Lưu dữ liệu của các hàng phụ tùng đang hiển thị
  const [partRows, setPartRows] = useState<PartRowData[]>([]);

  // === Memoized Options cho Dropdown ===
  // Chuyển đổi dữ liệu equipment thô sang định dạng { value, label }
  const equipmentOptions = useMemo(() => {
    return equipmentData.map((eq) => ({
      value: eq.id,
      label: eq.code, // Hiển thị 'code' trong dropdown
    }));
  }, [equipmentData]);

  // === Xử lý sự kiện ===

  // Đóng form
  const handleClose = () => {
    onClose?.();
    if (!onClose && closePath) navigate(closePath);
  };

  // Khi người dùng thay đổi lựa chọn trong dropdown Mã thiết bị
  const handleSelectChange = (selected: any) => {
    const newSelectedIds = selected ? selected.map((s: any) => s.value) : [];
    setSelectedEquipmentIds(newSelectedIds);

    // Lọc ra các phụ tùng tương ứng với các thiết bị đã chọn
    const newRows = allPartsData
      .filter((part) => newSelectedIds.includes(part.equipmentId))
      .map(
        (part): PartRowData => ({
          partId: part.id,
          equipmentId: part.equipmentId,
          tenPhuTung: part.name,
          donGiaVatTu: part.costAmmount || 0,
          donViTinh: part.unitOfMeasureName || "Cái",
          dinhMucThoiGian: "", // Reset các trường input
          soLuongVatTu: "",
          sanLuongMetLo: "",
          dinhMucVatTuSCTX: "0",
          chiPhiVatTuSCTX: "0",
        })
      );
    setPartRows(newRows);
  };

  // Khi người dùng nhập liệu vào một hàng
  const handleRowChange = (
    index: number,
    field: keyof PartRowData,
    value: string
  ) => {
    // Tạo bản sao của mảng rows
    const newRows = [...partRows];
    // Cập nhật giá trị cho hàng cụ thể
    const updatedRow = { ...newRows[index], [field]: value };

    // === Logic tính toán (giữ nguyên) ===
    const donGia = updatedRow.donGiaVatTu || 0;
    const dinhMucThoiGian = parseFloat(updatedRow.dinhMucThoiGian) || 0;
    const soLuongVatTu = parseFloat(updatedRow.soLuongVatTu) || 0;
    const sanLuongMetLo = parseFloat(updatedRow.sanLuongMetLo) || 0;

    let dinhMucVatTu = 0;
    if (sanLuongMetLo !== 0)
      dinhMucVatTu = (dinhMucThoiGian * soLuongVatTu) / sanLuongMetLo;
    const chiPhiVatTu = dinhMucVatTu * donGia;

    // Cập nhật các trường tính toán
    updatedRow.dinhMucVatTuSCTX = dinhMucVatTu.toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    });
    updatedRow.chiPhiVatTuSCTX = chiPhiVatTu.toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    });

    // Cập nhật lại hàng đó trong mảng
    newRows[index] = updatedRow;
    // Cập nhật state
    setPartRows(newRows);
  };

  // === THAY ĐỔI: CẬP NHẬT LOGIC SUBMIT THEO JSON MỚI ===
  // Khi người dùng nhấn nút "Xác nhận"
  const handleSubmit = async () => {
    // Chuyển đổi TẤT CẢ các hàng (partRows) sang định dạng CostItem mà API yêu cầu
    // API yêu cầu number, state đang lưu string, nên cần parseFloat
    const costItems: CostItem[] = partRows.map((row) => ({
      equipmentId: row.equipmentId,
      partId: row.partId,
      quantity: parseFloat(row.soLuongVatTu) || 0,
      replacementTimeStandard: parseFloat(row.dinhMucThoiGian) || 0,
      averageMonthlyTunnelProduction: parseFloat(row.sanLuongMetLo) || 0,
    }));

    // Tạo payload cuối cùng
    const payload: PostPayload = {
      costs: costItems,
    };

    // Gửi MỘT request duy nhất chứa toàn bộ mảng
    try {
      await postData(payload, () => {
        console.log("📤 Đã gửi thành công:", payload);
        handleClose(); // Đóng form sau khi thành công
      });
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      // Bạn có thể thêm state để hiển thị lỗi cho người dùng
    }
  };
  // === KẾT THÚC THAY ĐỔI ===

  // Lấy các options đang được chọn cho react-select
  const selectedOptions = equipmentOptions.filter((opt) =>
    selectedEquipmentIds.includes(opt.value)
  );

  return (
    <div
      className="layout-input-container"
      style={{ position: "relative", zIndex: 10000, height: "auto" }}
    >
      <button className="close-btn" onClick={handleClose} title="Đóng">
        <X size={16} />
      </button>

      <div className="layout-input-header">
        <div className="header01">
          Đơn giá và định mức / Đơn giá và định mức SCTX
        </div>
        <div className="line"></div>
        <div className="header02">Tạo mới Đơn giá và định mức SCTX</div>
      </div>

      <div className="layout-input-body">
        {/* Field Mã thiết bị (REACT-SELECT) */}
        <div className="input-row" style={{ position: "fixed" }}>
          <label>Mã thiết bị</label>
          <Select
            isMulti
            options={equipmentOptions}
            value={selectedOptions}
            onChange={handleSelectChange}
            className="transaction-select-wrapper" // Dùng class từ file CSS
            classNamePrefix="transaction-select" // Dùng class từ file CSS
            placeholder="Chọn Mã thiết bị"
            styles={{
              // Đảm bảo dropdown menu hiển thị bên trên các phần tử khác
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
        </div>

        {/* ============================================== */}
        {/* HIỂN THỊ CÁC HÀNG PHỤ TÙNG          */}
        {/* ============================================== */}
        {/* Thêm 1 div wrapper để cuộn nếu có quá nhiều hàng */}
        <div
          style={{
            marginTop: "80px",
            width: "100%",
            maxHeight: "400px", // Giới hạn chiều cao
            overflowY: "auto", // Thêm thanh cuộn
          }}
        >
          {partRows.map((row, index) => (
            // Mỗi phụ tùng là một nhóm các trường input
            <div
              key={row.partId} // Dùng partId làm key
              style={{
                display: "flex",
                gap: "16px",
                width: "135%",
                flexWrap: "wrap",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px dashed #ccc",
              }}
            >
              {[
                { label: "Tên phụ tùng", name: "tenPhuTung" },
                { label: "Đơn giá vật tư", name: "donGiaVatTu" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="input-row"
                  style={{ width: "100px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`${item.name}-${index}`}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      height: "30px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.label}
                  </label>
                  <input
                    type="text"
                    id={`${item.name}-${index}`}
                    name={item.name}
                    className="input-text"
                    value={(row as any)[item.name]}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>
              ))}
              {[
                { label: "ĐVT", name: "donViTinh" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="input-row"
                  style={{ width: "80px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`${item.name}-${index}`}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      height: "30px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.label}
                  </label>
                  <input
                    type="text"
                    id={`${item.name}-${index}`}
                    name={item.name}
                    className="input-text"
                    value={(row as any)[item.name]}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>
              ))}
              {/* Input các trường còn lại */}
              <div className="input-row" style={{ width: "120px" }}>
                <label
                  htmlFor={`dinhMucThoiGian-${index}`}
                  style={{ textAlign: "center", height: "30px" }}
                >
                  Định mức thời gian thay thế
                </label>
                <input
                  type="number"
                  id={`dinhMucThoiGian-${index}`}
                  name="dinhMucThoiGian"
                  placeholder="Nhập định mức"
                  className="input-text"
                  value={row.dinhMucThoiGian}
                  onChange={(e) =>
                    handleRowChange(index, "dinhMucThoiGian", e.target.value)
                  }
                  autoComplete="off"
                />
              </div>

              <div className="input-row" style={{ width: "120px" }}>
                <label
                  htmlFor={`soLuongVatTu-${index}`}
                  style={{ textAlign: "center", height: "30px" }}
                >
                  Số lượng vật tư thay thế
                </label>
                <input
                  type="number"
                  id={`soLuongVatTu-${index}`}
                  name="soLuongVatTu"
                  placeholder="Nhập số lượng"
                  className="input-text"
                  value={row.soLuongVatTu}
                  onChange={(e) =>
                    handleRowChange(index, "soLuongVatTu", e.target.value)
                  }
                  autoComplete="off"
                />
              </div>

              <div className="input-row" style={{ width: "120px" }}>
                <label
                  htmlFor={`sanLuongMetLo-${index}`}
                  style={{ textAlign: "center", height: "30px" }}
                >
                  Sản lượng mét lò đào bình quân
                </label>
                <input
                  type="number"
                  id={`sanLuongMetLo-${index}`}
                  name="sanLuongMetLo"
                  placeholder="Nhập sản lượng"
                  className="input-text"
                  value={row.sanLuongMetLo}
                  onChange={(e) =>
                    handleRowChange(index, "sanLuongMetLo", e.target.value)
                  }
                  autoComplete="off"
                />
              </div>

              {/* 2 cột kết quả tính toán */}
              <div
                className="input-row"
                style={{ width: "100px", marginBottom: "21px" }}
              >
                <label
                  htmlFor={`dinhMucVatTuSCTX-${index}`}
                  style={{ textAlign: "center", height: "30px" }}
                >
                  Định mức vật tư SCTX
                </label>
                <input
                  type="text"
                  id={`dinhMucVatTuSCTX-${index}`}
                  name="dinhMucVatTuSCTX"
                  className="input-text"
                  value={row.dinhMucVatTuSCTX}
                  readOnly
                  style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                />
              </div>
              <div
                className="input-row"
                style={{ width: "100px", marginBottom: "21px" }}
              >
                <label
                  htmlFor={`chiPhiVatTuSCTX-${index}`}
                  style={{ textAlign: "center", height: "30px" }}
                >
                  Chi phí vật tư SCTX
                </label>
                <input
                  type="text"
                  id={`chiPhiVatTuSCTX-${index}`}
                  name="chiPhiVatTuSCTX"
                  className="input-text"
                  value={row.chiPhiVatTuSCTX}
                  readOnly
                  style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="layout-input-footer">
        <button className="btn-cancel" onClick={handleClose}>
          Hủy
        </button>
        <button
          className="btn-confirm"
          onClick={handleSubmit}
          disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
}