import React, { useEffect, useState } from "react";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import { connect } from "react-redux";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { Col, Row } from "react-bootstrap";
import ProfitLossWidget from "../../../shared/Widget/ProfitLossWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCartPlus,
    faSquarePlus,
    faShoppingCart,
    faSquareMinus,
    faMoneyBillTrendUp,
    faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import DateRangePicker from "../../../shared/datepicker/DateRangePicker";
import { Filters } from "../../../constants";
import { dateFormat } from "../../../constants";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { fetchProfitAndLossReports } from "../../../store/action/profitAndLossReportAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";

const ProfitLossReport = (props) => {
    const {
        fetchFrontSetting,
        frontSetting,
        fetchProfitAndLossReports,
        profitAndLossReport,
        allConfigData,
    } = props;
    const [selectDate, setSelectDate] = useState();
    const [created_at] = useState(Filters.OBJ.created_at);
    const startMonth = dayjs().startOf("month").format(dateFormat.NATIVE);
    const today = dayjs().format(dateFormat.NATIVE);
    const currency = frontSetting.value && frontSetting.value.currency_symbol;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        onChangeDidMount();
    }, [selectDate]);

    const onChange = (filter) => {
        fetchProfitAndLossReports(filter, true);
    };

    const onDateSelector = (date) => {
        setSelectDate(date.params);
    };

    const onChangeDidMount = () => {
        const filters = {
            created_at: created_at,
            search: "",
            start_date: selectDate ? selectDate.start_date : startMonth,
            end_date: selectDate ? selectDate.end_date : today,
        };
        onChange(filters);
    };

    const num = (value) => (value ? parseFloat(value).toFixed(2) : "0.00");

    // Resultados: lo que realmente le importa a un dueño de negocio al
    // abrir este reporte. Tarjetas grandes, con el desglose de cómo se
    // llegó a cada número justo debajo, en vez de un párrafo largo.
    const results = [
        {
            key: "revenue",
            title: getFormattedMessage("global.revenue.title"),
            value: num(profitAndLossReport.Revenue),
            accent: "#2F6FED",
            icon: <FontAwesomeIcon icon={faSquarePlus} />,
            breakdown: [
                {
                    key: "sales",
                    label: getFormattedMessage("sales.title"),
                    value: num(profitAndLossReport.sales),
                },
                {
                    key: "sale_returns",
                    label: getFormattedMessage("sales-return.title"),
                    value: num(profitAndLossReport.sale_returns),
                    operator: "−",
                },
            ],
        },
        {
            key: "gross_profit",
            title: getFormattedMessage("global.gross-profit.title"),
            value: num(profitAndLossReport.gross_profit),
            accent: "#059669",
            icon: <FontAwesomeIcon icon={faMoneyBillTrendUp} />,
            breakdown: [
                {
                    key: "sales",
                    label: getFormattedMessage("sales.title"),
                    value: num(profitAndLossReport.sales),
                },
                {
                    key: "sale_returns",
                    label: getFormattedMessage("sales-return.title"),
                    value: num(profitAndLossReport.sale_returns),
                    operator: "−",
                },
                {
                    key: "product_cost",
                    label: getFormattedMessage(
                        "product.input.product-cost.label"
                    ),
                    value: num(profitAndLossReport.product_cost),
                    operator: "−",
                },
            ],
        },
        {
            key: "payments_received",
            title: getFormattedMessage("global.payment-received.title"),
            value: num(profitAndLossReport.payments_received),
            accent: "#0284c7",
            icon: <FontAwesomeIcon icon={faMoneyBillTransfer} />,
            breakdown: [
                {
                    key: "sales_payment",
                    label: getFormattedMessage(
                        "global.payment-received.title"
                    ),
                    value: num(profitAndLossReport.sales_payment_amount),
                },
                {
                    key: "purchase_returns",
                    label: getFormattedMessage("purchases.return.title"),
                    value: num(profitAndLossReport.purchase_returns),
                    operator: "+",
                },
            ],
        },
    ];

    // Detalle del período: los números de entrada, en tarjetas chicas --
    // son consulta, no el resultado en sí.
    const details = [
        {
            key: "sales",
            title: getFormattedMessage("sales.title"),
            value: num(profitAndLossReport.sales),
            accent: "#2F6FED",
            icon: <FontAwesomeIcon icon={faShoppingCart} />,
        },
        {
            key: "purchases",
            title: getFormattedMessage("purchases.title"),
            value: num(profitAndLossReport.purchases),
            accent: "#0ea5e9",
            icon: <FontAwesomeIcon icon={faCartPlus} />,
        },
        {
            key: "sale_returns",
            title: getFormattedMessage("sales-return.title"),
            value: num(profitAndLossReport.sale_returns),
            accent: "#f59e0b",
            icon: <FontAwesomeIcon icon={faArrowRight} />,
        },
        {
            key: "purchase_returns",
            title: getFormattedMessage("purchases.return.title"),
            value: num(profitAndLossReport.purchase_returns),
            accent: "#10b981",
            icon: <FontAwesomeIcon icon={faArrowLeft} />,
        },
        {
            key: "expenses",
            title: getFormattedMessage("expenses.title"),
            value: num(profitAndLossReport.expenses),
            accent: "#ef4444",
            icon: <FontAwesomeIcon icon={faSquareMinus} />,
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("profit-loss.reports.title")} />

            <div className="d-flex justify-content-center mb-4">
                <DateRangePicker
                    onDateSelector={onDateSelector}
                    isProfitReport={true}
                    selectDate={selectDate}
                />
            </div>

            <div
                className="text-muted text-uppercase mb-2"
                style={{ fontSize: 12, letterSpacing: 0.5, fontWeight: 600 }}
            >
                Resultados
            </div>
            <Row className="g-3 mb-4">
                {results.map((item) => (
                    <Col key={item.key} xs={12} md={4}>
                        <ProfitLossWidget
                            size="lg"
                            title={item.title}
                            value={item.value}
                            currency={currency}
                            icon={item.icon}
                            accent={item.accent}
                            breakdown={item.breakdown}
                            allConfigData={allConfigData}
                        />
                    </Col>
                ))}
            </Row>

            <div
                className="text-muted text-uppercase mb-2"
                style={{ fontSize: 12, letterSpacing: 0.5, fontWeight: 600 }}
            >
                Detalle del período
            </div>
            <Row className="g-3">
                {details.map((item) => (
                    <Col key={item.key} xs={6} md={4} lg>
                        <ProfitLossWidget
                            size="sm"
                            title={item.title}
                            value={item.value}
                            currency={currency}
                            icon={item.icon}
                            accent={item.accent}
                            allConfigData={allConfigData}
                        />
                    </Col>
                ))}
            </Row>
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const { frontSetting, profitAndLossReport, allConfigData } = state;
    return { frontSetting, profitAndLossReport, allConfigData };
};

export default connect(mapStateToProps, {
    fetchProfitAndLossReports,
    fetchFrontSetting,
})(ProfitLossReport);
