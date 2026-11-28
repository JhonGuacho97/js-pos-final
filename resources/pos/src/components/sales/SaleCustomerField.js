import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faMagnifyingGlass, faPen, faXmark, faClockRotateLeft, faUsers } from '@fortawesome/free-solid-svg-icons';
import CustomerSearchModal, { customerFacts, toCustomerOption } from '../../frontend/components/pos-dropdown/CustomerSearchModal';
import '../../frontend/components/pos-dropdown/pos-customer-panel.scss';

// Campo de cliente de Crear venta, igual que en el POS: con la cédula/RUC
// se elige al cliente o, si no existe, se abre el alta (con consulta al
// SRI). El botón de al lado (o F2) abre el buscador con todos los
// clientes. Una vez elegido se muestra como chip.
const SaleCustomerField = ({ customers, value, onChange, onCreate, onEdit, onHistory, canEdit, invalid }) => {
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchSeed, setSearchSeed] = useState('');
    const inputRef = useRef(null);

    const selectedId = value?.value || value || null;
    const customer = selectedId
        ? (customers || []).find((item) => String(item.id) === String(selectedId))
        : null;
    const facts = customer ? customerFacts(customer) : null;
    const name = facts?.name || value?.label || '';

    const openSearch = (seed = '') => {
        setSearchSeed(seed);
        setSearchOpen(true);
    };

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'F2') {
                event.preventDefault();
                openSearch('');
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const choose = (record) => {
        const option = toCustomerOption(record);
        onChange({ value: option.value, label: option.label });
        setSearchOpen(false);
        setQuery('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const typed = query.trim();
        const match = typed
            ? (customers || []).find((item) => (item.attributes?.identification || '') === typed)
            : null;
        if (match) choose(match);
        else {
            setQuery('');
            onCreate(typed);
        }
    };

    const clear = () => {
        onChange('');
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <>
            {selectedId ? (
                <div className={`sale-customer-chip ${invalid ? 'is-invalid' : ''}`}>
                    <span className="sale-customer-chip__name" title={name}>{name}</span>
                    {facts?.identification && <span className="sale-customer-chip__id">{facts.identification}</span>}
                    <span className="sale-customer-chip__actions">
                        {canEdit && (
                            <button type="button" onClick={onEdit} title="Editar cliente" aria-label="Editar cliente">
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        )}
                        <button type="button" onClick={onHistory} title="Historial de ventas" aria-label="Historial de ventas">
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                        </button>
                        <button type="button" onClick={clear} title="Cambiar cliente" aria-label="Cambiar cliente">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </span>
                </div>
            ) : (
                <div className="sale-customer-input">
                    <form className={`sale-customer-input__box ${invalid ? 'is-invalid' : ''}`} onSubmit={onSubmit} role="search">
                        <FontAwesomeIcon icon={faAddressCard} className="sale-customer-input__icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cédula o RUC"
                            aria-label="Cédula o RUC del cliente"
                        />
                        <button type="submit" title="Buscar o registrar cliente" aria-label="Buscar o registrar cliente">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>
                    <button type="button" className="sale-customer-input__list" onClick={() => openSearch('')}
                        title="Buscar en la lista de clientes (F2)" aria-label="Buscar en la lista de clientes">
                        <FontAwesomeIcon icon={faUsers} />
                    </button>
                </div>
            )}
            {searchOpen && (
                <CustomerSearchModal
                    customers={customers}
                    initialQuery={searchSeed}
                    selectedId={selectedId}
                    onSelect={choose}
                    onCreate={(identification) => {
                        setSearchOpen(false);
                        onCreate(identification);
                    }}
                    onHide={() => setSearchOpen(false)}
                />
            )}
        </>
    );
};

export default SaleCustomerField;
