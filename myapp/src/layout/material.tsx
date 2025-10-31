import React from "react";
import "./material.css";

interface MaterialItem {
  code: string;
  name: string;
  unit: string;
  price: string;
  quota: string;
  total: string;
}

interface MaterialGroup {
  id: number;
  code: string;
  sumoftotal: string;
  items: MaterialItem[];
}

interface MaterialGroupTableProps {
  title: string;
  data: MaterialGroup[];
}

const MaterialGroupTable: React.FC<MaterialGroupTableProps> = ({ title, data }) => {
  return (
    <div className="material-table-container">
      {/* Header title */}
      <div className="material-header">
        <div className="material-header-left">{title}</div>
      </div>

      {/* Table */}
      <table className="material-table">
        <thead>
          <tr>
            <th style={{width: "7.8%"}}>STT</th>
            <th style={{width: " 19.2%", textAlign: "left"}}>Mã giao khoán</th>
            <th style={{width: "16%", textAlign:"left", paddingLeft:"2%"}}>Mã vật tư, tài sản</th>
            <th style={{width: "18%", textAlign:"left"}}>Tên vật tư, tài sản</th>
            <th style={{width: "5%", textAlign: "left"}}>ĐVT</th>
            <th style={{width: "14%", textAlign:"left", paddingLeft:"3%"}}>Đơn giá</th>
            <th style={{width: "8.5%", textAlign:"left"}}>Định mức</th>
            <th  style={{width: "11.5%",textAlign:"left"}}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group) => (
            <React.Fragment key={group.id}>
              <tr className="group-row">
                <td style={{textAlign:"center"}}>{group.id}</td>
                <td className="bold" colSpan={6} style={{textAlign:"left"}}>{group.code}</td>
                <td style={{textAlign: "left"}}>{group.sumoftotal}</td>
              </tr>
              {group.items.map((item, idx) => (
                <tr key={idx} className="item-row">
                  <td></td>
                  <td></td>
                  <td style={{textAlign: "left", paddingLeft: "2%"}}>{item.code}</td>
                  <td style={{textAlign: "left"}}>{item.name}</td>
                  <td style={{textAlign:"left"}}>{item.unit}</td>
                  <td style={{paddingLeft: "3%", textAlign:"left"}}>{item.price}</td>
                  <td style={{textAlign:"left"}}>{item.quota}</td>
                  <td style={{textAlign: "left"}}>{item.total}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialGroupTable;
