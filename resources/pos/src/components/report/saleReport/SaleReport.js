import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { fetchSales } from "../../../store/action/salesAction";
import { downloadExcel, downloadPdf } from "../../../store/action/downloadReportAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import SalesTotalsBar from "../../../shared/components/report/SalesTotalsBar";
import { fetchUsers } from "../../../store/action/userAction";
import ReactSelect from "../../../shared/select/reactSelect";

const SaleReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchSales,
        sales,
        frontSetting,
        dates,
        downloadExcel,
        downloadPdf,
        allConfigData,
        users,
        fetchUsers,
    } = props;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [activeFilter, setActiveFilter] = useState({});
    const [userValue, setUserValue] = useState(null);
    const [usersOptions, setUsersOptions] = useState([]);
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        fetchUsers({}, true, "?page[size]=0&returnAll=true");
    }, []);

    useEffect(() => {
        if (users?.length > 0) {
            setUsersOptions(
                users.map((user) => ({
                    value: user.id,
                    label: `${user.attributes?.first_name || ""} ${user.attributes?.last_name || ""
                        }`.trim(),
                }))
            );
        }
    }, [users]);

    useEffect(() => {
        if (isWarehouseValue === true) {
            const params = new URLSearchParams();
            params.set("start_date", dates.start_date ?? null);
            params.set("end_date", dates.end_date ?? null);
            if (userValue?.value) {
                params.set("user_id", userValue.value);
            }
            downloadExcel(`total-sale-report-excel?${params.toString()}`, 'total_sale_excel_url', () => setIsWarehouseValue(false));
        }
    }, [isWarehouseValue]);

    const itemsValue =
        currencySymbol &&
        sales.length >= 0 &&
        sales.map((sale) => ({
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            currency: currencySymbol,
            id: sale.id,
        }));

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
        const mergedFilter = { ...filter, user_id: userValue?.value };
        setActiveFilter(mergedFilter);
        fetchSales(mergedFilter, true);
    };

    const onUserChange = (obj) => {
        setUserValue(obj);
        fetchSales({ ...activeFilter, user_id: obj?.value }, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    const onReportPdfClick = () => {
        const params = new URLSearchParams();
        if (dates?.start_date) {
            params.set("start_date", dates.start_date);
        }
        if (dates?.end_date) {
            params.set("end_date", dates.end_date);
        }
        if (userValue?.value) {
            params.set("user_id", userValue.value);
        }
        downloadPdf(`sales-report-pdf?${params.toString()}`, "sale_report_pdf_url");
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("sale.reports.title")} />
            <div className="mx-auto d-flex justify-content-center align-items-center col-12 col-md-4 mb-3" style={{ maxWidth: 280 }}>
                <ReactSelect
                    title="Usuario"
                    placeholder="Todos los usuarios"
                    data={usersOptions}
                    value={userValue}
                    onChange={onUserChange}
                    isRequired
                />
            </div>
            <SalesTotalsBar />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                isShowDateRangeField
                isEXCEL
                isShowFilterField
                isStatus
                isPaymentStatus
                onExcelClick={onExcelClick}
                isReportPdf
                onReportPdfClick={onReportPdfClick}
            />
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const {
        sales,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        allConfigData,
        users,
    } = state;
    return {
        sales,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        allConfigData,
        users,
    };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchSales,
    downloadExcel,
    downloadPdf,
    fetchUsers,
})(SaleReport);