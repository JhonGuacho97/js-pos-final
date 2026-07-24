import React, { createRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    createVariation,
    updateVariation,
} from "../../store/action/variationAction";

const VariationForm = (props) => {
    const { handleClose, show, title, singleVariation } = props;
    const innerRef = createRef();
    const dispatch = useDispatch();
    const [variationValue, setVariationValue] = useState({
        id: singleVariation ? singleVariation.id : "",
        name: singleVariation ? singleVariation.name : "",
        variation_types: singleVariation ? singleVariation.variation_types : [],
        is_presentation: singleVariation ? !!singleVariation.is_presentation : false,
    });

    const [variationTypes, setVariationTypes] = useState([{ name: "" }]);
    const [deletedVariationTypes, setDeletedVariationTypes] = useState([]);

    const [errors, setErrors] = useState({
        name: "",
        variation_types: "",
    });

    useEffect(() => {
        if (singleVariation) {
            setVariationTypes(singleVariation.variation_types);
            setVariationValue({
                id: singleVariation.id,
                name: singleVariation.name,
                variation_types: singleVariation.variation_types,
                is_presentation: !!singleVariation.is_presentation,
            });
        }
    }, [singleVariation]);

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        if (!variationValue["name"].trim()) {
            error["name"] = getFormattedMessage(
                "globally.input.name.validate.label"
            );
        } else if (
            variationTypes &&
            variationTypes.filter((item) => item.name.trim() == "").length
        ) {
            error["variation_types"] = getFormattedMessage(
                "variation.type.input.name.validate.label"
            );
        } else {
            isValid = true;
        }
        setErrors(error);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setVariationValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    const prepareFormData = (variationValue) => {
        return { ...variationValue, variation_types: variationTypes,deleted_variation_types: deletedVariationTypes};
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleVariation && valid) {
            const updatedVariationTypes = [...variationTypes, ...deletedVariationTypes];
            dispatch(
                updateVariation(
                    singleVariation.id,
                    prepareFormData({ ...variationValue, variation_types: updatedVariationTypes }),
                    clearField
                )
            );
        } else {
            if (valid) {
                setVariationValue(variationValue);
                dispatch(
                    createVariation(prepareFormData({ ...variationValue, variation_types: variationTypes }), clearField)
                );
            }
        }
    };

    const clearField = () => {
        setVariationValue({
            name: "",
            variation_types: [],
            is_presentation: false,
        });
        setVariationTypes([{ name: "" }]);
        setErrors("");
        handleClose(false);
    };

    const addVariationType = () => {
        setVariationTypes([...variationTypes, { name: "" }]);
    };

    const removeVariationType = (index = 0, variationType) => {
        const list = [...variationTypes];
        list.splice(index, 1);
        setVariationTypes(list);
        if (variationType.id) {
            setDeletedVariationTypes([...deletedVariationTypes, { id:variationType.id,name:variationType.name }]);
        }
    };
    const onChangeVariationTypesInput = (e, index) => {
        e.preventDefault();
        setVariationTypes((variationTypes) => {
            variationTypes[index].name = e.target.value;
            return [...variationTypes];
        });
    };

    // Calculado UNA sola vez (no dentro del .map() de filas): placeholderText
    // usa un hook por dentro, y llamarlo una cantidad de veces que cambia
    // según cuántas filas de tipo de variante haya rompe el orden de hooks
    // entre renders.
    const variationTypePlaceholder = placeholderText(
        "variation.type.input.name.placeholder.label"
    );

    return (
        <Modal
            show={show}
            onHide={clearField}
            keyboard={true}
            onShow={() =>
                setTimeout(() => {
                    innerRef.current?.focus();
                }, 1)
            }
        >
            <Form
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        singleVariation ? onEdit(e) : onSubmit(e);
                    }
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 ">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.name.label"
                                )}
                                :{" "}
                            </label>
                            <span className="required" />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["name"] ? errors["name"] : null}
                            </span>
                            <input
                                type="text"
                                name="name"
                                placeholder={placeholderText(
                                    "globally.input.name.placeholder.label"
                                )}
                                className="form-control mb-3"
                                ref={innerRef}
                                autoComplete="off"
                                onChange={(e) => onChangeInput(e)}
                                value={variationValue.name}
                            />
                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="is_presentation"
                                    checked={variationValue.is_presentation}
                                    onChange={(e) =>
                                        setVariationValue((inputs) => ({
                                            ...inputs,
                                            is_presentation: e.target.checked,
                                        }))
                                    }
                                />
                                <label className="form-check-label" htmlFor="is_presentation">
                                    Usar para presentaciones de venta
                                </label>
                                <span className="text-muted d-block fs-small">
                                    Márcalo si este grupo (ej. "Presentaciones") define formas de
                                    empaque como Caja/Six Pack/Unidad -- así, al armar
                                    presentaciones en un producto, solo aparecerán las variantes
                                    de este tipo, no todas las que tengas cargadas (tallas,
                                    colores, etc.).
                                </span>
                            </div>
                            <label className="form-label mt-2 mb-0">
                                {getFormattedMessage("variation.types.title")}:{" "}
                            </label>
                            <span className="required" />
                            <span className="text-danger d-block fw-400 fs-small my-2">
                                {errors["variation_types"]
                                    ? errors["variation_types"]
                                    : null}
                            </span>

                            <div className="row">
                                <div className="col-md-10">
                                    <input
                                        type="text"
                                        name="variation_types"
                                        placeholder={variationTypePlaceholder}
                                        className="form-control"
                                        autoComplete="off"
                                        onChange={(e) =>
                                            onChangeVariationTypesInput(e, 0)
                                        }
                                        value={variationTypes[0].name}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100 h-100 p-0 d-flex justify-content-center align-items-center"
                                        onClick={addVariationType}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                            {variationTypes
                                .slice(1)
                                ?.map((variationType, index) => (
                                    <div className="row mt-2" key={index + 1}>
                                        <div className="col-md-10">
                                            <input
                                                type="text"
                                                name="variation_types"
                                                placeholder={variationTypePlaceholder}
                                                className="form-control"
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    onChangeVariationTypesInput(
                                                        e,
                                                        index + 1
                                                    )
                                                }
                                                value={variationType.name}
                                            />
                                        </div>
                                            <div className="col-md-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger w-100 h-100 p-0 d-flex justify-content-center align-items-center"
                                                    onClick={() =>
                                                        removeVariationType(
                                                            index + 1,variationType
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter
                onEditRecord={singleVariation}
                onSubmit={onSubmit}
                clearField={clearField}
                addDisabled={!variationValue.name.trim()}
            />
        </Modal>
    );
};

export default VariationForm;
