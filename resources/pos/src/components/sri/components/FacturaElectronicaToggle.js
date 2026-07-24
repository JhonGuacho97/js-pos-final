import React from "react";

const FacturaElectronicaToggle = ({ checked, onChange }) => (
    <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
            type="checkbox"
            className="form-check-input"
            role="switch"
            id="facturaElectronicaSwitch"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: "2.5em", height: "1.4em", cursor: "pointer" }}
        />
        <label
            className="form-check-label"
            htmlFor="facturaElectronicaSwitch"
            style={{ cursor: "pointer", userSelect: "none" }}
        >
            {checked
                ? "✅ Emitir factura electrónica (SRI)"
                : "🧾 Comprobante normal"}
        </label>
    </div>
);

export default FacturaElectronicaToggle;