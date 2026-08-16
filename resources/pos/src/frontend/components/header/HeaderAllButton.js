import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Nav } from 'react-bootstrap-v5';
import { useNavigate } from 'react-router';
import PosCalculator from './PosCalculator';
import Dropdown from 'react-bootstrap/Dropdown';
import { getFormattedMessage } from '../../../shared/sharedMethod';
import PosRegisterOpenAlertModel from '../../../components/posRegister/PosRegisterOpenAlertModel';

const HeaderAllButton = ( props ) => {
    const { setOpneCalculator, opneCalculator, goToDetailScreen, goToHoldScreen, holdListData, handleClickCloseRegister } = props
    const [ isFullscreen, setIsFullscreen ] = useState( false );
    const [ showROAlertModel, setShowROAlertModel ] = useState( false )
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
                    <Nav.Link className='pe-0 ps-1 text-white' onClick={( e ) => {
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
                        <i className="bi bi-fullscreen-exit cursor-pointer text-white fs-1"
                            onClick={() => fullScreen()} />
                        :
                        <i className="bi bi-arrows-fullscreen cursor-pointer text-white con fs-1"
                            onClick={() => fullScreen()} />
                    }
                </Nav.Item>
                {/* {Calculator} */}
                <Nav.Item className='d-flex align-items-center justify-content-center ms-3'>
                    <i className="bi bi-calculator cursor-pointer text-white fa-2x"
                        onClick={opneCalculatorModel} />
                </Nav.Item>
                {/* Menú de más acciones: dashboard, detalles/cierre de registro,
                    devolución de venta -- antes repartido entre un ícono suelto
                    (dashboard) y un dropdown aparte (bolsa verde, solo
                    registro), ahora consolidado en un solo lugar. */}
                <Nav.Item className='d-flex align-items-center justify-content-center ms-3 pos-more-menu'>
                    <Dropdown align='end'>
                        <Dropdown.Toggle as='div' className='pe-0 text-white cursor-pointer hide-arrow' id='pos-more-actions-dropdown'>
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
            </Nav>
            {opneCalculator && <PosCalculator opneCalculatorModel={opneCalculatorModel} />}
            <PosRegisterOpenAlertModel showROAlertModel={showROAlertModel} setShowROAlertModel={setShowROAlertModel} />
        </>

    )
};

export default HeaderAllButton;
