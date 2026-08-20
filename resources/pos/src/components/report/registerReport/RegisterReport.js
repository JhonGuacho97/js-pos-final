import React, { useEffect, useState } from "react";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getAvatarName,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllRegisterReportDetailsAction } from "../../../store/action/pos/posRegisterDetailsAction";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import ReactSelect from "../../../shared/select/reactSelect";
import { fetchUsers } from "../../../store/action/userAction";
import RegisterDenominationsModal from "./RegisterDenominationsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

const RegisterReport = () => {
    const dispatch = useDispatch();
    const {
        isLoading,
        totalRecord,
        registerReportDetails,
        frontSetting,
        allConfigData,
        dates,
        users,
    } = useSelector((state) => state);

    const [userData, setUserData] = useState({});
    const [usersData, setUsersData] = useState({
        usersDataOptions: [],
        userDataOptiosType: [],
    });
    const [tableFilter, setTableFilter] = useState({});
    const [showDenominationsModal, setShowDenominationsModal] = useState(false);
    const [selectedRegister, setSelectedRegister] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers({}, true, "?page[size]=0&returnAll=true"));
    }, []);

    useEffect(() => {
        if (users?.length > 0) {
            setUsersData((data) => ({
                ...data,
                usersDataOptions: users?.map((user) => ({
                    id: user?.id,
                    name: `${user?.attributes?.first_name} ${
                        user?.attributes?.last_name !== "" &&
                        user?.attributes?.last_name !== null &&
                        user?.attributes?.last_name !== undefined
                            ? user?.attributes?.last_name
                            : ""
                    }`,
                })),
            }));
        }
    }, [users]);

    useEffect(() => {
        if (usersData?.usersDataOptions?.length > 0) {
            setUsersData((data) => ({
                ...data,
                userDataOptiosType: usersData?.usersDataOptions?.map(
                    (user) => ({
                        value: user.id,
                        label: user?.name,
                    })
                ),
            }));
        }
    }, [usersData?.usersDataOptions]);

    useEffect(() => {
        if (dates?.end_date === undefined && dates?.start_date === undefined) {
            if (userData?.value !== undefined) {
                dispatch(
                    getAllRegisterReportDetailsAction({
                        query: `?user_id=${userData?.value}`,
                    })
                );
            }
        } else {
            if (userData?.value !== undefined) {
                dispatch(
                    getAllRegisterReportDetailsAction({
                        query: `?user_id=${userData?.value}&start_date=${dates?.start_date}&end_date=${dates?.end_date}`,
                    })
                );
            } else {
                dispatch(
                    getAllRegisterReportDetailsAction({
                        query: `?start_date=${dates?.start_date}&end_date=${dates?.end_date}`,
                    })
                );
            }
        }
    }, [dates, userData]);

    const itemsValue =
        registerReportDetails?.length > 0 &&
        registerReportDetails?.map((registerReport) => ({
            id: registerReport?.id,
            open_date: dayjs(registerReport?.attributes?.created_at).format(
                "DD-MM-YYYY"
            ),
            open_time: dayjs(registerReport?.attributes?.created_at).format(
                "LT"
            ),
            close_date: dayjs(registerReport?.attributes?.closed_at).format(
                "DD-MM-YYYY"
            ),
            close_time: dayjs(registerReport?.attributes?.closed_at).format(
                "LT"
            ),
            user_first_name: registerReport?.attributes?.user?.first_name,
            user_last_name: registerReport?.attributes?.user?.last_name,
            user_email: registerReport?.attributes?.user?.email,
            user_image: registerReport?.attributes?.user?.image_url,
            cash_in_hand: registerReport?.attributes?.cash_in_hand,
            cash_in_hand_while_closing:
                registerReport?.attributes?.cash_in_hand_while_closing,
            expected_cash: registerReport?.attributes?.expected_cash,
            opening_denominations:
                registerReport?.attributes?.opening_denominations,
            closing_denominations:
                registerReport?.attributes?.closing_denominations,
            currency: frontSetting?.value?.currency_symbol,
            notes: registerReport?.attributes?.notes,
            discrepancy_reason: registerReport?.attributes?.discrepancy_reason,
            discrepancy_note: registerReport?.attributes?.discrepancy_note,
            cash_difference: registerReport?.attributes?.cash_difference,
            reconciliation_status: registerReport?.attributes?.reconciliation_status,
            review_note: registerReport?.attributes?.review_note,
            reviewed_by: registerReport?.attributes?.reviewed_by,
        }));

    const checkForDifferences = (filter) => {
        for (const key in filter) {
            if (filter[key] !== tableFilter[key]) {
                return true;
            }
        }
        return false;
    };

    const onChange = (filter) => {
        setTableFilter(filter);
        const hasDifferences = checkForDifferences(filter);
        if (userData?.value === undefined) {
            dispatch(getAllRegisterReportDetailsAction({ filter }));
        } else if (hasDifferences) {
            if (
                dates?.end_date === undefined &&
                dates?.start_date === undefined
            ) {
                if (userData?.value !== undefined) {
                    dispatch(
                        getAllRegisterReportDetailsAction({
                            query: `?user_id=${userData?.value}`,
                            filter,
                        })
                    );
                }
            } else {
                if (userData?.value !== undefined) {
                    dispatch(
                        getAllRegisterReportDetailsAction({
                            query: `?user_id=${userData?.value}&start_date=${dates?.start_date}&end_date=${dates?.end_date}`,
                            filter,
                        })
                    );
                } else {
                    dispatch(
                        getAllRegisterReportDetailsAction({
                            query: `?start_date=${dates?.start_date}&end_date=${dates?.end_date}`,
                            filter,
                        })
                    );
                }
            }
        }
    };

    const columns = [
        {
            name: getFormattedMessage("user-details.table.opened-on.row.label"),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.open_date}</div>
                        {row.open_time}
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("user-details.table.closde-on.row.label"),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.close_date}</div>
                        {row.close_time}
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("users.table.user.column.title"),
            selector: (row) => row.user_first_name,
            sortField: "first_name",
            sortable: false,
            cell: (row) => {
                const imageUrl = row.user_image ? row.user_image : null;
                const lastName =
                    row.user_last_name !== "" &&
                    row.user_last_name !== null &&
                    row.user_last_name !== undefined
                        ? row.user_last_name
                        : "";
                return (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <div>
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        height="50"
                                        width="50"
                                        alt="User Image"
                                        className="image image-circle image-mini"
                                    />
                                ) : (
                                    <span className="custom-user-avatar fs-5">
                                        {getAvatarName(
                                            row.user_first_name + " " + lastName
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div>{row.user_first_name + " " + lastName}</div>
                            <span>{row.user_email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("globally.total-cash.label"),
            selector: (row) => row.cash_in_hand,
            sortField: "cash_in_hand",
            sortable: false,
            cell: (row) => {
                return (
                    <div>
                        <div className="text-muted fs-small">
                            Apertura{" "}
                            {currencySymbolHandling(
                                allConfigData,
                                row.currency,
                                row.cash_in_hand
                            )}
                        </div>
                        <div>
                            Cierre{" "}
                            {currencySymbolHandling(
                                allConfigData,
                                row.currency,
                                row.cash_in_hand_while_closing
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Diferencia",
            selector: (row) => row.expected_cash,
            sortable: false,
            cell: (row) => {
                if (row.expected_cash === null || row.expected_cash === undefined) {
                    return <span className="text-muted">—</span>;
                }
                const difference = row.cash_difference !== null && row.cash_difference !== undefined
                    ? Number(row.cash_difference)
                    : Number(row.cash_in_hand_while_closing) - Number(row.expected_cash);
                const rounded = Math.round(difference * 100) / 100;
                const badgeClass =
                    rounded === 0
                        ? "bg-light-success"
                        : rounded > 0
                        ? "bg-light-warning"
                        : "bg-light-danger";
                const badgeLabel = row.reconciliation_status === "APPROVED"
                    ? "Aprobada"
                    : row.reconciliation_status === "REJECTED"
                    ? "Rechazada"
                    : rounded === 0 ? "Cuadrada" : rounded > 0 ? "Sobrante" : "Faltante";
                return (
                    <span className={`badge ${badgeClass}`}>
                        {badgeLabel}
                        {rounded !== 0 && (
                            <>
                                {" "}
                                {rounded > 0 ? "+" : "-"}
                                {currencySymbolHandling(
                                    allConfigData,
                                    row.currency,
                                    Math.abs(rounded)
                                )}
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("globally.input.notes.label"),
            selector: (row) => row.notes,
            sortField: "notes",
            sortable: false,
            cell: (row) => {
                return (
                    <div>
                        {row.notes?.length > 30
                            ? row.notes?.substring(0, 29) + "..."
                            : row.notes}
                    </div>
                );
            },
        },
        {
            name: "Detalle",
            cell: (row) => (
                <button
                    className="btn text-warning px-2 fs-3 ps-0 border-0"
                    title="Ver desglose de efectivo"
                    onClick={() => {
                        setSelectedRegister(row);
                        setShowDenominationsModal(true);
                    }}
                >
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                </button>
            ),
            sortable: false,
        },
    ];

    const onUserChange = (data) => {
        setUserData(data);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("register.report.title")} />
            <div className="mx-auto col-12 col-md-4">
                <ReactSelect
                    multiLanguageOption={usersData?.usersDataOptions}
                    onChange={onUserChange}
                    defaultValue={usersData?.userDataOptiosType[0]}
                    title={getFormattedMessage("users.title")}
                    errors={""}
                    placeholder={placeholderText("select.report.label")}
                    isRequired
                />
            </div>
            <div>
                <ReactDataTable
                    columns={columns}
                    isShowSearch
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    totalRows={totalRecord}
                    isShowDateRangeField
                />
            </div>
            <RegisterDenominationsModal
                show={showDenominationsModal}
                onHide={() => setShowDenominationsModal(false)}
                register={selectedRegister}
                currencySymbol={frontSetting?.value?.currency_symbol}
                allConfigData={allConfigData}
            />
        </MasterLayout>
    );
};

export default RegisterReport;
