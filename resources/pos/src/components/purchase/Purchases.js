import React, { useEffect, useState } from "react";
import MasterLayout from "../MasterLayout";
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
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionDropDownButton from "../../shared/action-buttons/ActionDropDownButton";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchPurchases } from "../../store/action/purchaseAction";
import DeletePurchase from "./DeletePurchase";
import { fetchAllSuppliers } from "../../store/action/supplierAction";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import {
    currencySymbolHandling,
    getFormattedDate,
    placeholderText,
} from "../../shared/sharedMethod";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { downloadPdf } from "../../store/action/downloadReportAction";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ResourceListHeader from "../../shared/components/ResourceListHeader";
import "../../assets/scss/custom/pages/resource-list.scss";

const Product = (props) => {
    const {
        fetchPurchases,
        fetchAllWarehouses,
        fetchAllSuppliers,
        purchases,
        totalRecord,
        isLoading,
        suppliers,
        downloadPdf,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [tableArray, setTableArray] = useState([]);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllSuppliers();
        fetchAllWarehouses();
        fetchPurchases(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/purchases/edit/" + id;
    };

    const goToDetailScreen = (ProductId) => {
        window.location.href = "#/app/purchases/detail/" + ProductId;
    };

    const onShowPaymentClick = () => {
        setIsShowPaymentModel(!isShowPaymentModel);
    };

    //onClick pdf function
    const onPdfClick = (id) => {
        downloadPdf(`purchase-pdf-download/${id}`, 'purchase_pdf_url');
    };

    const itemsValue =
        currencySymbol &&
        purchases.length >= 0 &&
        purchases.map((purchase) => {
            const supplier = suppliers.filter(
                (supplier) => supplier.id === purchase.attributes.supplier_id
            );
            const supplierName =
                supplier[0] &&
                supplier[0].attributes &&
                supplier[0].attributes.name;
            return {
                reference_code: purchase.attributes.reference_code,
                supplier: supplierName,
                warehouse: purchase.attributes.warehouse_name,
                status: purchase.attributes.status,
                paid: 0,
                due: 0,
                payment: purchase.attributes.payment_type,
                // Antes usaba created_at (cuándo se guardó el registro en
                // el sistema) en vez de date (la fecha real de la compra,
                // la que se elige/edita en el formulario) -- a diferencia
                // de Sales.js, que sí separa correctamente ambos campos.
                // Con compras cargadas en lote (ej. importación de
                // productos), created_at cae casi en el mismo segundo para
                // todas, así que la lista mostraba "la misma fecha y hora"
                // en todas las filas aunque sus fechas reales fueran
                // distintas.
                date: getFormattedDate(
                    purchase.attributes.date,
                    allConfigData
                ),
                time: dayjs(purchase.attributes.created_at).format("HH:mm:ss"),
                grand_total: purchase.attributes.grand_total,
                currency: currencySymbol,
                id: purchase.id,
            };
        });

    useEffect(() => {
        const grandTotalSum = () => {
            let x = 0;
            itemsValue.length &&
                itemsValue.map((item) => {
                    x = x + Number(item.grand_total);
                    return x;
                });
            return x;
        };
        const paidTotalSum = (itemsValue) => {
            let x = 0;
            itemsValue.length &&
                itemsValue.map((item) => {
                    x = x + Number(item.paid_amount);
                    return x;
                });
            return x;
        };
        if (purchases.length) {
            const newObject = itemsValue.length && {
                date: "",
                time: "",
                reference_code: "Total",
                customer_name: "",
                warehouse_name: "",
                status: "",
                payment_status: "",
                payment_type: "",
                grand_total: grandTotalSum(itemsValue),
                paid_amount: paidTotalSum(itemsValue),
                paid: 0,
                due: 0,
                // La tabla usa `id` como key. Un valor estable evita que la
                // fila de resumen colisione con una compra real.
                id: "purchases-total-row",
                payment: "",
                currency: currencySymbol,
            };
            const newItemValue =
                itemsValue.length && newObject && itemsValue.concat(newObject);
            const latestArray = newItemValue.map((item) => item);
            newItemValue.length && setTableArray(latestArray);
        }
    }, [purchases]);

    useEffect(() => {
        if (purchases.length === 0) {
            setTableArray([]);
        }
    }, [purchases]);

    const columns = [
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: true,
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {getFormattedMessage("pos-total.title")}
                    </span>
                ) : (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.title"),
            selector: (row) => row.supplier,
            sortField: "supplier",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse,
            sortField: "warehouse",
            sortable: false,
        },
        {
            name: getFormattedMessage("purchase.select.status.label"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.received.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.ordered.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("purchase.grant-total.label"),
            // selector: row => row.currency + ' ' + parseFloat(row.grand_total).toFixed(2),
            sortField: "grand_total",
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                ) : (
                    <span>
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                );
            },
            sortable: true,
        },
        // {
        //     name: getFormattedMessage('dashboard.recentSales.paid.label'),
        //     // selector: row => row.currency + ' ' + parseFloat(row.paid).toFixed(2),
        //     sortField: 'paid',
        //     cell: row => {
        //         return row.reference_code === "Total" ? <span
        //                 className="fw-bold fs-4">{currencySymbolHandling(allConfigData, row.currency, row.paid)}</span> :
        //             <span>{currencySymbolHandling(allConfigData, row.currency, row.paid)}</span>
        //     },
        //     sortable: false,
        // },
        // {
        //     name: getFormattedMessage('dashboard.recentSales.due.label'),
        //     cell: row => {
        //         return row.reference_code === "Total" ? <span
        //                 className="fw-bold fs-4">{currencySymbolHandling(allConfigData, row.currency, row.due)}</span> :
        //             <span>{currencySymbolHandling(allConfigData, row.currency, row.due)}</span>
        //     },
        //     sortField: 'due',
        //     sortable: false,
        // },
        {
            name: getFormattedMessage(
                "globally.react-table.column.payment-type.label"
            ),
            selector: (row) => row.payment,
            sortField: "payment",
            sortable: false,
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    ""
                ) : (
                    <span className="badge bg-light-success">
                        <span>{getFormattedMessage("cash.label")}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "date",
            sortable: true,
            cell: (row) => {
                return (
                    row.date && (
                        <span className="badge bg-light-info">
                            <div className="mb-1">{row.time}</div>
                            <div>{row.date}</div>
                        </span>
                    )
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) =>
                row.reference_code === "Total" ? null : (
                    <ActionDropDownButton
                        item={row}
                        goToEditProduct={goToEditProduct}
                        isEditMode={true}
                        isPdfIcon={true}
                        onClickDeleteModel={onClickDeleteModel}
                        isViewIcon={true}
                        onPdfClick={onPdfClick}
                        goToDetailScreen={goToDetailScreen}
                        onShowPaymentClick={onShowPaymentClick}
                        // isPaymentShow={true}
                        title={getFormattedMessage("purchase.title")}
                    />
                ),
        },
    ];

    const visiblePurchases = Array.isArray(itemsValue) ? itemsValue : [];
    const visiblePurchaseTotal = visiblePurchases.reduce(
        (total, purchase) => total + Number(purchase.grand_total || 0),
        0
    );
    const receivedPurchases = visiblePurchases.filter(
        (purchase) => purchase.status === 1
    ).length;
    const processingPurchases = visiblePurchases.filter(
        (purchase) => purchase.status === 2 || purchase.status === 3
    ).length;
    const purchaseStats = [
        {
            label: "Compras registradas",
            value: totalRecord || 0,
            helper: "Coinciden con los filtros",
            tone: "primary",
        },
        {
            label: "Total visible",
            value: currencySymbolHandling(
                allConfigData,
                currencySymbol,
                visiblePurchaseTotal
            ),
            helper: `${visiblePurchases.length} registros en esta página`,
        },
        {
            label: "Recibidas visibles",
            value: receivedPurchases,
            helper: "Compras completadas",
            tone: "success",
        },
        {
            label: "En proceso visibles",
            value: processingPurchases,
            helper: "Pendientes u ordenadas",
            tone: processingPurchases ? "warning" : "success",
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("purchases.title")} />
            <div className="resource-list-v2 resource-list-v2--purchases">
                <ResourceListHeader
                    eyebrow="Abastecimiento"
                    title={placeholderText("purchases.title")}
                    description="Revisa proveedores, estados y montos de compra desde una vista enfocada en la operación diaria."
                    type="purchases"
                    stats={purchaseStats}
                />
                <div className="resource-list-table-shell purchases_table">
                    <ReactDataTable
                        columns={columns}
                        items={tableArray}
                        onChange={onChange}
                        isLoading={isLoading}
                        isShowDateRangeField
                        ButtonValue={getFormattedMessage("purchase.create.title")}
                        totalRows={totalRecord}
                        to="#/app/purchases/create"
                        isShowFilterField
                        isStatus
                    />
                </div>
            </div>
            <DeletePurchase
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        purchases,
        totalRecord,
        isLoading,
        warehouses,
        suppliers,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
    } = state;
    return {
        purchases,
        totalRecord,
        isLoading,
        warehouses,
        suppliers,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchPurchases,
    fetchAllWarehouses,
    fetchAllSuppliers,
    downloadPdf,
    fetchFrontSetting,
})(Product);
