import React, { useEffect, useState } from "react";
import LayoutInput from "../../../layout/layout_input";
import PATHS from "../../../hooks/path";
import DropdownMenuSearchable from "../../../components/dropdown_menu_searchable";
import { useApi } from "../../../hooks/useFetchData";

// 1. Định nghĩa Props
interface ProductsEditProps {
  id?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

// 2. Interface cho dữ liệu Product (GET {id})
// (Giả định API GET {id} trả về các ID khóa ngoại)
interface Product {
  id: string;
  code: string;
  name: string;
  processGroupId: string;
  hardnessId: string;
  stoneClampRatioId: string;
  insertItemId: string;
}

// Interface cho các tùy chọn dropdown (Utility)
interface DropdownOption {
  value: string;
  label: string;
}

// Interfaces cho dữ liệu trả về từ API dropdown
interface ProcessGroup { id: string; code: string; }
interface ProductProperty { id: string; value: string; }

const ProductsEdit: React.FC<ProductsEditProps> = ({ id, onClose, onSuccess }) => {
  // 3. ====== API setup ======
  const productPath = "/api/product/product";
  const processGroupPath = "/api/process/processgroup";
  const hardnessPath = "/api/product/hardness";
  const stoneClampRatioPath = "/api/product/stoneclampratio";
  const insertItemPath = "/api/product/insertitem";

  // API GET/PUT
  const { fetchById, putData, loading: loadingMaterial, error: errorMaterial } =
    useApi<Product>(productPath);

  // API GET Dropdowns
  const { fetchData: fetchProcessGroups, data: processGroups, loading: loadingProcessGroup, error: errorProcessGroup } =
    useApi<ProcessGroup>(processGroupPath);
  const { fetchData: fetchHardness, data: hardness, loading: loadingHardness, error: errorHardness } =
    useApi<ProductProperty>(hardnessPath);
  const { fetchData: fetchStoneClampRatios, data: stoneClampRatios, loading: loadingStoneClamp, error: errorStoneClamp } =
    useApi<ProductProperty>(stoneClampRatioPath);
  const { fetchData: fetchInsertItems, data: insertItems, loading: loadingInsertItem, error: errorInsertItem } =
    useApi<ProductProperty>(insertItemPath);

  // 4. ====== State ======
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  // State cho 4 dropdowns
  const [selectedProcessGroup, setSelectedProcessGroup] = useState<string>("");
  const [selectedHardness, setSelectedHardness] = useState<string>("");
  const [selectedStoneClamp, setSelectedStoneClamp] = useState<string>("");
  const [selectedInsertItem, setSelectedInsertItem] = useState<string>("");
  // State cho text inputs
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  // 5. ====== Load material by ID ======
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const res = await fetchById(id);
      if (res) setCurrentProduct(res as Product);
    };
    loadData();
  }, [id, fetchById]);

  // 6. ====== Load dropdowns ======
  useEffect(() => {
    fetchProcessGroups();
    fetchHardness();
    fetchStoneClampRatios();
    fetchInsertItems();
  }, [fetchProcessGroups, fetchHardness, fetchStoneClampRatios, fetchInsertItems]);

  // 7. ====== Sync data to form (QUAN TRỌNG) ======
  useEffect(() => {
    if (currentProduct) {
      // Sync text inputs
      setFormData({
        code: currentProduct.code,
        name: currentProduct.name,
      });
      // Sync dropdowns
      setSelectedProcessGroup(currentProduct.processGroupId || "");
      setSelectedHardness(currentProduct.hardnessId || "");
      setSelectedStoneClamp(currentProduct.stoneClampRatioId || "");
      setSelectedInsertItem(currentProduct.insertItemId || "");
    }
  }, [currentProduct]); // Phụ thuộc vào currentProduct

  // 8. Map data API sang định dạng DropdownOption
  const processGroupOptions: DropdownOption[] =
    processGroups?.map((g) => ({ value: g.id, label: g.code })) || [];
  const hardnessOptions: DropdownOption[] =
    hardness?.map((h) => ({ value: h.id, label: h.value })) || [];
  const stoneClampOptions: DropdownOption[] =
    stoneClampRatios?.map((s) => ({ value: s.id, label: s.value })) || [];
  const insertItemOptions: DropdownOption[] =
    insertItems?.map((i) => ({ value: i.id, label: i.value })) || [];

  // 9. ====== PUT submit ======
  const handleSubmit = async (data: Record<string, string>) => {
    if (!id) return alert("❌ Thiếu ID để cập nhật!");

    const code = data["Mã sản phẩm"]?.trim();
    const name = data["Tên sản phẩm"]?.trim();

    // Validation
    if (!selectedProcessGroup) return alert("⚠️ Vui lòng chọn Nhóm công đoạn sản xuất!");
    if (!code) return alert("⚠️ Vui lòng nhập Mã sản phẩm!");
    if (!name) return alert("⚠️ Vui lòng nhập Tên sản phẩm!");
    if (!selectedHardness) return alert("⚠️ Vui lòng chọn Độ kiên cố than đá!");
    if (!selectedStoneClamp) return alert("⚠️ Vui lòng chọn Tỷ lệ đá kẹp!");
    if (!selectedInsertItem) return alert("⚠️ Vui lòng chọn Chèn!");

    // Tạo payload (giống hệt payload của Input, nhưng thêm ID)
    const payload = {
      id,
      code,
      name,
      processGroupId: selectedProcessGroup,
      hardnessId: selectedHardness,
      stoneClampRatioId: selectedStoneClamp,
      insertItemId: selectedInsertItem,
    };

    console.log("📤 PUT payload:", payload);

    // Gửi dữ liệu
    await putData(payload, () => {
      console.log("✅ Cập nhật sản phẩm thành công!");
      onSuccess?.();
      onClose?.();
    });
  };

  // 10. ====== Fields (Dùng custom placeholders) ======
  const fields = [
    { type: "custom1" as const }, // Placeholder cho Nhóm CĐSX
    { label: "Mã sản phẩm", type: "text" as const, placeholder: "Nhập mã sản phẩm, ví dụ: SP01" },
    { label: "Tên sản phẩm", type: "text" as const, placeholder: "Nhập tên sản phẩm, ví dụ: Lò chợ 11-1.26 lò chống..." },
  ];

  // 11. Tính toán trạng thái loading/error tổng
  const isLoading = loadingMaterial || loadingProcessGroup || loadingHardness || loadingStoneClamp || loadingInsertItem;
  const anyError = errorMaterial || errorProcessGroup || errorHardness || errorStoneClamp || errorInsertItem;

  return (
      <LayoutInput
        title01="Danh mục / Sản phẩm"
        title="Chỉnh sửa Sản phẩm"
        fields={fields}
        onSubmit={handleSubmit}
        closePath={PATHS.PRODUCTS.LIST}
        onClose={onClose}
        initialData={{
          "Mã sản phẩm": formData.code,
          "Tên sản phẩm": formData.name,
        }}
        // QUAN TRỌNG: Cần cờ này để cập nhật form khi data async về
        shouldSyncInitialData={true}
      >
        {/* Render các dropdown tùy chỉnh */}
        <div className="custom1" key={1}>
          <DropdownMenuSearchable
            label="Nhóm công đoạn sản xuất"
            options={processGroupOptions}
            value={selectedProcessGroup}
            onChange={setSelectedProcessGroup}
            placeholder="Chọn mã nhóm công đoạn sản xuất"
            isDisabled={loadingProcessGroup}
          />
        </div>
      </LayoutInput>


  );
};

export default ProductsEdit;