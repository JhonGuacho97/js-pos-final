import React from "react";
import { Form } from "react-bootstrap-v5";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getFormattedMessage } from "../sharedMethod";

const animatedComponents = makeAnimated();

const ReactMultiSelect = ({
    title,
    isRequired,
    placeholder,
    value = null,
    defaultValue = null,
    onChange,
    errors = "",
    option,
}) => {
    // Por defecto, react-select no le avisa a su propio contenedor que
    // creció cuando los chips seleccionados ocupan varias líneas -- el
    // control se queda con la altura mínima inicial mientras los chips
    // se siguen dibujando hacia abajo, pisando lo que venga después en
    // el formulario. Estos estilos le dicen explícitamente que la
    // altura debe seguir al contenido (auto), no quedarse fija.
    const estilosSelect = {
        control: (base) => ({
            ...base,
            minHeight: 38,
            height: "auto",
        }),
        valueContainer: (base) => ({
            ...base,
            flexWrap: "wrap",
            overflow: "visible",
            padding: "4px 8px",
        }),
        indicatorsContainer: (base) => ({
            ...base,
            alignSelf: "flex-start",
        }),
    };

    return (
        <Form.Group className="form-group w-100" controlId="formBasic">
            {title ? <Form.Label>{title} :</Form.Label> : ""}
            {isRequired ? "" : <span className="required" />}
            <Select
                placeholder={placeholder}
                components={animatedComponents}
                isMulti
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                options={option}
                styles={estilosSelect}
                noOptionsMessage={() => getFormattedMessage("no-option.label")}
            />
            {errors ? (
                <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors ? errors : null}
                </span>
            ) : null}
        </Form.Group>
    );
};

export default ReactMultiSelect;
