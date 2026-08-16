import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';
import {editRole} from '../../store/action/roleAction';
import {getFormattedMessage, placeholderText} from "../../shared/sharedMethod";
import {PERMISSION_GROUP_ORDER, PERMISSION_GROUP_LABEL_KEYS, getPermissionGroup} from "../../config/permissionGroups";
import {getPermissionLabelKey} from "../../config/permissionLabels";

const RoleForm = (props) => {
    const {addRolesData, singleRole, editRole, permissionsArray, id} = props;
    const navigate = useNavigate();
    const [permissions, setNewPer] = useState(permissionsArray);
    const [saveButtonEnable, setSaveButtonEnable] = useState('')
    const [allChecked, setAllChecked] = useState( false)
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [rolesValue, setRolesValue] = useState({
        name: '',
        description: '',
        permissions: []
    });

    const [errors, setErrors] = useState({
        name: '',
        permissions: ''
    });

    useEffect(()=> {
        setRolesValue(
            {
                name:singleRole ? singleRole.name : "",
                description: singleRole ? (singleRole.description || '') : "",
                permissions: singleRole ? singleRole.permissions : ''
            }
        )
    }, [singleRole])

    useEffect(() => {
        const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id));
        setSaveButtonEnable(permissionsArrays);
        setAllChecked(permissions.every(item => item.selected));
    }, [permissions, allChecked]);

    const disabled = saveButtonEnable.length === 0 ? true : singleRole && singleRole.name === rolesValue.name && (singleRole.description || '') === rolesValue.description && JSON.stringify(singleRole.permissions.map((item)=>item.id)) === JSON.stringify(saveButtonEnable);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!rolesValue['name']) {
            errorss['name'] = getFormattedMessage("role.input.name.validate.label");
        } else if ((rolesValue['name'] && rolesValue['name'].length > 50)) {
            errorss['name'] = getFormattedMessage("role.input.name.valid.validate.label");
        } else if (!saveButtonEnable) {
            errorss['permissions'] = 'Please select permissions';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const handleValidations = () => {
        let errorss = {};
        let isValid = false;
        if (!rolesValue['name']) {
            errorss['name'] = getFormattedMessage("globally.input.name.label");
        } else if(!rolesValue['permissions']) {
            errorss['permissions'] = 'Please select permissions';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (event) => {
        event.preventDefault();
        setRolesValue(inputs => ({...inputs, [event.target.name]: event.target.value}))
        setErrors('');
    };

    const handleChanged = (event) => {
        let itemName = event.target.name;
        let checked = event.target.checked;
        if (itemName === "all_check") {
            setAllChecked(!allChecked)
            setNewPer(permissions.map(item => ({ ...item, selected: checked }))) ;
        } else {
            setNewPer(permissions.map(item => item.name === itemName ? ({ ...item, selected: checked }) : item));
        }
    };

    const handleGroupChanged = (groupKey, checked) => {
        setNewPer(permissions.map(item =>
            getPermissionGroup(item.slug) === groupKey ? ({ ...item, selected: checked }) : item
        ));
    };

    const toggleGroupCollapsed = (groupKey) => {
        setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
    };

    const groupedPermissions = PERMISSION_GROUP_ORDER
        .map((groupKey) => [groupKey, permissions.filter((item) => getPermissionGroup(item.slug) === groupKey)])
        .filter(([, items]) => items.length > 0);

    const selectedCount = permissions.filter((item) => item.selected).length;

    const onSubmit = (event, rolesValue) => {
        event.preventDefault();
        const Valid = handleValidation();
        if (Valid) {
            const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id))
            rolesValue.permissions = permissionsArrays;
            setRolesValue(rolesValue);
            addRolesData(rolesValue);
            setSaveButtonEnable(permissionsArrays);
        }
    };

    const onEdit = (event) => {
        event.preventDefault();
        const Valid = handleValidations();
        if (Valid && !disabled) {
            const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id))
            rolesValue.permissions = permissionsArrays;
            setRolesValue(rolesValue);
            editRole(id, rolesValue, navigate);
        }
    };

    return (
        <div className='container-fluid pt-10'>
            <Form>
                <div className='role-form-layout'>
                    <div className='role-form-sidebar'>
                        <div className='card custom-card p-5 bg-white role-form-sidebar-card'>
                            <Form.Group className='mb-5 form-group'>
                                <Form.Label className='form-label fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("globally.input.name.label")}: </Form.Label>
                                <span className='required'/>
                                <Form.Control type='text' name='name' placeholder={placeholderText("globally.input.name.placeholder.label")}
                                              className='form-control-solid'
                                              autoFocus={true}
                                              onChange={(event) => onChangeInput(event)}
                                              value={rolesValue.name}/>
                                <span className='text-danger'>{errors['name'] ? errors['name'] : null}</span>
                            </Form.Group>
                            <Form.Group className='mb-5 form-group'>
                                <Form.Label className='form-label fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("role.input.description.label")}: </Form.Label>
                                <Form.Control as='textarea' rows={4} name='description'
                                              placeholder={placeholderText("role.input.description.placeholder.label")}
                                              className='form-control-solid'
                                              onChange={(event) => onChangeInput(event)}
                                              value={rolesValue.description}/>
                            </Form.Group>
                            <div className='role-form-selected-count'>
                                {selectedCount} {getFormattedMessage('role.selected-count.label')}
                            </div>
                            <span className='text-danger'>{errors['permissions'] ? errors['permissions'] : null}</span>
                        </div>
                    </div>

                    <div className='role-form-permissions'>
                        <div className='role-permissions-toolbar'>
                            <label className='role-permission-select-all role-permission-select-all-global'>
                                <input type='checkbox' checked={allChecked}
                                       name='all_check'
                                       onChange={(event) => handleChanged(event)}
                                       className='form-check-input cursor-pointer'/>
                                <span>{getFormattedMessage("role.select.all-permission.label")}</span>
                            </label>
                        </div>
                        {groupedPermissions.map(([groupKey, items]) => {
                            const isCollapsed = !!collapsedGroups[groupKey];
                            const selectedInGroup = items.filter((item) => item.selected).length;
                            return (
                                <div className='role-permission-accordion' key={groupKey}>
                                    <div className='role-permission-accordion-header' onClick={() => toggleGroupCollapsed(groupKey)}>
                                        <div className='role-permission-accordion-header-left'>
                                            <FontAwesomeIcon icon={faAngleDown}
                                                              className={`role-permission-chevron${isCollapsed ? ' role-permission-chevron-collapsed' : ''}`}/>
                                            <span className='role-permission-accordion-title'>{getFormattedMessage(PERMISSION_GROUP_LABEL_KEYS[groupKey])}</span>
                                            <span className='role-permission-count-badge'>{selectedInGroup} / {items.length}</span>
                                        </div>
                                        <label className='role-permission-select-all' onClick={(event) => event.stopPropagation()}>
                                            <input type='checkbox'
                                                   checked={items.every((item) => item.selected)}
                                                   onChange={(event) => handleGroupChanged(groupKey, event.target.checked)}
                                                   className='form-check-input cursor-pointer'/>
                                            <span>{getFormattedMessage('role.select-all.label')}</span>
                                        </label>
                                    </div>
                                    {!isCollapsed && (
                                        <div className='role-permission-accordion-body'>
                                            <div className='role-permission-grid'>
                                                {items.map((permission) => {
                                                    const labelKey = getPermissionLabelKey(permission.slug);
                                                    return (
                                                        <label className='role-permission-card' key={permission.id}>
                                                            <input type='checkbox' checked={permission.selected}
                                                                   name={permission.name}
                                                                   value={permission.name}
                                                                   onChange={(event) => handleChanged(event)}
                                                                   className='form-check-input cursor-pointer'/>
                                                            <div className='role-permission-card-text'>
                                                                <span className='role-permission-card-label'>
                                                                    {labelKey ? getFormattedMessage(labelKey) : permission.name}
                                                                </span>
                                                                <code className='role-permission-card-slug'>{permission.slug}</code>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='d-flex mt-5'>
                    {singleRole ?
                        <div onClick={(event) => onEdit(event)}>
                            <input className='btn btn-primary me-3' type='submit' value={placeholderText("globally.save-btn")}
                                   disabled={disabled}
                            />
                        </div>
                        :
                        <div onClick={(event) => onSubmit(event, rolesValue)}>
                            <input className='btn btn-primary me-3' type='submit' value={placeholderText("globally.save-btn")}
                                   disabled={!rolesValue.name || !(saveButtonEnable.length !== 0)}/>
                        </div>
                    }
                    <Link to='/app/roles'
                          className='btn btn-light btn-active-light-primary me-3'>{getFormattedMessage("globally.cancel-btn")}</Link>
                </div>
            </Form>
        </div>
    )
};

export default connect(null, {editRole})(RoleForm);
