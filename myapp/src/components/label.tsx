import React from "react";
import { ChevronsUpDown } from "lucide-react";

interface LabelWithIconProps {
  label: string;
  size?: number;
  colorClass?: string;
}

const LabelWithIcon: React.FC<LabelWithIconProps> = ({
  label,
  size = 13,
  colorClass = "text-gray-100 text-xs",
}) => {
  return (
    <>
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

      <div>
        <span>{label}</span>
        <ChevronsUpDown size={size} className={colorClass} />
      </div>
    </>
  );
};

export default LabelWithIcon;