import React, { useState } from "react";
import TransactionSelector, {type TransactionRow} from "../components/transactionselector" ;

const ParentPage: React.FC = () => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [rows, setRows] = useState<TransactionRow[]>([]);

  const options = [
    { value: "VLN", label: "VLN" },
    { value: "GL", label: "GL" },
    { value: "ABC", label: "ABC" },
  ];

  const handleSelectChange = (newSelected: string[]) => {
    setSelectedCodes(newSelected);

    const newRows = newSelected.map((code) => {
      const existing = rows.find((r) => r.code === code);
      return (
        existing || {
          id: code,
          code,
          assetCode: "TNLD",
          unitPrice: 0,
          quantity: "",
          total: 0,
        }
      );
    });
    setRows(newRows);
  };

  const handleRowChange = (id: string, field: keyof TransactionRow, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: value,
              total:
                field === "quantity"
                  ? Number(value) * (r.unitPrice ?? 0)
                  : r.total,
            }
          : r
      )
    );
  };

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
    setSelectedCodes(selectedCodes.filter((c) => c !== id));
  };

  return (
    <TransactionSelector
      label="Mã giao khoản"
      options={options}
      selectedCodes={selectedCodes}
      rows={rows}
      onSelectChange={handleSelectChange}
      onRowChange={handleRowChange}
      onRemoveRow={handleRemoveRow}
    />
  );
};

export default ParentPage;
