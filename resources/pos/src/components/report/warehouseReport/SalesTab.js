import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { connect } from "react-redux";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { fetchSales } from "../../../store/action/salesAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { downloadExcel, downloadPdf } from "../../../store/action/downloadReportAction";
import SalesTotalsBar from "../../../shared/components/report/SalesTotalsBar";

const SalesTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchSales,
        sales,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        downloadExcel,
        downloadPdf,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [activeFilter, setActiveFilter] = useState({});

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue =
        currencySymbol &&
        sales.length >= 0 &&
        sales.map((sale) => ({
            time: dayjs(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            id: sale.id,
            currency: currencySymbol,
        }));

    useEffect(() => {
        if (isWarehouseValue === true) {
            downloadExcel(`sales-report-excel?warehouse_id=${warehouseValue.value}`, 'sale_excel_url', () => setIsWarehouseValue(false));
        }
    }, [isWarehouseValue]);

    const columns = [
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
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
                                    "status.filter.complated.label"
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
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
        },
        {
            name: getFormattedMessage("dashboard.recentSales.paid.label"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.paid_amount
                ),
            sortField: "paid_amount",
            sortable: true,
        },
        {
            name: getFormattedMessage("dashboard.recentSales.due.label"),
            selector: (row) =>
                currencySymbolHandling(allConfigData, row.currency, "0.00"),
            sortField: "due",
            // sortable: true,
        },
        {
            name: getFormattedMessage(
                "dashboard.recentSales.paymentStatus.label"
            ),
            sortField: "payment_status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.paid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 2 && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.unpaid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.partial.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
    ];

    const onChange = (filter) => {
        setActiveFilter(filter);
        fetchSales(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    const onReportPdfClick = () => {
        const params = new URLSearchParams();
        if (warehouseValue && warehouseValue.value) {
            params.set("warehouse_id", warehouseValue.value);
        }
        if (activeFilter.start_date) {
            params.set("start_date", activeFilter.start_date);
        }
        if (activeFilter.end_date) {
            params.set("end_date", activeFilter.end_date);
        }
        downloadPdf(`sales-report-pdf?${params.toString()}`, "sale_report_pdf_url");
    };

    return (
        <div className="warehouse_sale_report_table">
            <SalesTotalsBar />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                warehouseValue={warehouseValue}
                isLoading={isLoading}
                totalRows={totalRecord}
                isEXCEL
                onExcelClick={onExcelClick}
                isReportPdf
                onReportPdfClick={onReportPdfClick}
                isPaymentStatus
                isStatus
                isShowFilterField
                isShowDateRangeField
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, sales, frontSetting } = state;
    return { isLoading, totalRecord, sales, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchSales,
    downloadExcel,
    downloadPdf,
})(SalesTab);
