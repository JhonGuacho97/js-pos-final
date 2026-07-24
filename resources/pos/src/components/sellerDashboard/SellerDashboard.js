import React, { useEffect } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ReactDataTable from "../../shared/table/ReactDataTable";
import SalesTotalsBar from "../../shared/components/report/SalesTotalsBar";
import { fetchSales } from "../../store/action/salesAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

/**
 * Pantalla para vendedores: solo sus propias ventas de hoy, con los mismos
 * totales (efectivo/transferencia/pagado) que ya armamos para Informe de
 * venta -- reutiliza exactamente el mismo filtro por usuario y el mismo
 * componente de totales, nada nuevo del lado del backend.
 *
 * Quién puede VER esta pantalla se controla como cualquier otra, desde
 * Roles/Permisos, con el permiso "manage_my-sales".
 */
const SellerDashboard = (props) => {
    const { fetchSales, sales, totalRecord, isLoading } = props;

    const loginUser = JSON.parse(localStorage.getItem("loginUserArray") || "null");
    const currentUserId = loginUser?.id;
    const currentUserName =
        loginUser && `${loginUser.first_name || ""} ${loginUser.last_name || ""}`.trim();

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Guayaquil",
    }).format(new Date());

    useEffect(() => {
        if (currentUserId) {
            fetchSales(
                { user_id: currentUserId, start_date: today, end_date: today },
                true
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    const itemsValue =
        sales?.length >= 0 &&
        sales.map((sale) => ({
            id: sale.id,
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount,
            payment_status: sale.attributes.payment_status,
            created_at: sale.attributes.created_at,
        }));

    const columns = [
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            selector: (row) => row.reference_code,
            sortable: true,
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortable: true,
        },
        {
            name: getFormattedMessage("purchase.grant-total.label"),
            selector: (row) => `$ ${Number(row.grand_total).toFixed(2)}`,
            sortable: true,
        },
        {
            name: getFormattedMessage("dashboard.recentSales.paymentStatus.label"),
            cell: (row) => (
                <span
                    className={`badge ${
                        row.payment_status === 1
                            ? "bg-light-success"
                            : row.payment_status === 3
                            ? "bg-light-warning"
                            : "bg-light-danger"
                    }`}
                >
                    {row.payment_status === 1
                        ? "Pagado"
                        : row.payment_status === 3
                        ? "Parcial"
                        : "No pagado"}
                </span>
            ),
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleTimeString("es-EC", {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "",
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Mis ventas de hoy" />

            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="mb-0">Mis ventas de hoy</h3>
                    {currentUserName && (
                        <span className="text-muted">{currentUserName}</span>
                    )}
                </div>
                <span className="text-muted">
                    {new Date().toLocaleDateString("es-EC", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </span>
            </div>

            <SalesTotalsBar />

            <ReactDataTable
                columns={columns}
                items={itemsValue}
                isLoading={isLoading}
                totalRows={totalRecord}
                onChange={() =>
                    fetchSales(
                        {
                            user_id: currentUserId,
                            start_date: today,
                            end_date: today,
                        },
                        true
                    )
                }
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { sales, totalRecord, isLoading } = state;
    return { sales, totalRecord, isLoading };
};

export default connect(mapStateToProps, { fetchSales })(SellerDashboard);
