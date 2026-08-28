import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import MasterLayout from '../MasterLayout';
import ReactDataTable from '../../shared/table/ReactDataTable';
import { changeUserPassword, fetchUsers } from '../../store/action/userAction';
import DeleteUser from './DeleteUser';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getAvatarName, getFormattedDate } from '../../shared/sharedMethod';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Modal, Button, Form, InputGroup } from 'react-bootstrap-v5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const User = (props) => {
    const { users, fetchUsers, totalRecord, isLoading, allConfigData, config } = props;
    const canChangePassword = Array.isArray(config) && config.includes('change_user_passwords');
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    const [passwordModal, setPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const itemsValue = users.length >= 0 && users.map(user => ({
        date: getFormattedDate(user.attributes.created_at, allConfigData && allConfigData),
        time: dayjs(user.attributes.created_at).format('LT'),
        image: user.attributes.image,
        first_name: user.attributes.first_name,
        last_name: user.attributes.last_name,
        email: user.attributes.email,
        phone: user.attributes.phone,
        password: user.attributes.password,
        confirm_password: user.attributes.confirm_password,
        // role_id: user.attributes.role.map(ro => ro.name),
        role_name: user.attributes.role.map((role) => role.name),
        id: user.id
    }));

    const onChange = (filter) => {
        fetchUsers(filter, true);
    };

    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = '#/app/users/edit/' + id;
    };

    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setPassword('');
        setPasswordConfirmation('');
        setPasswordModal(true);
    };

    const savePassword = () => {

        if (!password) {
            return;
        }

        if (password !== passwordConfirmation) {
            return;
        }

        props.changeUserPassword(
            selectedUser.id,
            password,
            passwordConfirmation,
            () => {
                setPasswordModal(false);
                setPassword("");
                setPasswordConfirmation("");
                setSelectedUser(null);
            }
        );
    };

    const columns = [
        {
            name: getFormattedMessage('users.table.user.column.title'),
            selector: row => row.first_name,
            sortField: 'first_name',
            sortable: true,
            cell: row => {
                const imageUrl = row.image ? row.image : null;
                const lastName = row.last_name ? row.last_name : '';
                return <div className='d-flex align-items-center'>
                    <div className='me-2'>
                        <Link to={`/app/users/detail/${row.id}`}>
                            {imageUrl ?
                                <img src={imageUrl} height='50' width='50' alt='User Image'
                                    className='image image-circle image-mini' /> :
                                <span className='custom-user-avatar fs-5'>
                                    {getAvatarName(row.first_name + ' ' + row.last_name)}
                                </span>
                            }
                        </Link>
                    </div>
                    <div className='d-flex flex-column'>
                        <Link to={`/app/users/detail/${row.id}`} className='text-decoration-none'>{row.first_name + ' ' + lastName}</Link>
                        <span>{row.email}</span>
                    </div>
                </div>
            }
        },
        {
            name: getFormattedMessage("user.input.role.label"),
            selector: row => row.role_name,
            sortField: 'role_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('users.table.phone-number.column.title'),
            selector: row => row.phone,
            sortField: 'phone',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.react-table.column.created-date.label'),
            selector: row => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton
                item={row}
                goToEditProduct={goToEdit}
                onClickDeleteModel={onClickDeleteModel}
                onClickPassword={canChangePassword ? openPasswordModal : null}
                isEditMode={true}
            />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('users.title')} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange}
                ButtonValue={getFormattedMessage('user.create.title')}
                to='#/app/users/create' totalRows={totalRecord} isLoading={isLoading} />
            <DeleteUser onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            <Modal
                show={passwordModal}
                onHide={() => setPasswordModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cambiar contraseña
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Nueva contraseña
                        </Form.Label>

                        <InputGroup>

                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                variant="light"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                />
                            </Button>

                        </InputGroup>

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>
                            Confirmar contraseña
                        </Form.Label>

                        <InputGroup>

                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                            />

                            <Button
                                variant="light"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                />
                            </Button>

                        </InputGroup>

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => setPasswordModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        onClick={savePassword}
                    >
                        Guardar
                    </Button>

                </Modal.Footer>

            </Modal>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const { users, totalRecord, isLoading, allConfigData, config } = state;
    return { users, totalRecord, isLoading, allConfigData, config }
};
export default connect(mapStateToProps, { fetchUsers,changeUserPassword })(User);
