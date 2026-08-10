import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap-v5";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGift,
    faPlus,
    faTrash,
    faMagnifyingGlass,
    faFloppyDisk,
    faXmark,
    faLayerGroup,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import apiConfig from "../../config/apiConfig";
import MasterLayout from "../MasterLayout";
import ReactSelect from "../../shared/select/reactSelect";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import ActionButton from "../../shared/action-buttons/ActionButton";
import Spinner from "../../shared/components/loaders/Spinner";
import user from "../../assets/images/brand_logo.png";
import { fetchAllProducts } from "../../store/action/productAction";
import { fetchAllBrands } from "../../store/action/brandsAction";
import { fetchAllProductCategories } from "../../store/action/productCategoryAction";
import { addToast } from "../../store/action/toastAction";
import { toastType } from "../../constants";

/**
 * Gestión de productos "kit" (combos con receta de componentes reales, ej.
 * "Pack Cerveza + Michelada" = 1 caja de cerveza + 1 michelada). Un kit se
 * crea/edita acá, y una vez creado se vende desde el POS exactamente igual
 * que cualquier otro producto -- el backend se encarga de descontar stock
 * de los componentes reales en vez del kit (que no tiene stock propio).
 */

// Mismos valores que usa el formulario de producto normal (Sale::EXCLUSIVE/
// INCLUSIVE en el backend) -- un kit necesita esto tan real como cualquier
// producto: el POS calcula IVA por línea usando este campo.
const TAX_TYPES = [
    { value: "1", label: "Exclusivo (no incluye IVA)" },
    { value: "2", label: "Inclusivo (ya incluye IVA)" },
];

const COMPONENTES_VISIBLES_EN_TABLA = 2;

const emptyForm = () => ({
    id: null,
    name: "",
    product_price: "",
    product_category_id: null,
    brand_id: null,
    product_unit: null,
    tax_type: "1",
    order_tax: "0",
    components: [{ component_product_id: null, component_product_presentation_id: null, quantity: "1" }],
});

const ProductKits = (props) => {
    const {
        products,
        brands,
        productCategories,
        fetchAllProducts,
        fetchAllBrands,
        fetchAllProductCategories,
    } = props;
    const dispatch = useDispatch();

    const [kits, setKits] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm());
    const [errores, setErrores] = useState({});
    const [imagen, setImagen] = useState(null);
    const [imagenPreviewUrl, setImagenPreviewUrl] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [kitAEliminar, setKitAEliminar] = useState(null);
    // Traído aparte (no vía Redux state.baseUnits) -- ese slice comparte
    // action.type "FETCH_UNITS" con el reducer de `units` (unidades de
    // venta/compra), que sí tiene un case para ese tipo y ninguno para
    // FETCH_ALL_BASE_UNITS, así que termina mostrando la tabla `units` en
    // vez de `base_units`. Bug preexistente, no relacionado a los kits --
    // se lo esquiva acá en vez de tocar un reducer compartido con otras
    // pantallas.
    const [baseUnits, setBaseUnits] = useState([]);

    const cargarKits = () => {
        setCargando(true);
        apiConfig
            .get("/product-kits")
            .then((res) => setKits(res.data.data || []))
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        fetchAllProducts();
        fetchAllBrands();
        fetchAllProductCategories();
        apiConfig.get("/base-units?page[size]=0").then((res) => setBaseUnits(res.data.data || []));
        cargarKits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const abrirNuevo = () => {
        setForm(emptyForm());
        setErrores({});
        setImagen(null);
        setImagenPreviewUrl(null);
        setShowForm(true);
    };

    const abrirEditar = (kit) => {
        setForm({
            id: kit.id,
            name: kit.name,
            product_price: kit.product_price,
            product_category_id: kit.product_category_id,
            brand_id: kit.brand_id,
            product_unit: kit.product_unit,
            tax_type: kit.tax_type ? String(kit.tax_type) : "1",
            order_tax: kit.order_tax || "0",
            components: (kit.kit_items || []).map((it) => ({
                component_product_id: it.component_product_id,
                component_product_presentation_id: it.component_product_presentation_id || null,
                quantity: it.quantity,
            })),
        });
        setErrores({});
        setImagen(null);
        setImagenPreviewUrl(kit.images?.imageUrls?.[0] || null);
        setShowForm(true);
    };

    const setCampo = (campo, valor) => {
        setForm((f) => ({ ...f, [campo]: valor }));
        setErrores((e) => ({ ...e, [campo]: undefined }));
    };

    const onImagenChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImagen(file);
        setImagenPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const agregarComponente = () => {
        setForm((f) => ({
            ...f,
            components: [...f.components, { component_product_id: null, component_product_presentation_id: null, quantity: "1" }],
        }));
        setErrores((e) => ({ ...e, components: undefined }));
    };

    const quitarComponente = (idx) => {
        setForm((f) => ({ ...f, components: f.components.filter((_, i) => i !== idx) }));
        setErrores((e) => ({ ...e, components: undefined }));
    };

    const onComponenteChange = (idx, campo, valor) => {
        setForm((f) => ({
            ...f,
            components: f.components.map((c, i) => {
                if (i !== idx) return c;
                // Si cambia el producto, la presentación elegida antes ya
                // no aplica (era de otro producto).
                if (campo === "component_product_id") {
                    return { ...c, component_product_id: valor, component_product_presentation_id: null };
                }
                return { ...c, [campo]: valor };
            }),
        }));
        setErrores((e) => ({ ...e, components: undefined }));
    };

    const validarCampos = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "El nombre es obligatorio.";
        if (form.product_price === "" || Number(form.product_price) < 0) errs.product_price = "Ingresá un precio válido.";
        if (!form.product_category_id) errs.product_category_id = "Seleccioná una categoría.";
        if (!form.brand_id) errs.brand_id = "Seleccioná una marca.";
        if (!form.product_unit) errs.product_unit = "Seleccioná una unidad.";
        if (!form.tax_type) errs.tax_type = "Seleccioná el tipo de impuesto.";

        if (form.components.length < 1) {
            errs.components = "Agregá al menos un componente.";
        } else {
            const componenteInvalido = form.components.find(
                (c) => !c.component_product_id || !c.quantity || Number(c.quantity) <= 0
            );
            if (componenteInvalido) {
                errs.components = !componenteInvalido.component_product_id
                    ? "Hay un componente sin producto seleccionado."
                    : "Hay un componente con cantidad inválida.";
            } else {
                const ids = form.components.map((c) => c.component_product_id);
                if (new Set(ids).size !== ids.length) {
                    errs.components = "No se puede repetir el mismo componente en la receta.";
                }
            }
        }
        return errs;
    };

    const guardar = () => {
        const errs = validarCampos();
        setErrores(errs);
        const primerError = Object.values(errs)[0];
        if (primerError) {
            dispatch(addToast({ text: primerError, type: toastType.ERROR }));
            return;
        }

        // multipart/form-data (no JSON) porque puede llevar la imagen --
        // los arrays anidados (components) tienen que ir como texto JSON,
        // FormData no soporta objetos anidados tal cual.
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("product_price", form.product_price);
        formData.append("product_category_id", form.product_category_id);
        formData.append("brand_id", form.brand_id);
        formData.append("product_unit", form.product_unit);
        formData.append("tax_type", form.tax_type);
        formData.append("order_tax", form.order_tax || 0);
        formData.append("components", JSON.stringify(form.components.map((c) => ({
            component_product_id: c.component_product_id,
            component_product_presentation_id: c.component_product_presentation_id || null,
            quantity: c.quantity,
        }))));
        if (imagen) {
            formData.append("image", imagen);
        }

        setGuardando(true);
        // PUT con multipart no le llega bien a $_FILES en PHP -- por eso
        // la edición también pega a /product-kits/{id} por POST, igual
        // que ya hace el formulario de producto normal.
        const url = form.id ? `/product-kits/${form.id}` : "/product-kits";
        apiConfig
            .post(url, formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(() => {
                dispatch(addToast({ text: form.id ? "Kit actualizado correctamente." : "Kit creado correctamente." }));
                setShowForm(false);
                cargarKits();
            })
            .catch((error) => {
                dispatch(addToast({
                    text: error?.response?.data?.message || "No se pudo guardar el kit.",
                    type: toastType.ERROR,
                }));
            })
            .finally(() => setGuardando(false));
    };

    const confirmarEliminar = () => {
        apiConfig
            .delete(`/product-kits/${kitAEliminar.id}`)
            .then(() => {
                dispatch(addToast({ text: "Kit eliminado correctamente." }));
                cargarKits();
            })
            .catch((error) => {
                dispatch(addToast({
                    text: error?.response?.data?.message || "No se pudo eliminar el kit.",
                    type: toastType.ERROR,
                }));
            })
            .finally(() => setKitAEliminar(null));
    };

    const nombreProducto = (id) => products.find((p) => +p.id === +id)?.attributes?.name || `#${id}`;

    const kitsFiltrados = kits.filter((kit) => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return true;
        return kit.name?.toLowerCase().includes(q) || kit.code?.toLowerCase().includes(q);
    });

    return (
        <MasterLayout>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                    <span
                        className="d-flex align-items-center justify-content-center rounded-circle bg-light-primary text-primary flex-shrink-0"
                        style={{ width: 44, height: 44 }}
                    >
                        <FontAwesomeIcon icon={faGift} size="lg" />
                    </span>
                    <div>
                        <h4 className="mb-0">Kits de Productos</h4>
                        <div className="text-muted small">
                            Combiná productos reales en un solo ítem vendible desde el POS.
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={abrirNuevo}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo Kit
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div className="input-group" style={{ maxWidth: 320 }}>
                            <span className="input-group-text bg-white border-end-0">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Buscar por nombre o código..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        {!cargando && kits.length > 0 && (
                            <span className="badge bg-light-primary text-primary fs-small px-3 py-2">
                                {kits.length} {kits.length === 1 ? "kit" : "kits"}
                            </span>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: 64 }}>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Componentes</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando && (
                                    <tr>
                                        <td colSpan={5}>
                                            <Spinner />
                                        </td>
                                    </tr>
                                )}
                                {!cargando && kits.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5">
                                            <FontAwesomeIcon icon={faGift} className="text-muted mb-3" style={{ fontSize: 40 }} />
                                            <div className="fw-bold">Todavía no creaste ningún kit</div>
                                            <div className="text-muted small mb-3">
                                                Combiná productos reales (ej: cerveza + michelada) en un solo producto vendible.
                                            </div>
                                            <button className="btn btn-primary btn-sm" onClick={abrirNuevo}>
                                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                Crear el primer kit
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                {!cargando && kits.length > 0 && kitsFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-4">
                                            No se encontraron kits para "{busqueda}".
                                        </td>
                                    </tr>
                                )}
                                {kitsFiltrados.map((kit) => (
                                    <tr key={kit.id}>
                                        <td>
                                            <img
                                                src={kit.images?.imageUrls?.[0] || user}
                                                alt={kit.name}
                                                className="border"
                                                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-bold">{kit.name}</div>
                                            <div className="text-muted small">{kit.code}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold">${Number(kit.product_price || 0).toFixed(2)}</div>
                                            <div className="text-muted small">
                                                {String(kit.tax_type) === "2" ? "IVA incluido" : `+ IVA ${kit.order_tax || 0}%`}
                                            </div>
                                        </td>
                                        <td>
                                            {(kit.kit_items || []).slice(0, COMPONENTES_VISIBLES_EN_TABLA).map((it) => (
                                                <span key={it.id} className="badge bg-light-primary text-primary me-1 mb-1">
                                                    {it.quantity} × {it.component_name}
                                                    {it.component_presentation_name ? ` (${it.component_presentation_name})` : ""}
                                                </span>
                                            ))}
                                            {(kit.kit_items || []).length > COMPONENTES_VISIBLES_EN_TABLA && (
                                                <span className="badge bg-light-secondary text-secondary mb-1">
                                                    +{kit.kit_items.length - COMPONENTES_VISIBLES_EN_TABLA} más
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <ActionButton
                                                item={kit}
                                                goToEditProduct={abrirEditar}
                                                onClickDeleteModel={setKitAEliminar}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showForm} onHide={() => setShowForm(false)} onExited={() => setForm(emptyForm())} size="lg" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faGift} className="me-2 text-primary" />
                        {form.id ? "Editar Kit" : "Nuevo Kit"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row g-3 mb-1">
                        <div className="col-md-3 text-center">
                            <ImagePicker
                                imagePreviewUrl={imagenPreviewUrl}
                                handleImageChange={onImagenChange}
                                user={user}
                                imageTitle="Imagen del kit"
                            />
                        </div>
                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label">Nombre del kit:</label>
                                    <span className="required" />
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={(e) => setCampo("name", e.target.value)}
                                        placeholder='Ej: "Pack Cerveza + Michelada"'
                                    />
                                    {errores.name && (
                                        <span className="text-danger d-block fw-400 fs-small mt-2">{errores.name}</span>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Precio de venta:</label>
                                    <span className="required" />
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-control"
                                            value={form.product_price}
                                            onChange={(e) => setCampo("product_price", e.target.value)}
                                        />
                                    </div>
                                    {errores.product_price && (
                                        <span className="text-danger d-block fw-400 fs-small mt-2">{errores.product_price}</span>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Impuesto (%):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="form-control"
                                        value={form.order_tax}
                                        onChange={(e) => setCampo("order_tax", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <ReactSelect
                                        title="Tipo de Impuesto"
                                        multiLanguageOption={TAX_TYPES.map((t) => ({ id: t.value, name: t.label }))}
                                        value={{ value: form.tax_type, label: TAX_TYPES.find((t) => t.value === form.tax_type)?.label }}
                                        onChange={(obj) => setCampo("tax_type", obj?.value || "1")}
                                        placeholder="Seleccionar tipo de impuesto"
                                        errors={errores.tax_type}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <ReactSelect
                                title="Categoría"
                                data={productCategories}
                                value={
                                    form.product_category_id
                                        ? {
                                            value: form.product_category_id,
                                            label: productCategories.find((c) => +c.id === +form.product_category_id)?.attributes?.name,
                                        }
                                        : null
                                }
                                onChange={(obj) => setCampo("product_category_id", obj?.value || null)}
                                placeholder="Seleccionar categoría"
                                errors={errores.product_category_id}
                            />
                        </div>
                        <div className="col-md-4">
                            <ReactSelect
                                title="Marca"
                                data={brands}
                                value={
                                    form.brand_id
                                        ? { value: form.brand_id, label: brands.find((b) => +b.id === +form.brand_id)?.attributes?.name }
                                        : null
                                }
                                onChange={(obj) => setCampo("brand_id", obj?.value || null)}
                                placeholder="Seleccionar marca"
                                errors={errores.brand_id}
                            />
                        </div>
                        <div className="col-md-4">
                            <ReactSelect
                                title="Unidad"
                                data={baseUnits}
                                value={
                                    form.product_unit
                                        ? { value: form.product_unit, label: baseUnits.find((u) => +u.id === +form.product_unit)?.attributes?.name }
                                        : null
                                }
                                onChange={(obj) => setCampo("product_unit", obj?.value || null)}
                                placeholder="Seleccionar unidad"
                                errors={errores.product_unit}
                            />
                        </div>
                    </div>

                    <hr />

                    <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                        <div>
                            <h6 className="mb-0">
                                <FontAwesomeIcon icon={faLayerGroup} className="me-2 text-primary" />
                                Receta del kit
                            </h6>
                            <div className="text-muted small">
                                Qué productos reales se descuentan del stock al vender 1 unidad de este kit.
                            </div>
                        </div>
                        <span className="badge bg-light-primary text-primary">
                            {form.components.length} {form.components.length === 1 ? "componente" : "componentes"}
                        </span>
                    </div>

                    {errores.components && (
                        <div className="alert alert-danger py-2 px-3 small mb-2">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
                            {errores.components}
                        </div>
                    )}

                    {form.components.map((comp, idx) => {
                        const productoSeleccionado = comp.component_product_id
                            ? products.find((p) => +p.id === +comp.component_product_id)
                            : null;
                        const presentaciones = productoSeleccionado?.attributes?.manage_presentations
                            ? (productoSeleccionado.attributes.presentations || [])
                            : [];
                        const tienePresentaciones = presentaciones.length > 0;
                        const presentacionSeleccionada = comp.component_product_presentation_id
                            ? presentaciones.find((p) => +p.id === +comp.component_product_presentation_id)
                            : null;
                        const stockDisponible = productoSeleccionado?.attributes?.in_stock;
                        const equivalencia = presentacionSeleccionada?.equivalence || 1;
                        const unidadesBase = comp.quantity && !isNaN(Number(comp.quantity))
                            ? Number(comp.quantity) * equivalencia
                            : null;

                        return (
                            <div className="row g-2 mb-2 align-items-center border rounded p-2 mx-0" key={idx}>
                                <div className={tienePresentaciones ? "col-md-5" : "col-md-7"}>
                                    <ReactSelect
                                        data={products}
                                        value={
                                            comp.component_product_id
                                                ? { value: comp.component_product_id, label: nombreProducto(comp.component_product_id) }
                                                : null
                                        }
                                        onChange={(obj) => onComponenteChange(idx, "component_product_id", obj?.value || null)}
                                        placeholder="Buscar producto..."
                                    />
                                    {productoSeleccionado ? (
                                        <div className="text-muted small mt-1">
                                            Stock actual: {stockDisponible ?? "—"} unidades
                                        </div>
                                    ) : (
                                        <div className="text-muted small mt-1">
                                            Sin producto seleccionado
                                        </div>
                                    )}
                                </div>
                                {tienePresentaciones && (
                                    <div className="col-md-2">
                                        <ReactSelect
                                            data={presentaciones.map((p) => ({
                                                value: p.id,
                                                label: `${p.name}${p.is_base_unit ? " (base)" : ""}`,
                                            }))}
                                            value={
                                                presentacionSeleccionada
                                                    ? { value: presentacionSeleccionada.id, label: presentacionSeleccionada.name }
                                                    : null
                                            }
                                            onChange={(obj) => onComponenteChange(idx, "component_product_presentation_id", obj?.value || null)}
                                            placeholder="Presentación"
                                        />
                                        <div className="text-muted small mt-1">
                                            presentacion
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        min="0.0001"
                                        step="0.0001"
                                        className="form-control"
                                        placeholder="Cantidad por kit"
                                        value={comp.quantity}
                                        onChange={(e) => onComponenteChange(idx, "quantity", e.target.value)}
                                    />
                                    {presentacionSeleccionada && unidadesBase !== null && (
                                        <div className="text-muted small mt-1">
                                            = {unidadesBase} unidades base
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        title="Quitar componente"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => quitarComponente(idx)}
                                        disabled={form.components.length <= 1}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <button type="button" className="btn btn-light btn-sm" onClick={agregarComponente}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Agregar componente
                    </button>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={guardando}>
                        <FontAwesomeIcon icon={faXmark} className="me-2" />
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={guardar} disabled={guardando}>
                        {guardando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faFloppyDisk} className="me-2" />
                                Guardar Kit
                            </>
                        )}
                    </button>
                </Modal.Footer>
            </Modal>

            {kitAEliminar && (
                <SweetAlert
                    custom
                    confirmBtnBsStyle="danger mb-3 fs-5 rounded"
                    cancelBtnBsStyle="secondary mb-3 fs-5 rounded text-white"
                    confirmBtnText="Sí, eliminar"
                    cancelBtnText="Cancelar"
                    title="¿Eliminar este kit?"
                    onConfirm={confirmarEliminar}
                    onCancel={() => setKitAEliminar(null)}
                    showCancel
                    focusCancelBtn
                >
                    <span className="sweet-text">
                        Se va a eliminar el kit "{kitAEliminar.name}". Esta acción no se puede deshacer.
                    </span>
                </SweetAlert>
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { products, brands, productCategories } = state;
    return { products, brands, productCategories };
};

export default connect(mapStateToProps, {
    fetchAllProducts,
    fetchAllBrands,
    fetchAllProductCategories,
})(ProductKits);
