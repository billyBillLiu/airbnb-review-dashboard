import React from "react";
import "../../styles/ConfirmationMenu.css";

function ConfirmationMenu({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <p>⚠️ ⚠️ ⚠️</p>
        <p className="confirmation-message"> {message} </p>
        <div className="confirmation-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationMenu;
