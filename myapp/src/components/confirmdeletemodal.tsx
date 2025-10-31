import React from "react";
import "./confirmdeletemodal.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = "XÁC NHẬN XÓA",
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn-delete" onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
