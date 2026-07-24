import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import {
    fetchLoginLogs,
    deleteLoginLog,
    bulkDeleteLoginLogs,
} from "../../store/action/loginLogsActions";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { loginStatusOptions } from "../../constants";
import LoginLogDetailModal from "./shared/LoginLogDetailModal";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const LoginLogs = (props) => {

    const { fetchLoginLogs, loginLogs, totalRecord, isLoading, deleteLoginLog, bulkDeleteLoginLogs } = props;

    const [showModal, setShowModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const formattedLoginStatusOptions = getFormattedOptions(loginStatusOptions);

    // Borrado individual
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    // Selección de filas + borrado masivo
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleClearRows, setToggleClearRows] = useState(false);
    const [bulkDeleteModel, setBulkDeleteModel] = useState(false);

    useEffect(() => {
        fetchLoginLogs();
    }, []);
    const onChange = (filter) => {
        const formattedFilter = {
            ...filter,
            status: filter.login_status === "0" || !filter.login_status ? "" : filter.login_status,
        };
        fetchLoginLogs(formattedFilter, true);
    };

    const onVerDetalles = (row) => {
        setSelectedLog(row);
        setShowModal(true);
    };

    // -- borrado individual --
    const onClickDeleteModel = (row = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(row);
    };

    const onConfirmDelete = () => {
        deleteLoginLog(isDelete.id);
        setDeleteModel(false);
    };

    // -- selección + borrado masivo --
    const handleSelectedRowsChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
    };

    const onConfirmBulkDelete = () => {
        bulkDeleteLoginLogs(selectedRows.map((row) => row.id));
        setBulkDeleteModel(false);
        setSelectedRows([]);
        setToggleClearRows(!toggleClearRows);
    };

    const itemsValue =
        loginLogs.length >= 0 &&
        loginLogs.map((log) => ({
            id: log.id,
            name: log.user
                ? `${log.user.first_name} ${log.user.last_name}`
                : "—",
            email: log.email,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            status: log.status,
            logged_at: log.logged_at,
        }));

    const columns = [
        {
            name: getFormattedMessage("users.title"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="text-primary">{row.name}</div>
                    <div className="text-muted">{row.email}</div>
                </div>
            ),
        },
        {
            name: "IP",
            selector: (row) => row.ip_address,
            sortField: "ip_address",
            sortable: true,
        },
        {
            name: "Estado",
            selector: (row) => row.status,
            sortField: "status",
            sortable: true,
            cell: (row) => (
                <span
                    className={`badge ${row.status === "success"
                        ? "bg-light-success"
                        : "bg-light-danger"
                        }`}
                >
                    {row.status === "success" ? "Exitoso" : "Fallido"}
                </span>
            ),
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => onVerDetalles(row)}>Ver Detalles</button>
                    <button
                        className="btn btn-icon btn-light-danger btn-sm"
                        title="Eliminar registro"
                        onClick={() => onClickDeleteModel(row)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("login-logs.title")} />

            {selectedRows.length > 0 && (
                <div className="d-flex align-items-center justify-content-between rounded p-3 mb-3"
                    style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                    <span style={{ color: "#dc2626", fontWeight: 600 }}>
                        {selectedRows.length} registro(s) seleccionado(s)
                    </span>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setBulkDeleteModel(true)}
                    >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Eliminar seleccionados
                    </button>
                </div>
            )}

            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                isShowFilterField
                isLoginStatus
                loginStatusOptions={formattedLoginStatusOptions}
                isSelectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                clearSelectedRows={toggleClearRows}
            />

            <LoginLogDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                log={selectedLog}
            />

            {deleteModel && (
                <DeleteModel
                    onClickDeleteModel={onClickDeleteModel}
                    deleteModel={deleteModel}
                    deleteUserClick={onConfirmDelete}
                    title="Eliminar registro"
                    name={isDelete?.email || "este registro"}
                />
            )}

            {bulkDeleteModel && (
                <DeleteModel
                    onClickDeleteModel={() => setBulkDeleteModel(false)}
                    deleteModel={bulkDeleteModel}
                    deleteUserClick={onConfirmBulkDelete}
                    title="Eliminar registros"
                    name={`${selectedRows.length} registros seleccionados`}
                />
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { totalRecord, isLoading } = state;
    const loginLogs = state.loginLogs?.loginLogs || [];
    return { loginLogs, totalRecord, isLoading };
};

export default connect(mapStateToProps, { fetchLoginLogs, deleteLoginLog, bulkDeleteLoginLogs })(LoginLogs);
