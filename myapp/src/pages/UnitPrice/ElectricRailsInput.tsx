import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select
import { useApi } from "../../hooks/useFetchData"; // Import hook API
import PATHS from "../../hooks/path"; // Import PATHS
import "../../layout/layout_input.css";
import "../../components/transactionselector.css"; // Import CSS cho react-select

// === Định nghĩa interface cho dữ liệu ===

// Interface cho API GET /api/catalog/equipment (CHỈ LẤY DANH SÁCH)
interface EquipmentListItem {
  id: string;
  code: string;
}

// Interface cho mảng costs lồng nhau
interface EquipmentCost {
  startDate: string;
  endDate: string;
  costType: number;
  amount: number;
}

// Interface cho API GET /api/catalog/equipment/{id} (DỮ LIỆU CHI TIẾT)
interface EquipmentDetail {
  id: string;
  code: string;
  name: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  costs: EquipmentCost[];
}

// Dữ liệu cho mỗi hàng THIẾT BỊ hiển thị trên UI
interface EquipmentRowData {
  equipmentId: string;
  tenThietbi: string;
  donViTinh: string;
  dongiadiennang: number;
  monthlyElectricityCost: string;
  averageMonthlyTunnelProduction: string;
  dinhmucdiennang: string;
  chiphidiennang: string;
}

// Interface cho payload chính gửi đi
interface PostPayload {
  equipmentId: string;
  monthlyElectricityCost: number;
  averageMonthlyTunnelProduction: number;
}
// === KẾT THÚC THAY ĐỔI ===

export default function ElectricRailsInput({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const closePath = PATHS.ELECTRIC_RAILS.LIST;

  // === Gọi API ===
  // 1. API GET cho dropdown (Tự động chạy khi mount)
  const { data: equipmentListData = [] } = useApi<EquipmentListItem>(
    "/api/catalog/equipment"
  );

  // 2. API POST (Dùng để submit)
  const { postData, loading: isSubmitting } = useApi<PostPayload>(
    "/api/pricing/electricityunitpriceequipment"
  );

  // 3. API GET BY ID (Dùng để lấy chi tiết khi chọn)
  // *** SỬA LỖI: Dùng hàm fetchById và loading từ hook ***
  const { fetchById: getEquipmentDetail, loading: isLoadingRows } =
    useApi<EquipmentDetail>("/api/catalog/equipment"); // Base path

  // === State ===
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentRowData[]>([]);
  // Không cần state loading thủ công nữa
  // const [isLoadingRows, setIsLoadingRows] = useState(false); 

  // === Memoized Options cho Dropdown ===
  const equipmentOptions = useMemo(() => {
    return equipmentListData.map((eq) => ({
      value: eq.id,
      label: eq.code,
    }));
  }, [equipmentListData]);

  // === Xử lý sự kiện ===

  const handleClose = () => {
    onClose?.();
    if (!onClose && closePath) navigate(closePath);
  };

  // KHI NGƯỜI DÙNG THAY ĐỔI LỰA CHỌN TRONG DROPDOWN
  const handleSelectChange = async (selected: any) => {
    // Không cần set loading thủ công
    const newSelectedIds = selected ? selected.map((s: any) => s.value) : [];
    setSelectedEquipmentIds(newSelectedIds);

    if (newSelectedIds.length === 0) {
      setEquipmentRows([]);
      return;
    }

    try {
      // *** SỬA LỖI: Gọi hàm 'getEquipmentDetail' (chính là 'fetchById') ***
      const detailPromises = newSelectedIds.map((id: string) =>
        getEquipmentDetail(id) // Gọi hàm từ hook
      );

      const detailedEquipments = await Promise.all(detailPromises);
      
      // Lọc ra các kết quả không null (vì fetchById có thể trả về null)
      const validEquipments = detailedEquipments.filter(
        (eq): eq is EquipmentDetail => eq !== null
      );

      // Chuyển đổi dữ liệu chi tiết thành dữ liệu hàng
      const newRows = validEquipments.map(
        (eq): EquipmentRowData => {
          const electricCostObj = eq.costs
            ? eq.costs.find((c) => c.costType === 2)
            : null;
          const donGia = electricCostObj ? electricCostObj.amount : 0;

          return {
            equipmentId: eq.id,
            tenThietbi: eq.name || "N/A",
            donViTinh: eq.unitOfMeasureName || "N/A",
            dongiadiennang: donGia,
            monthlyElectricityCost: "",
            averageMonthlyTunnelProduction: "",
            dinhmucdiennang: "0",
            chiphidiennang: "0",
          };
        }
      );

      setEquipmentRows(newRows);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết thiết bị:", error);
      setEquipmentRows([]);
    } 
    // Không cần finally để set loading
  };

  // Khi người dùng nhập liệu vào một hàng
  const handleRowChange = (
    index: number,
    field: keyof EquipmentRowData,
    value: string
  ) => {
    const newRows = [...equipmentRows];
    const updatedRow = { ...newRows[index], [field]: value };

    // Logic tính toán
    const donGia = updatedRow.dongiadiennang || 0;
    const dienNangTieuThu = parseFloat(updatedRow.monthlyElectricityCost) || 0;
    const sanLuong = parseFloat(updatedRow.averageMonthlyTunnelProduction) || 0;

    let dinhMuc = 0;
    if (sanLuong !== 0) dinhMuc = dienNangTieuThu / sanLuong;
    const chiPhi = dinhMuc * donGia;

    updatedRow.dinhmucdiennang = dinhMuc.toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    });
    updatedRow.chiphidiennang = chiPhi.toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    });

    newRows[index] = updatedRow;
    setEquipmentRows(newRows);
  };

  // Khi người dùng nhấn nút "Xác nhận" (Gửi nhiều request POST)
  const handleSubmit = async () => {
    const submitPromises = equipmentRows.map((row) => {
      const payload: PostPayload = {
        equipmentId: row.equipmentId,
        monthlyElectricityCost: parseFloat(row.monthlyElectricityCost) || 0,
        averageMonthlyTunnelProduction:
          parseFloat(row.averageMonthlyTunnelProduction) || 0,
      };
      return postData(payload); // Hàm postData từ hook
    });

    try {
      await Promise.all(submitPromises);
      console.log("📤 Đã gửi thành công TẤT CẢ request");
      handleClose();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu (ít nhất 1 request thất bại):", error);
    }
  };

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
          Đơn giá và định mức / Đơn giá và định mức điện năng
        </div>
        <div className="line"></div>
        <div className="header02">Tạo mới Đơn giá và định mức điện năng</div>
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
            className="transaction-select-wrapper"
            classNamePrefix="transaction-select"
            placeholder="Chọn Mã thiết bị"
            // *** SỬA LỖI: Dùng state loading từ hook getById ***
            isDisabled={isLoadingRows} 
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
        </div>

        {/* ============================================== */}
        {/* HIỂN THỊ CÁC HÀNG THIẾT BỊ          */}
        {/* ============================================== */}
        <div
          style={{
            marginTop: "80px",
            width: "100%",
            maxHeight: "400px",
            overflowY: "auto",
            minHeight: "100px", 
          }}
        >
          {/* *** SỬA LỖI: Dùng state loading từ hook getById *** */}
          {isLoadingRows && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Đang tải dữ liệu thiết bị...
            </div>
          )}

          {!isLoadingRows &&
            equipmentRows.map((row, index) => (
              <div
                key={row.equipmentId}
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
                {/* === CÁC TRƯỜNG READ-ONLY === */}
                {/* 1. Tên thiết bị */}
                <div
                  className="input-row"
                  style={{ width: "120px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`tenThietbi-${index}`}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      height: "30px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Tên thiết bị
                  </label>
                  <input
                    type="text"
                    id={`tenThietbi-${index}`}
                    name="tenThietbi"
                    className="input-text"
                    value={row.tenThietbi}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>

                {/* 2. Đơn giá điện năng */}
                <div
                  className="input-row"
                  style={{ width: "100px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`dongiadiennang-${index}`}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      height: "30px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Đơn giá điện năng
                  </label>
                  <input
                    type="text"
                    id={`dongiadiennang-${index}`}
                    name="dongiadiennang"
                    className="input-text"
                    value={row.dongiadiennang.toLocaleString("vi-VN")}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>

                {/* 3. Đơn vị tính */}
                <div
                  className="input-row"
                  style={{ width: "80px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`donViTinh-${index}`}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      height: "30px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ĐVT
                  </label>
                  <input
                    id={`donViTinh-${index}`}
                    name="donViTinh"
                    className="input-text"
                    value={row.donViTinh}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>

                {/* === CÁC TRƯỜNG EDITABLE === */}
                <div className="input-row" style={{ width: "120px" }}>
                  <label
                    htmlFor={`monthlyElectricityCost-${index}`}
                    style={{ textAlign: "center", height: "30px" }}
                  >
                    Điện năng tiêu thụ/tháng
                  </label>
                  <input
                    type="number"
                    id={`monthlyElectricityCost-${index}`}
                    name="monthlyElectricityCost"
                    placeholder="Nhập điện năng"
                    className="input-text"
                    value={row.monthlyElectricityCost}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "monthlyElectricityCost",
                        e.target.value
                      )
                    }
                    autoComplete="off"
                  />
                </div>

                <div className="input-row" style={{ width: "120px" }}>
                  <label
                    htmlFor={`averageMonthlyTunnelProduction-${index}`}
                    style={{ textAlign: "center", height: "30px" }}
                  >
                    Sản lượng mét lò BQ
                  </label>
                  <input
                    type="number"
                    id={`averageMonthlyTunnelProduction-${index}`}
                    name="averageMonthlyTunnelProduction"
                    placeholder="Nhập sản lượng"
                    className="input-text"
                    value={row.averageMonthlyTunnelProduction}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "averageMonthlyTunnelProduction",
                        e.target.value
                      )
                    }
                    autoComplete="off"
                  />
                </div>

                {/* === CÁC TRƯỜNG TÍNH TOÁN === */}
                <div
                  className="input-row"
                  style={{ width: "100px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`dinhmucdiennang-${index}`}
                    style={{ textAlign: "center", height: "30px" }}
                  >
                    Định mức điện năng
                  </label>
                  <input
                    type="text"
                    id={`dinhmucdiennang-${index}`}
                    name="dinhmucdiennang"
                    className="input-text"
                    value={row.dinhmucdiennang}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>
                <div
                  className="input-row"
                  style={{ width: "100px", marginBottom: "21px" }}
                >
                  <label
                    htmlFor={`chiphidiennang-${index}`}
                    style={{ textAlign: "center", height: "30px" }}
                  >
                    Chi phí điện năng
                  </label>
                  <input
                    type="text"
                    id={`chiphidiennang-${index}`}
                    name="chiphidiennang"
                    className="input-text"
                    value={row.chiphidiennang}
                    readOnly
                    style={{ width: "100%", backgroundColor: "#f1f2f5" }}
                  />
                </div>
              </div>
            ))}

          {/* Hiển thị khi không có hàng nào và không loading */}
          {!isLoadingRows && equipmentRows.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#888",
              }}
            >

            </div>
          )}
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
          // *** SỬA LỖI: Dùng cả hai state loading ***
          disabled={isSubmitting || isLoadingRows} 
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
}