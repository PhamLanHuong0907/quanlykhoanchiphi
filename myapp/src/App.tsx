import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import PATHS from "./hooks/path";

// === Categories ===
import Unit from "./pages/Categories/Units/Units";
import UnitsInput from "./pages/Categories/Units/UnitsInput";
import UnitsEdit from "./pages/Categories/Units/UnitsEdit";

import ProductionStepGroup from "./pages/Categories/Production/ProductionStepGroup";
import ProductionStepGroupInput from "./pages/Categories/Production/ProductionStepGroupInput";
import ProductionStepGroupEdit from "./pages/Categories/Production/ProductionStepGroupEdit";

import ProductionStep from "./pages/Categories/Production/ProductionStep";
import ProductionStepInput from "./pages/Categories/Production/ProductionStepInput";
import ProductionStepEdit from "./pages/Categories/Production/ProductionStepEdit";

import WorkCode from "./pages/Categories/WorkCode/WorkCode";
import WorkCodeInput from "./pages/Categories/WorkCode/WorkCodeInput";
import WorkCodeEdit from "./pages/Categories/WorkCode/WorkCodeEdit";

import Materials from "./pages/Categories/Materials/Materials";
import MaterialsInput from "./pages/Categories/Materials/MaterialsInput";
import MaterialsEdit from "./pages/Categories/Materials/MaterialsEdit";

import Equipment from "./pages/Categories/Equipment/Equipment";
import EquipmentInput from "./pages/Categories/Equipment/EquipmentInput";
import EquipmentEdit from "./pages/Categories/Equipment/EquipmentEdit";

import SpareParts from "./pages/Categories/SpareParts/SpareParts";
import SparePartsInput from "./pages/Categories/SpareParts/SparePartsInput";
import SparePartsEdit from "./pages/Categories/SpareParts/SparePartEdit";

import Products from "./pages/Categories/Products/Products";
import ProductsInput from "./pages/Categories/Products/ProductsInput";
import ProductsEdit from "./pages/Categories/Products/ProductsEdit";

import AdjustmentFactors01 from "./pages/Categories/AdjustmentFactors/AdjustmentFactors01";
import AdjustmentFactor01Input from "./pages/Categories/AdjustmentFactors/AdjustmentFactor01Input";
import AdjustmentFactor01Edit from "./pages/Categories/AdjustmentFactors/AdjustmentFacor01Edit";

import AdjustmentFactors02 from "./pages/Categories/AdjustmentFactors/AdjustmentFactors02";
import AdjustmentFactors02Input from "./pages/Categories/AdjustmentFactors/AdjustmentFactor02Input";
import AdjustmentFactors02Edit from "./pages/Categories/AdjustmentFactors/AdjustmentFactor02Edit";

import Specification01 from "./pages/Categories/Specification/Hochieu/Specification01";
import Specification01Input from "./pages/Categories/Specification/Hochieu/Specification01Input";
import Specification01Edit from "./pages/Categories/Specification/Hochieu/Specification01Edit";

import Specification02 from "./pages/Categories/Specification/Dokienco/Specification02";
import Specification02Input from "./pages/Categories/Specification/Dokienco/Specification02Input";
import Specification02Edit from "./pages/Categories/Specification/Dokienco/Specification02Edit";

import Specification03 from "./pages/Categories/Specification/Tyledakep/Specification03";
import Specification03Input from "./pages/Categories/Specification/Tyledakep/Specification03Input";
import Specification03Edit from "./pages/Categories/Specification/Tyledakep/Specification03Edit";

import Specification04 from "./pages/Categories/Specification/Chen/Specification04";
import Specification04Input from "./pages/Categories/Specification/Chen/Specification04Input";
import Specification04Edit from "./pages/Categories/Specification/Chen/Specification04Edit";

import Specification05 from "./pages/Categories/Specification/Buocchong/Specification05";
import Specification05Input from "./pages/Categories/Specification/Buocchong/Specification05Input";
import Specification05Edit from "./pages/Categories/Specification/Buocchong/Specification05Edit";

// === Unit Price ===
import Materials_Ingredient from "./pages/UnitPrice/Materials_Ingredient";
import Materials_Ingredient_Input from "./pages/UnitPrice/Materials_Ingredient_Input";
import Materials_Ingredient_Edit from "./pages/UnitPrice/Materials_Ingredient_Edit";

import Repairs from "./pages/UnitPrice/Repairs";
import RepairsInput from "./pages/UnitPrice/Repairs_Input";
import RepairsEdit from "./pages/UnitPrice/Repairs_Edit";
import SlideRails from "./pages/UnitPrice/SlideRails";
import SlideRailsInput from "./pages/UnitPrice/SlideRailInput";
import SlideRailsEdit from "./pages/UnitPrice/SlideRailEdit";
import ElectricRails from "./pages/UnitPrice/ElectricRails";
import ElectricRailsInput from "./pages/UnitPrice/ElectricRailsInput";
import ElectricRailsEdit from "./pages/UnitPrice/ElectricRailsEdit";

import MarketRails from "./pages/UnitPrice/MarketRails";
import MarketRailsInput from "./pages/UnitPrice/MarketRailsInput";
import MarketRailsEdit from "./pages/UnitPrice/MarketRailsEdit";

import Materials_Cost from "./pages/Statics_ExecutionCost/Materials_Cost";
import Repairs_Cost from "./pages/Statics_ExecutionCost/Repairs_Cost";
import Electricity_Cost from "./pages/Statics_ExecutionCost/Electricity_Cost";
import Materials_PlanCost from "./pages/Statics_PlanedCost/Materials_PlanCost";
import Repairs_PlanCost from "./pages/Statics_PlanedCost/Repairs_PlanCost";
import Electricity_PlanCost from "./pages/Statics_PlanedCost/Electricity_PlanCost";


function App() {
  return (
    <Routes>
      {/* === Home === */}
      <Route path={PATHS.HOME} element={<Navbar />} />
      <Route path={PATHS.HOME_ALT} element={<Navbar />} />

      {/* === Categories === */}
      {/* Units */}
      <Route path={PATHS.UNIT.LIST} element={<Unit />} />
      <Route path={PATHS.UNIT.INPUT} element={<UnitsInput />} />
      <Route path="/Unit/Edit/:id" element={<UnitsEdit />} />

      {/* Production Step Group */}
      <Route path={PATHS.PRODUCTION_STEP_GROUP.LIST} element={<ProductionStepGroup />} />
      <Route path={PATHS.PRODUCTION_STEP_GROUP.INPUT} element={<ProductionStepGroupInput />} />
      <Route path="/ProductionStepGroup/Edit/:id" element={<ProductionStepGroupEdit />} />

      {/* Production Step */}
      <Route path={PATHS.PRODUCTION_STEP.LIST} element={<ProductionStep />} />
      <Route path={PATHS.PRODUCTION_STEP.INPUT} element={<ProductionStepInput />} />
      <Route path="/ProductionStep/Edit/:id" element={<ProductionStepEdit />} />

      {/* Work Code */}
      <Route path={PATHS.WORK_CODE.LIST} element={<WorkCode />} />
      <Route path={PATHS.WORK_CODE.INPUT} element={<WorkCodeInput />} />
      <Route path="/WorkCode/Edit/:id" element={<WorkCodeEdit />} />

      {/* Materials */}
      <Route path={PATHS.MATERIALS.LIST} element={<Materials />} />
      <Route path={PATHS.MATERIALS.INPUT} element={<MaterialsInput />} />
      <Route path="/Materials/Edit/:id" element={<MaterialsEdit />} />

      {/* Equipment */}
      <Route path={PATHS.EQUIPMENT.LIST} element={<Equipment />} />
      <Route path={PATHS.EQUIPMENT.INPUT} element={<EquipmentInput />} />
      <Route path="/Equipment/Edit/:id" element={<EquipmentEdit />} />

      {/* Spare Parts */}
      <Route path={PATHS.SPARE_PARTS.LIST} element={<SpareParts />} />
      <Route path={PATHS.SPARE_PARTS.INPUT} element={<SparePartsInput />} />
      <Route path="/SpareParts/Edit/:id" element={<SparePartsEdit />} />

      {/* Products */}
      <Route path={PATHS.PRODUCTS.LIST} element={<Products />} />
      <Route path={PATHS.PRODUCTS.INPUT} element={<ProductsInput />} />
      <Route path="/Products/Edit/:id" element={<ProductsEdit />} />

      {/* Adjustment Factors 01 */}
      <Route path={PATHS.ADJUSTMENT_FACTORS_01.LIST} element={<AdjustmentFactors01 />} />
      <Route path={PATHS.ADJUSTMENT_FACTORS_01.INPUT} element={<AdjustmentFactor01Input />} />
      <Route path="/AdjustmentFactors01/Edit/:id" element={<AdjustmentFactor01Edit />} />

      {/* Adjustment Factors 02 */}
      <Route path={PATHS.ADJUSTMENT_FACTORS_02.LIST} element={<AdjustmentFactors02 />} />
      <Route path={PATHS.ADJUSTMENT_FACTORS_02.INPUT} element={<AdjustmentFactors02Input />} />
      <Route path="/AdjustmentFactors02/Edit/:id" element={<AdjustmentFactors02Edit />} />

      {/* Specification 01 - Hộ chiếu */}
      <Route path={PATHS.SPECIFICATION_01.LIST} element={<Specification01 />} />
      <Route path={PATHS.SPECIFICATION_01.INPUT} element={<Specification01Input />} />
      <Route path="/Specification01/Edit/:id" element={<Specification01Edit />} />

      {/* Specification 02 - Độ kiên cố */}
      <Route path={PATHS.SPECIFICATION_02.LIST} element={<Specification02 />} />
      <Route path={PATHS.SPECIFICATION_02.INPUT} element={<Specification02Input />} />
      <Route path="/Specification02/Edit/:id" element={<Specification02Edit />} />

      {/* Specification 03 - Tỷ lệ da kẹp */}
      <Route path={PATHS.SPECIFICATION_03.LIST} element={<Specification03 />} />
      <Route path={PATHS.SPECIFICATION_03.INPUT} element={<Specification03Input />} />
      <Route path="/Specification03/Edit/:id" element={<Specification03Edit />} />

      {/* Specification 04 - Chèn */}
      <Route path={PATHS.SPECIFICATION_04.LIST} element={<Specification04 />} />
      <Route path={PATHS.SPECIFICATION_04.INPUT} element={<Specification04Input />} />
      <Route path="/Specification04/Edit/:id" element={<Specification04Edit />} />

      {/* Specification 05 - Buộc chồng */}
      <Route path={PATHS.SPECIFICATION_05.LIST} element={<Specification05 />} />
      <Route path={PATHS.SPECIFICATION_05.INPUT} element={<Specification05Input />} />
      <Route path="/Specification05/Edit/:id" element={<Specification05Edit />} />

      {/* === Unit Price === */}
      <Route path={PATHS.MATERIALS_INGREDIENT.LIST} element={<Materials_Ingredient />} />
      <Route path={PATHS.MATERIALS_INGREDIENT.INPUT} element={<Materials_Ingredient_Input />} />
      <Route path="/MaterialsIngredient/Edit/:id" element={<Materials_Ingredient_Edit />} />

      <Route path={PATHS.REPAIRS.LIST} element={<Repairs />} />
      <Route path={PATHS.REPAIRS.INPUT} element={<RepairsInput />} />
      <Route path="/Repairs/Edit/:id" element={<RepairsEdit />} />

      <Route path={PATHS.SLIDE_RAILS.LIST} element={<SlideRails />} />
      <Route path={PATHS.SLIDE_RAILS.INPUT} element={<SlideRailsInput />} />
      <Route path="/SlideRails/Edit/:id" element={<SlideRailsEdit />} />

      <Route path={PATHS.ELECTRIC_RAILS.LIST} element={<ElectricRails />} />
      <Route path={PATHS.ELECTRIC_RAILS.INPUT} element={<ElectricRailsInput />} />
      <Route path="/ElectricRails/Edit/:id" element={<ElectricRailsEdit />} />

      <Route path={PATHS.MARKET_RAILS.LIST} element={<MarketRails />} />
      <Route path={PATHS.MARKET_RAILS.INPUT} element={<MarketRailsInput />} />
      <Route path="/MarketRails/Edit/:id" element={<MarketRailsEdit />} />

      <Route path={PATHS.MATERIALS_COST.LIST} element={<Materials_Cost />} />
      <Route path={PATHS.REPAIRS_COST.LIST} element={<Repairs_Cost/>}/>
      <Route path={PATHS.ELECTRICITY_COST.LIST} element={<Electricity_Cost/>}/>
      <Route path={PATHS.MATERIALS_PLANCOST.LIST} element={<Materials_PlanCost/>}/>
      <Route path={PATHS.REPAIRS_PLANCOST.LIST} element={<Repairs_PlanCost/>}/>
      <Route path={PATHS.ELECTRICITY_PLANCOST.LIST} element={<Electricity_PlanCost/>}/>
    </Routes>
  );
}

export default App;
