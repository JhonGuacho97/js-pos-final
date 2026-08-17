import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getFormattedMessage } from '../../shared/sharedMethod';

/**
 * Aplana newRoutes (ya filtrado por permisos, con groupHeader/newRoute
 * intercalados -- ver MasterLayout.js:prepareRoutes()) en una lista
 * buscable de páginas. Reutiliza EXACTAMENTE el mismo criterio que
 * AsideMenu.js usa para decidir qué es un encabezado de grupo o un
 * acordeón, en vez de inventar una segunda fuente de verdad sobre la
 * estructura del menú.
 */
const buildSearchablePages = (newRoutes) => {
    const pages = [];
    let currentGroup = null;

    (newRoutes || []).forEach((route) => {
        if (route.groupHeader) {
            currentGroup = route.title;
            return;
        }
        if (route.newRoute?.length) {
            route.newRoute.forEach((child) => {
                if (child.to) {
                    pages.push({ title: child.title, to: child.to, group: currentGroup });
                }
            });
            return;
        }
        if (route.to && route.to !== '/app/pos') {
            pages.push({ title: route.title, to: route.to, group: currentGroup });
        }
    });

    return pages;
};

const GlobalSearch = ({ newRoutes }) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef();

    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform || '');

    const pages = useMemo(() => buildSearchablePages(newRoutes), [newRoutes]);

    const results = useMemo(() => {
        const labeled = pages.map((page) => ({
            ...page,
            label: intl.formatMessage({ id: page.title }),
            groupLabel: page.group ? intl.formatMessage({ id: page.group }) : '',
        }));
        const q = query.trim().toLowerCase();
        if (!q) return labeled;
        return labeled.filter((page) => page.label.toLowerCase().includes(q));
    }, [pages, query, intl]);

    const grouped = useMemo(() => {
        const map = new Map();
        results.forEach((item) => {
            const key = item.groupLabel || '';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(item);
        });
        return Array.from(map.entries());
    }, [results]);

    // Atajo global Cmd/Ctrl+K -- vive acá (montado una vez en
    // MasterLayout) para que funcione en cualquier pantalla, no solo
    // mientras el buscador ya está abierto.
    useEffect(() => {
        const handler = (event) => {
            if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
                event.preventDefault();
                setOpen((prev) => !prev);
            } else if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };

    const onInputKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const item = results[activeIndex];
            if (item) goTo(item.to);
        }
    };

    return (
        <>
            <button type='button' className='hdr-search-trigger align-self-center' onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faSearch} className='hdr-search-icon' />
                <span className='hdr-search-placeholder'>{getFormattedMessage('header.search.placeholder')}</span>
                <span className='hdr-search-kbd'>{isMac ? '⌘' : 'Ctrl'} K</span>
            </button>

            {open && createPortal(
                <div className='hdr-search-overlay' onClick={() => setOpen(false)}>
                    <div className='hdr-search-modal' onClick={(event) => event.stopPropagation()}>
                        <div className='hdr-search-modal-input-row'>
                            <FontAwesomeIcon icon={faSearch} className='hdr-search-modal-icon' />
                            <input
                                ref={inputRef}
                                type='text'
                                className='hdr-search-modal-input'
                                placeholder={intl.formatMessage({ id: 'header.search.modal-placeholder' })}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={onInputKeyDown}
                            />
                            <button type='button' className='hdr-search-modal-close' onClick={() => setOpen(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className='hdr-search-modal-results'>
                            {results.length === 0 ? (
                                <div className='hdr-search-modal-empty'>
                                    {getFormattedMessage('header.search.no-results')}
                                </div>
                            ) : (
                                grouped.map(([groupLabel, items]) => (
                                    <div key={groupLabel || 'sin-grupo'} className='hdr-search-modal-group'>
                                        {groupLabel && (
                                            <div className='hdr-search-modal-group-label'>{groupLabel}</div>
                                        )}
                                        {items.map((item) => {
                                            const idx = results.indexOf(item);
                                            return (
                                                <div
                                                    key={item.to}
                                                    className={`hdr-search-modal-item${idx === activeIndex ? ' hdr-search-modal-item-active' : ''}`}
                                                    onMouseEnter={() => setActiveIndex(idx)}
                                                    onClick={() => goTo(item.to)}
                                                >
                                                    {item.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className='hdr-search-modal-footer'>
                            <span><kbd>↵</kbd> {getFormattedMessage('header.search.go-to')}</span>
                            <span><kbd>↑</kbd><kbd>↓</kbd> {getFormattedMessage('header.search.navigate')}</span>
                            <span><kbd>Esc</kbd> {getFormattedMessage('header.search.close')}</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default GlobalSearch;
