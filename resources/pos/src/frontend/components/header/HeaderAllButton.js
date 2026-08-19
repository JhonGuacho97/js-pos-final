import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Modal, Nav } from 'react-bootstrap-v5';
import { useNavigate } from 'react-router';
import PosCalculator from './PosCalculator';
import Dropdown from 'react-bootstrap/Dropdown';
import { getFormattedMessage } from '../../../shared/sharedMethod';
import PosRegisterOpenAlertModel from '../../../components/posRegister/PosRegisterOpenAlertModel';

const HeaderAllButton = ( props ) => {
    const { setOpneCalculator, opneCalculator, goToDetailScreen, goToHoldScreen, holdListData, handleClickCloseRegister } = props
    const [ isFullscreen, setIsFullscreen ] = useState( false );
    const [ showROAlertModel, setShowROAlertModel ] = useState( false )
    const [ showMoreActions, setShowMoreActions ] = useState( false )
    const navigate = useNavigate();

    const fullScreen = () => {
        if ( !document.fullscreenElement ) {
            document.documentElement.requestFullscreen();
            setIsFullscreen( true );
        } else {
            if ( document.exitFullscreen ) {
                document.exitFullscreen();
                setIsFullscreen( false );
            }
        }
    };

    const opneCalculatorModel = () => {
        if ( opneCalculator ) {
            setOpneCalculator( false )
        } else {
            setOpneCalculator( true )
        }
    }

    return (
        <>
            <Nav className='align-items-center header-btn-grp justify-xxl-content-end justify-lg-content-center justify-content-start flex-nowrap pb-xxl-0 pb-lg-2 pb-2 '>
                <Nav.Item className='d-flex align-items-center position-relative justify-content-center ms-3 nav-pink'>
                    <Nav.Link title="Ventas en espera" aria-label="Ventas en espera" className='pe-0 ps-1' onClick={( e ) => {
                        e.stopPropagation();
                        goToHoldScreen()
                    }}>
                        <FontAwesomeIcon icon={faList} className='fa-2x' />
                        {/* <i className="bi bi-hand fa-2x"/> */}
                    </Nav.Link>
                    <div className='hold-list-badge'>{holdListData.length ? holdListData.length : 0}</div>
                </Nav.Item>
                {/*full screen icon*/}
                <Nav.Item className='ms-3 d-flex align-items-center justify-content-center'>
                    {isFullscreen === true ?
                        <i title="Salir de pantalla completa" className="bi bi-fullscreen-exit cursor-pointer fs-1"
                            onClick={() => fullScreen()} />
                        :
                        <i title="Pantalla completa" className="bi bi-arrows-fullscreen cursor-pointer con fs-1"
                            onClick={() => fullScreen()} />
                    }
                </Nav.Item>
                {/* {Calculator} */}
                <Nav.Item className='d-flex align-items-center justify-content-center ms-3'>
                    <i title="Calculadora" className="bi bi-calculator cursor-pointer fa-2x"
                        onClick={opneCalculatorModel} />
                </Nav.Item>
                {/* Menú de más acciones: dashboard, detalles/cierre de registro,
                    devolución de venta -- antes repartido entre un ícono suelto
                    (dashboard) y un dropdown aparte (bolsa verde, solo
                    registro), ahora consolidado en un solo lugar. */}
                <Nav.Item className='d-none d-sm-flex align-items-center justify-content-center ms-3 pos-more-menu'>
                    <Dropdown align='end'>
                        <Dropdown.Toggle title="Más acciones" as='div' className='pe-0 cursor-pointer hide-arrow' id='pos-more-actions-dropdown'>
                            <i className="bi bi-three-dots-vertical fa-2x" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setShowROAlertModel( true )}>
                                <i className="bi bi-speedometer2 me-2" />{getFormattedMessage( "pos.more-menu.dashboard.label" )}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={( e ) => {
                                e.stopPropagation();
                                goToDetailScreen()
                            }}>
                                <i className="bi bi-file-earmark-text me-2" />{getFormattedMessage( "register.details.title" )}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleClickCloseRegister()}>
                                <i className="bi bi-lock me-2" />{getFormattedMessage( "globally.close-register.title" )}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => navigate( '/app/sale-return' )}>
                                <i className="bi bi-arrow-return-left me-2" />{getFormattedMessage( "sale-return.title" )}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav.Item>
                <Nav.Item className='d-flex d-sm-none align-items-center justify-content-center ms-3 pos-more-menu pos-more-menu-mobile'>
                    <button
                        type="button"
                        className="pos-more-actions-trigger"
                        title="Más acciones"
                        aria-label="Más acciones"
                        onClick={() => setShowMoreActions( true )}
                    >
                        <i className="bi bi-three-dots-vertical fa-2x" />
                    </button>
                </Nav.Item>
            </Nav>
            <Modal
                show={showMoreActions}
                onHide={() => setShowMoreActions( false )}
                centered
                className="pos-more-actions-modal"
                aria-labelledby="pos-more-actions-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="pos-more-actions-title">Más acciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button type="button" className="pos-mobile-action" onClick={() => {
                        setShowMoreActions( false );
                        setShowROAlertModel( true );
                    }}>
                        <i className="bi bi-speedometer2" />
                        <span>{getFormattedMessage( "pos.more-menu.dashboard.label" )}</span>
                    </button>
                    <button type="button" className="pos-mobile-action" onClick={( e ) => {
                        e.stopPropagation();
                        setShowMoreActions( false );
                        goToDetailScreen();
                    }}>
                        <i className="bi bi-file-earmark-text" />
                        <span>{getFormattedMessage( "register.details.title" )}</span>
                    </button>
                    <button type="button" className="pos-mobile-action" onClick={() => {
                        setShowMoreActions( false );
                        handleClickCloseRegister();
                    }}>
                        <i className="bi bi-lock" />
                        <span>{getFormattedMessage( "globally.close-register.title" )}</span>
                    </button>
                    <button type="button" className="pos-mobile-action" onClick={() => {
                        setShowMoreActions( false );
                        navigate( '/app/sale-return' );
                    }}>
                        <i className="bi bi-arrow-return-left" />
                        <span>{getFormattedMessage( "sale-return.title" )}</span>
                    </button>
                </Modal.Body>
            </Modal>
            {opneCalculator && <PosCalculator opneCalculatorModel={opneCalculatorModel} />}
            <PosRegisterOpenAlertModel showROAlertModel={showROAlertModel} setShowROAlertModel={setShowROAlertModel} />
        </>

    )
};

export default HeaderAllButton;
