// THAY ĐỔI: Thêm 'useMemo'
import  { useEffect, useState, useMemo } from "react";
import LayoutInput from "../../layout/layout_input";
// Import TransactionRow GỐC (không có materialId)
import TransactionSelector, { type TransactionRow as ImportedTransactionRow } from "../../components/transactionselector"; 
import PATHS from "../../hooks/path";
import { useApi } from "../../hooks/useFetchData";
import DropdownMenuSearchable from "../../components/dropdown_menu_searchable";

// 1. Cập nhật Props
interface Materials_Ingredient_InputProps {
onClose?: () => void;
onSuccess?: () => void;
}

// 2. Interface (Chung)
interface DropdownOption {
value: string;
label: string;
data?: any; // Để lưu trữ thông tin bổ sung
}

// 3. Interfaces (API Payloads)
interface Process { id: string; name: string; } 
interface Passport { id: string; name: string; }
interface Hardness { id: string; value: string; }
interface InsertItem { id: string; value: string; }
interface SupportStep { id: string; value: string; }
interface AssignmentCode { 
  id: string; 
  code: string; 
  name: string; 
}
interface Material { 
id: string; 
code: string; 
name: string;
assigmentCodeId: string; 
costAmmount: number; 
}

// 4. Interface (State nội bộ)
interface LocalTransactionRow extends ImportedTransactionRow {
materialId: string; 
assignmentCodeId: string; // <-- ID của Mã giao khoán
}

export default function Materials_Ingredient_Input({ onClose, onSuccess }: Materials_Ingredient_InputProps) {

// 5. ====== API setup ======
const postPath = "/api/pricing/materialunitprice";
const { postData, loading: saving, error: saveError } = useApi(postPath);

// API GET Dropdowns

const { fetchData: fetchProcesses, data: processes, loading: ld2 } = 
 useApi<Process>("/api/process/productionprocess?pageIndex=1&pageSize=1000"); 
const { fetchData: fetchPassports, data: passports, loading: ld3 } = 
 useApi<Passport>("/api/product/passport?pageIndex=1&pageSize=1000");
const { fetchData: fetchHardness, data: hardness, loading: ld4 } = 
 useApi<Hardness>("/api/product/hardness?pageIndex=1&pageSize=1000");
const { fetchData: fetchInsertItems, data: insertItems, loading: ld5 } = 
 useApi<InsertItem>("/api/product/insertitem?pageIndex=1&pageSize=1000");
const { fetchData: fetchSupportSteps, data: supportSteps, loading: ld6 } = 
 useApi<SupportStep>("/api/product/supportstep?pageIndex=1&pageSize=1000");
const { fetchData: fetchAssignmentCodes, data: assignmentData, loading: ld7 } = 
 useApi<any>("/api/catalog/assignmentcode?pageIndex=1&pageSize=1000");
const { fetchData: fetchMaterials, data: materialsData, loading: ld8 } = 
 useApi<any>("/api/catalog/material?pageIndex=1&pageSize=1000");

// 6. ====== State ======
const [selectedProcess, setSelectedProcess] = useState<string>(""); 
const [selectedPassport, setSelectedPassport] = useState<string>("");
const [selectedHardness, setSelectedHardness] = useState<string>("");
const [selectedInsertItem, setSelectedInsertItem] = useState<string>("");
const [selectedSupportStep, setSelectedSupportStep] = useState<string>("");
const [selectedCodes, setSelectedCodes] = useState<string[]>([]); 
const [rows, setRows] = useState<LocalTransactionRow[]>([]); 

// 7. ====== Load dropdowns ======
const [isInitialLoading, setIsInitialLoading] = useState(true);
useEffect(() => {
    // 3. Định nghĩa một hàm async bên trong
    const fetchAllData = async () => {
      setIsInitialLoading(true); // Bắt đầu loading
      
      try {
        // 4. Gọi Promise.allSettled với MẢNG các hàm fetch
        const results = await Promise.allSettled([
          fetchProcesses(),
          fetchPassports(),
          fetchHardness(),
          fetchInsertItems(),
          fetchSupportSteps(),
          fetchAssignmentCodes(),
          fetchMaterials(),
        ]);

        // (Tùy chọn) Bạn có thể kiểm tra kết quả ở đây
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            // Log ra API nào bị lỗi
            console.error(`API call ${index} thất bại:`, result.reason);
          }
        });

      } catch (error) {
        // Lỗi này hiếm khi xảy ra với allSettled,
        // nhưng vẫn nên có để bắt lỗi cú pháp
        console.error('Lỗi không mong đợi:', error);
      } finally {
        // 5. Tắt loading sau khi TẤT CẢ đã hoàn thành (kể cả lỗi)
        setIsInitialLoading(false);
      }
    };

    // 6. Gọi hàm async đó
    fetchAllData();

  }, [
    // 7. Mảng dependencies vẫn giữ nguyên, điều này là đúng
    fetchProcesses,
    fetchPassports,
    fetchHardness,
    fetchInsertItems,
    fetchSupportSteps,
    fetchAssignmentCodes,
    fetchMaterials,
  ]);

  // THAY ĐỔI 1: Sửa logic trích xuất allMaterials
 const allMaterials: Material[] = useMemo(() => {
  if (!materialsData) return []; // Guard for null
    // Check nếu là cấu trúc [ { items: [...] } ]
  if (Array.isArray(materialsData) && materialsData.length > 0 && materialsData[0] && materialsData[0].items) {
    return materialsData[0].items; 
  }
    // Check nếu là mảng [ ... ]
  if (Array.isArray(materialsData)) return materialsData; 
  return [];
 }, [materialsData]);


// 8. ====== Map options ======

const processOptions: DropdownOption[] = processes?.map((p) => ({ value: p.id, label: p.name })) || []; 
const passportOptions: DropdownOption[] = passports?.map((p) => ({ value: p.id, label: p.name })) || [];
const hardnessOptions: DropdownOption[] = hardness?.map((h) => ({ value: h.id, label: h.value })) || [];
const insertItemOptions: DropdownOption[] = insertItems?.map((i) => ({ value: i.id, label: i.value })) || [];
const supportStepOptions: DropdownOption[] = supportSteps?.map((s) => ({ value: s.id, label: s.value })) || [];

 // THAY ĐỔI 2: Sửa logic trích xuất assignmentCodeOptions (Đây là nơi gây lỗi)
const assignmentCodeOptions: DropdownOption[] = useMemo(() => {
  if (!assignmentData) return []; // Guard for null
    // Check nếu là cấu trúc [ { items: [...] } ] (Nguyên nhân lỗi của bạn ở đây)
  if (Array.isArray(assignmentData) && assignmentData.length > 0 && assignmentData[0] && assignmentData[0].items) {
    return assignmentData[0].items.map((a: AssignmentCode) => ({ value: a.id, label: a.code }));
  }
    // Check nếu là mảng [ ... ]
  if (Array.isArray(assignmentData)) { 
    return assignmentData.map((a: AssignmentCode) => ({ value: a.id, label: a.code }));
  }
  return [];
 }, [assignmentData]);

// 9. ====== TransactionSelector Handlers (LOGIC MỚI) ======
const handleSelectChange = (newSelectedIds: string[]) => {
 setSelectedCodes(newSelectedIds); // newSelectedIds là mảng các ID
 
 if (!allMaterials || !assignmentData) return; 

   // THAY ĐỔI 3: Sửa logic trích xuất mảng để tạo Map
   let codesArray: AssignmentCode[] = [];
   if (Array.isArray(assignmentData) && assignmentData.length > 0 && assignmentData[0] && assignmentData[0].items) {
       codesArray = assignmentData[0].items;
   } else if (Array.isArray(assignmentData)) {
       codesArray = assignmentData;
   }
   
   const assignmentCodeMap = new Map<string, string>(
     codesArray.map((a: AssignmentCode) => [a.id, a.code])
   );

 const oldRows = [...rows];
 const newRows: LocalTransactionRow[] = [];

 newSelectedIds.forEach(codeId => { // codeId là ID (e.g., "0359...")
     const assignmentCodeValue = assignmentCodeMap.get(codeId) || codeId; 

 const materialsForThisCode = allMaterials.filter(
  (m) => m.assigmentCodeId === codeId
 );

 materialsForThisCode.forEach(material => {
  const existingRow = oldRows.find(
  (r) => r.assignmentCodeId === codeId && r.materialId === material.id
  );

  if (existingRow) {
       existingRow.code = assignmentCodeValue; 
    newRows.push(existingRow);
  } else {
    newRows.push({
     id: `r${Date.now()}-${codeId}-${material.id}`, 
     code: assignmentCodeValue, // <-- Dùng CODE ("VLN") để hiển thị
         assignmentCodeId: codeId, // <-- Dùng ID ("0359...") cho logic
     materialId: material.id, 
     assetCode: material.code, // Mã vật tư (e.g., "GT")
     unitPrice: material.costAmmount || 0, 
     quantity: "0",
     total: 0,
    });
  }
 });
 });

 setRows(newRows);
};

const handleRowChange = (id: string, field: keyof ImportedTransactionRow, value: string) => {
 if (field !== "quantity") return;

 setRows((prevRows) =>
 prevRows.map((row) => {
  if (row.id === id) {
  const updatedRow = { ...row, quantity: value };
  const quantityNumber = parseFloat(value || "0"); 
  const unitPrice = updatedRow.unitPrice ?? 0;
  updatedRow.total = isNaN(quantityNumber) ? 0 : quantityNumber * unitPrice;
  return updatedRow;
  }
  return row;
 })
 );
};

const handleRemoveRow = (id: string) => { // 'id' là React key (e.g., "r123...")
 setRows((prevRows) => prevRows.filter(row => row.id !== id));
};

// 1000. ====== Handle Submit ======
const handleSubmit = async (data: Record<string, string>) => {
 const code = data["Mã định mức vật liệu"]?.trim() || "";

 // Validation
 if (!code) return alert("⚠️ Vui lòng nhập Mã định mức vật liệu!");
 if (!selectedProcess) return alert("⚠️ Vui lòng chọn Công đoạn!"); 
 if (!selectedPassport) return alert("⚠️ Vui lòng chọn Hộ chiếu!");
 if (!selectedHardness) return alert("⚠️ Vui lòng chọn Độ kiên cố!");
 if (!selectedInsertItem) return alert("⚠️ Vui lòng chọn Chèn!");
 if (!selectedSupportStep) return alert("⚠️ Vui lòng chọn Bước chống!");
 if (rows.length === 0) return alert("⚠️ Vui lòng chọn ít nhất một Mã giao khoán!");
 
 for (const row of rows) {
 const quantity = parseFloat(row.quantity || "0");
 if (isNaN(quantity) || quantity <= 0) {
  const mgkLabel = row.code; 
  return alert(`⚠️ Vui lòng nhập Số lượng (Định mức) hợp lệ cho Vật tư "${row.assetCode}" (MGK: ${mgkLabel})!`);
 }
 }

 // Tạo payload
 const payload = {
 code, 
 processId: selectedProcess, 
 passportId: selectedPassport,
 hardnessId: selectedHardness,
 insertItemId: selectedInsertItem,
 supportStepId: selectedSupportStep,
 costs: rows.map(row => ({
   assignmentCodeId: row.assignmentCodeId, 
   materialId: row.materialId, 
   quantity: parseFloat(row.quantity || "0"),
 })),
 };

 console.log("📤 POST payload:", payload);

 await postData(payload, () => {
 console.log("✅ Tạo đơn giá vật liệu thành công!");
 onSuccess?.();
 onClose?.();
 });
};

// 11. ====== Fields (LayoutInput) ======
const fields = [
 { label: "Mã định mức vật liệu", type: "text" as const, placeholder: "Nhập mã định mức dữ liệu" },
 { type: "custom2" as const }, 
 { type: "custom3" as const }, 
 { type: "custom4" as const }, 
 { type: "custom5" as const }, 
 { type: "custom6" as const }, 
 { label: "", type: "customTransactionSelector" as const },
];

const isLoading = ld2 || ld3 || ld4 || ld5 || ld6 || ld7 || ld8 || saving;
const anyError = saveError;

return (
 <LayoutInput
  title01="Đơn giá và định mức / Đơn giá và định mức Vật liệu"
  title="Tạo mới Đơn giá và định mức Vật liệu"
  fields={fields}
  onSubmit={handleSubmit}
  closePath={PATHS.MATERIALS_INGREDIENT.LIST}
  onClose={onClose}
  initialData={{
   "Mã định mức vật liệu": ""
  }}
 >
  {/* 12. Render Dropdowns */}

  <div className="custom2" key="c2">
  <DropdownMenuSearchable
   label="Công đoạn" 
   options={processOptions}
   value={selectedProcess}
   onChange={setSelectedProcess}
   placeholder="Chọn công đoạn"
   isDisabled={ld2}
  />
  </div>
  <div className="custom3" key="c3">
  <DropdownMenuSearchable
   label="Hộ chiếu, Sđ, Sc"
   options={passportOptions}
   value={selectedPassport}
   onChange={setSelectedPassport}
   placeholder="Chọn hộ chiếu"
   isDisabled={ld3}
  />
  </div>
  <div className="custom4" key="c4">
  <DropdownMenuSearchable
   label="Độ kiên cố đá/ than (f)"
   options={hardnessOptions}
   value={selectedHardness}
   onChange={setSelectedHardness}
   placeholder="Chọn độ kiên cố"
   isDisabled={ld4}
  />
  </div>
  <div className="custom5" key="c5">
  <DropdownMenuSearchable
   label="Chèn"
   options={insertItemOptions}
   value={selectedInsertItem}
   onChange={setSelectedInsertItem}
   placeholder="Chọn chèn..."
   isDisabled={ld5}
  />
  </div>
  <div className="custom6" key="c6">
  <DropdownMenuSearchable
   label="Bước chống"
   options={supportStepOptions}
   value={selectedSupportStep}
   onChange={setSelectedSupportStep}
   placeholder="Chọn bước chống"
   isDisabled={ld6}
  />
  </div>

  {/* 13. Render TransactionSelector */}
  <TransactionSelector
  label="Mã giao khoán"
  className="customTransactionSelector" 
  options={assignmentCodeOptions} // Dropdown dùng code
  selectedCodes={selectedCodes}
  rows={rows} // rows bây giờ có 'code' là "VLN" và 'assetCode' là "GT"
  onSelectChange={handleSelectChange}
  onRowChange={handleRowChange}
  onRemoveRow={handleRemoveRow}
  />
 </LayoutInput>
);
}