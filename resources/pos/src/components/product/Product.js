import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { Button, Image } from "react-bootstrap-v5";
import MasterLayout from "../MasterLayout";
import { bulkDeleteMainProducts, fetchAllMainProducts } from "../../store/action/productAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteMainProduct from "./DeleteMainProduct";
import TabTitle from "../../shared/tab-title/TabTitle";
import ProductImageLightBox from "./ProductImageLightBox";
import user from "../../assets/images/brand_logo.png";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
    currencySymbolHandling,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ImportProductModel from "./ImportProductModel";
import { downloadExcel } from "../../store/action/downloadReportAction";
import ResourceListHeader from "../../shared/components/ResourceListHeader";
import BulkProductActionsModal from "./BulkProductActionsModal";
import "../../assets/scss/custom/pages/resource-list.scss";

const Product = (props) => {
    const {
        fetchAllMainProducts,
        products,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        downloadExcel,
        productUnitId,
        allConfigData,
        config,
        bulkDeleteMainProducts,
    } = props;
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [lightBoxImage, setLightBoxImage] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [clearSelection, setClearSelection] = useState(false);
    const [bulkModal, setBulkModal] = useState(false);
    const [bulkModalMode, setBulkModalMode] = useState("manage");
    const tablePageChanging = useRef(false);

    const [importProduct, setimportProduct] = useState(false);
    const handleClose = () => {
        setimportProduct(!importProduct);
    };

    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    useEffect(() => {
        if (isWarehouseValue === true) {
            downloadExcel(`products-export-excel${productUnitId ? '?id=' + productUnitId : ''}`, 'product_excel_url', () => setIsWarehouseValue(false));
        }
    }, [isWarehouseValue]);

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllMainProducts(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/products/edit/" + id;
    };

    const goToProductDetailPage = (ProductId) => {
        window.location.href = "#/app/products/detail/" + ProductId;
    };

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const formattedPrice = useCallback((product_price) => {
        return currencySymbolHandling(
            allConfigData,
            currencySymbol,
            product_price
        )
    }, [allConfigData, currencySymbol]);

    const itemsValue = useMemo(() => {
        if (!currencySymbol || !Array.isArray(products)) {
            return [];
        }

        return products.map((product) => {
            let product_price = product.attributes.min_price == product.attributes.max_price ? formattedPrice(product.attributes.min_price) : formattedPrice(product.attributes.min_price) + " - " + formattedPrice(product.attributes.max_price);
            const productData = product?.attributes?.products?.length > 0
                ? product.attributes.products[0]
                : null;

            return {
                name: product?.attributes.name,
                code: product?.attributes.code,
                date: getFormattedDate(
                    productData?.created_at,
                    allConfigData && allConfigData
                ),
                time: productData?.created_at
                    ? dayjs(productData.created_at).format("LT")
                    : "-",
                brand_name: product?.attributes.products ? product?.attributes.products[0].brand_name : "",
                product_price: product_price,
                product_unit: product?.attributes.product_unit?.name
                    ? product?.attributes.product_unit?.name
                    : "N/A",
                in_stock: product.attributes.products?.reduce(
                    (sum, product) =>
                        sum + Number(product?.stock?.quantity || 0),
                    0
                ),
                images: product?.attributes.images,
                id: product.id,
                currency: currencySymbol,
                products: product?.attributes?.products || [],
            };
        });
    }, [currencySymbol, formattedPrice, products]);

    const canManagePurchase = Array.isArray(config) && config.includes("manage_purchase");
    const syncSelectedRows = useCallback(({ selectedRows }) => {
        setSelectedProducts((current) => {
            if (tablePageChanging.current && selectedRows.length === 0) {
                return current;
            }
            if (selectedRows.length > 0) {
                tablePageChanging.current = false;
            }

            const visibleIds = new Set(itemsValue.map((product) => product.id));
            const merged = [
                ...current.filter((product) => !visibleIds.has(product.id)),
                ...selectedRows,
            ];
            const next = Array.from(new Map(merged.map((product) => [product.id, product])).values());
            const currentIds = current.map((product) => Number(product.id)).sort((a, b) => a - b);
            const nextIds = next.map((product) => Number(product.id)).sort((a, b) => a - b);

            return currentIds.length === nextIds.length
                && currentIds.every((id, index) => id === nextIds[index])
                ? current
                : next;
        });
    }, [itemsValue]);
    const handleTablePageChange = useCallback(() => {
        tablePageChanging.current = true;
    }, []);
    const selectedProductIds = useMemo(
        () => new Set(selectedProducts.map((product) => product.id)),
        [selectedProducts]
    );
    const isProductSelected = useCallback(
        (row) => selectedProductIds.has(row.id),
        [selectedProductIds]
    );
    const clearBulkSelection = () => {
        setSelectedProducts([]);
        setClearSelection((current) => !current);
        setBulkModal(false);
    };
    const openBulkModal = (mode) => {
        setBulkModalMode(mode);
        setBulkModal(true);
    };
    const createBulkPurchase = (productIds) => {
        setBulkModal(false);
        navigate(`/app/purchases/create?product_ids=${productIds.join(",")}`);
    };
    const deleteBulkProducts = () => {
        bulkDeleteMainProducts(selectedProducts.map((product) => product.id), clearBulkSelection);
    };

    const columns = [
        {
            name: getFormattedMessage("product.title"),
            sortField: "name",
            sortable: false,
            cell: (row) => {
                const imageUrl = row.images
                    ? row.images.imageUrls && row.images.imageUrls[0]
                    : null;
                return imageUrl ? (
                    <div className="d-flex align-items-center">
                        <Button
                            type="button"
                            className="btn-transparent me-2 d-flex align-items-center justify-content-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                                setLightBoxImage(row.images.imageUrls);
                            }}
                        >
                            <Image
                                src={imageUrl}
                                height="50"
                                width="50"
                                alt="Product Image"
                                className="image image-circle image-mini cursor-pointer"
                            />
                        </Button>
                    </div>
                ) : (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <Image
                                src={user}
                                height="50"
                                width="50"
                                alt="Product Image"
                                className="image image-circle image-mini"
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.table.name.column.title"),
            selector: (row) => row.name,
            className: "product-name",
            sortField: "name",
            sortable: true,
        },
        {
            name: getFormattedMessage("product.input.code.label"),
            selector: (row) => (
                <span className="badge bg-light-danger">
                    <span>{row.code}</span>
                </span>
            ),
            sortField: "code",
            sortable: true,
        },
        {
            name: getFormattedMessage("product.input.brand.label"),
            selector: (row) => row.brand_name,
            sortField: "brand_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("product.table.price.column.label"),

            selector: (row) =>
                row.product_price
        },
        {
            name: getFormattedMessage("product.input.product-unit.label"),
            sortField: "product_unit",
            sortable: true,
            cell: (row) => {
                return (
                    row.product_unit && (
                        <span className="badge bg-light-success">
                            <span>{row.product_unit}</span>
                        </span>
                    )
                );
            },
        },
        {
            name: getFormattedMessage("product.product-in-stock.label"),
            // name: "In stock",
            selector: (row) => row.in_stock,
            sortField: "in_stock",
            sortable: false,
        },
        // {
        //     name: getForattedMessage(
        //         "globally.react-table.column.created-date.label"
        //     ),
        //     selector: (row) => row.date,
        //     sortField: "created_at",
        //     sortable: true,
        //     cell: (row) => {
        //         return (
        //             <span className="badge bg-light-info">
        //                 <div className="mb-1">{row.time}</div>
        //                 {row.date}
        //             </span>
        //         );
        //     },
        // },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px",
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    goToDetailScreen={goToProductDetailPage}
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={true}
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];

    const visibleProducts = Array.isArray(itemsValue) ? itemsValue : [];
    const visibleStock = visibleProducts.reduce(
        (total, product) => total + Number(product.in_stock || 0),
        0
    );
    const lowStockProducts = visibleProducts.filter(
        (product) => Number(product.in_stock || 0) <= 10
    ).length;
    const productStats = [
        {
            label: "Productos registrados",
            value: totalRecord || 0,
            helper: "Coinciden con los filtros",
            tone: "primary",
        },
        {
            label: "En esta página",
            value: visibleProducts.length,
            helper: "Productos visibles",
        },
        {
            label: "Stock visible",
            value: visibleStock.toLocaleString(),
            helper: "Unidades disponibles",
            tone: "success",
        },
        {
            label: "Stock bajo visible",
            value: lowStockProducts,
            helper: "10 unidades o menos",
            tone: lowStockProducts ? "warning" : "success",
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("products.title")} />
            <div className="resource-list-v2 resource-list-v2--products">
                <ResourceListHeader
                    eyebrow="Catálogo e inventario"
                    title={placeholderText("products.title")}
                    description="Administra precios, existencias y datos de producto con una lectura más rápida del inventario."
                    type="products"
                    stats={productStats}
                />
                <div className="resource-list-table-shell product_table">
                    {selectedProducts.length > 0 && <div className="product-bulk-toolbar">
                        <span className="product-bulk-toolbar__icon"><i className="bi bi-check2-square" /></span>
                        <div className="product-bulk-toolbar__copy"><small>SELECCIÓN ACTIVA</small><strong>{selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"}</strong><p>Prepara una compra o administra los artículos marcados.</p></div>
                        <div className="product-bulk-toolbar__actions"><Button className="product-bulk-toolbar__clear" onClick={clearBulkSelection}>Limpiar</Button><Button className="product-bulk-toolbar__delete" onClick={() => openBulkModal("delete")}><i className="bi bi-trash3" /> Eliminar</Button>{canManagePurchase && <Button className="product-bulk-toolbar__manage" onClick={() => openBulkModal("manage")}><i className="bi bi-box-seam" /> Gestionar selección</Button>}</div>
                    </div>}
                    <ReactDataTable
                        columns={columns}
                        items={itemsValue}
                        onChange={onChange}
                        isLoading={isLoading}
                        ButtonValue={getFormattedMessage("product.create.title")}
                        totalRows={totalRecord}
                        to="#/app/products/create"
                        isShowFilterField
                        isUnitFilter
                        title={getFormattedMessage("product.input.product-unit.label")}
                        buttonImport={true}
                        goToImport={handleClose}
                        importBtnTitle={"product.import.title"}
                        isExport
                        onExcelClick={onExcelClick}
                        isSelectableRows
                        onSelectedRowsChange={syncSelectedRows}
                        clearSelectedRows={clearSelection}
                        selectableRowSelected={isProductSelected}
                        onPageChangeStart={handleTablePageChange}
                    />
                </div>
            </div>
            <DeleteMainProduct
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            {isOpen && lightBoxImage.length !== 0 && (
                <ProductImageLightBox
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    lightBoxImage={lightBoxImage}
                />
            )}
            {importProduct && (
                <ImportProductModel
                    handleClose={handleClose}
                    show={importProduct}
                />
            )}
            <BulkProductActionsModal show={bulkModal} initialMode={bulkModalMode} products={selectedProducts} canManagePurchase={canManagePurchase} onClose={() => setBulkModal(false)}
                onCreatePurchase={createBulkPurchase} onDelete={deleteBulkProducts} />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        products,
        totalRecord,
        isLoading,
        frontSetting,
        productUnitId,
        allConfigData,
        config,
    } = state;
    return {
        products,
        totalRecord,
        isLoading,
        frontSetting,
        productUnitId,
        allConfigData,
        config,
    };
};

export default connect(mapStateToProps, {
    fetchAllMainProducts,
    fetchFrontSetting,
    downloadExcel,
    bulkDeleteMainProducts,
})(Product);
