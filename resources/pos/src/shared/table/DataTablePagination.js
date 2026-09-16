import React from "react";

const PaginationIcon = ({type}) => {
    const paths = {
        first: (
            <>
                <path d="M11 6 5 12l6 6" />
                <path d="M18 6v12" />
            </>
        ),
        previous: <path d="m15 6-6 6 6 6" />,
        next: <path d="m9 6 6 6-6 6" />,
        last: (
            <>
                <path d="m13 6 6 6-6 6" />
                <path d="M6 6v12" />
            </>
        ),
    };

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {paths[type]}
        </svg>
    );
};

const DataTablePagination = ({
    currentPage,
    onChangePage,
    onChangeRowsPerPage,
    paginationComponentOptions = {},
    paginationRowsPerPageOptions = [10, 15, 25, 50, 100],
    rowCount,
    rowsPerPage,
}) => {
    const totalPages = Math.max(1, Math.ceil(rowCount / rowsPerPage));
    const firstRecord = rowCount === 0 ? 0 : ((currentPage - 1) * rowsPerPage) + 1;
    const lastRecord = Math.min(currentPage * rowsPerPage, rowCount);
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;
    const rowsPerPageText = paginationComponentOptions.rowsPerPageText || "Registros por página";
    const rangeSeparatorText = paginationComponentOptions.rangeSeparatorText || "de";

    const changeRowsPerPage = (event) => {
        onChangeRowsPerPage(Number(event.target.value), currentPage);
    };

    const navigationButtons = [
        {id: "pagination-first-page", label: "Primera página", page: 1, disabled: isFirstPage, icon: "first"},
        {id: "pagination-previous-page", label: "Página anterior", page: currentPage - 1, disabled: isFirstPage, icon: "previous"},
        {id: "pagination-next-page", label: "Página siguiente", page: currentPage + 1, disabled: isLastPage, icon: "next"},
        {id: "pagination-last-page", label: "Última página", page: totalPages, disabled: isLastPage, icon: "last"},
    ];

    return (
        <nav className="ecuapos-table-pagination" aria-label="Paginación de la tabla">
            <div className="ecuapos-table-pagination__size">
                <span>{rowsPerPageText}</span>
                <select
                    value={rowsPerPage}
                    onChange={changeRowsPerPage}
                    aria-label="Registros por página"
                >
                    {paginationRowsPerPageOptions.map((option) => (
                        <option value={option} key={option}>{option}</option>
                    ))}
                </select>
            </div>

            <span className="ecuapos-table-pagination__range" aria-live="polite">
                {firstRecord}–{lastRecord} {rangeSeparatorText} {rowCount}
            </span>

            <div className="ecuapos-table-pagination__actions">
                {navigationButtons.map((button) => (
                    <button
                        id={button.id}
                        type="button"
                        key={button.id}
                        aria-label={button.label}
                        title={button.label}
                        disabled={button.disabled}
                        onClick={() => onChangePage(button.page)}
                    >
                        <PaginationIcon type={button.icon} />
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default DataTablePagination;
