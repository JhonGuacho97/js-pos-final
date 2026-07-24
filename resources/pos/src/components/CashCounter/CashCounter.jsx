import React, { useEffect, useMemo, useState } from "react";

const DENOMINATIONS = [
    { label: "$100", value: 100, type: "bill" },
    { label: "$50", value: 50, type: "bill" },
    { label: "$20", value: 20, type: "bill" },
    { label: "$10", value: 10, type: "bill" },
    { label: "$5", value: 5, type: "bill" },

    { label: "$1", value: 1, type: "coin" },
    { label: "$0.50", value: 0.5, type: "coin" },
    { label: "$0.25", value: 0.25, type: "coin" },
    { label: "$0.10", value: 0.10, type: "coin" },
    { label: "$0.05", value: 0.05, type: "coin" },
];

const CashCounter = ({ onChange }) => {

    const [cash, setCash] = useState(
        DENOMINATIONS.map(item => ({
            ...item,
            quantity: ""
        }))
    );

    const handleChange = (index, value) => {

        if (!/^\d*$/.test(value)) return;

        const data = [...cash];
        data[index].quantity = value;

        setCash(data);
    };

    const total = useMemo(() => {

        return cash.reduce((sum, item) => {

            return sum + item.value * (Number(item.quantity) || 0);

        }, 0);

    }, [cash]);

    const notes = useMemo(() => {

        return cash
            .filter(item => Number(item.quantity) > 0)
            .map(item => {

                return `${item.quantity} ${
                    item.type === "bill"
                        ? "BILLETES"
                        : "MONEDAS"
                } DE ${item.label.replace("$", "")} = $${(
                    item.quantity * item.value
                ).toFixed(2)}`;

            })
            .join("\n");

    }, [cash]);

    useEffect(() => {

        onChange({
            total,
            notes,
            breakdown: cash
        });

    }, [cash]);

    const renderTable = (type, title) => (

        <>
            <h5 className="mt-4">{title}</h5>

            <table className="table table-bordered">

                <thead>

                <tr>
                    <th>Denominación</th>
                    <th width="120">Cantidad</th>
                    <th width="120">Subtotal</th>
                </tr>

                </thead>

                <tbody>

                {cash
                    .filter(item => item.type === type)
                    .map(item => {

                        const index = cash.findIndex(i => i.value === item.value);

                        return (

                            <tr key={item.value}>

                                <td>{item.label}</td>

                                <td>

                                    <input
                                        className="form-control"
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleChange(index, e.target.value)
                                        }
                                    />

                                </td>

                                <td>

                                    ${(
                                        item.value *
                                        (Number(item.quantity) || 0)
                                    ).toFixed(2)}

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </>

    );

    return (

        <>

            {renderTable("bill", "Billetes")}

            {renderTable("coin", "Monedas")}

            <div className="text-end">

                <h4>

                    Total contado: ${total.toFixed(2)}

                </h4>

            </div>

        </>

    );

};

export default CashCounter;