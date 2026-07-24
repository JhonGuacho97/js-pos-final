import React from "react";
import { Form } from "react-bootstrap";

const TIPOS_COMPROBANTE_POS = [
    { value: "", label: "Sin comprobante electrónico" },
    { value: "01", label: "Factura (01)" },
];

const SriComprobanteSelect = ({ value, onChange }) => (
    <Form.Group className="mb-3 col-12">
        <Form.Label>
            Comprobante electrónico SRI:
        </Form.Label>
        <Form.Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ borderRadius: "6px" }}
        >
            {TIPOS_COMPROBANTE_POS.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                </option>
            ))}
        </Form.Select>
        {value && (
            <Form.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
                ✅ Se emitirá automáticamente al confirmar el pago.
            </Form.Text>
        )}
    </Form.Group>
);

export default SriComprobanteSelect;