import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import Form from 'react-bootstrap/Form';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {UpdateEmailTemplate} from "../../store/action/emailTemplatesAction";

// Cada tipo de plantilla reemplaza variables distintas -- Venta y
// Devolución de venta usan el formato {variable}, y Documentos
// Electrónicos usa {{VARIABLE}} (mismo formato que ya se ve en el
// asunto sugerido).
const VARIABLES_POR_TIPO = {
    1: ['{customer_name}', '{sales_id}', '{sales_date}', '{sales_amount}', '{paid_amount}', '{due_amount}', '{app_name}'],
    2: ['{customer_name}', '{sales_return_id}', '{sales_return_date}', '{sales_return_amount}', '{app_name}'],
    3: ['{{NUMERO DE COMPROBANTE}}', '{{NOMBRE DE LA EMPRESA}}', '{{FECHA EMISION}}', '{{TIPO DOCUMENTO}}', '{{NUMERO DOCUMENTO}}'],
};

const EmailTemplateForm = (props) => {
    const {id, singleEmailTemplate, UpdateEmailTemplate} = props;
    const navigate = useNavigate();

    const [emailTemplateValue, setEmailTemplateValue] = useState({
        name: singleEmailTemplate ? singleEmailTemplate[0].name : '',
        subject: singleEmailTemplate ? (singleEmailTemplate[0].subject || '') : '',
        content: singleEmailTemplate ? singleEmailTemplate[0].content : ''
    });

    const [errors, setErrors] = useState({
        name: '',
        subject: '',
        content: ""
    });

    const disabled = singleEmailTemplate
        && singleEmailTemplate[0].content === emailTemplateValue.content
        && (singleEmailTemplate[0].subject || '') === emailTemplateValue.subject

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!emailTemplateValue['name']) { 
            errorss['name'] = getFormattedMessage('globally.input.name.validate.label');
        } else if (!emailTemplateValue['subject']) {
            errorss['subject'] = "El asunto es obligatorio";
        } else if (!emailTemplateValue['content']) {
            errorss['content'] = "content must be required";
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setEmailTemplateValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleEmailTemplate && valid) {
            if (!disabled) {
                UpdateEmailTemplate(id, emailTemplateValue, navigate);
            }
        }
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
    ];

    const handleContentChange = (content, delta, source, editor) => {
        setEmailTemplateValue(inputs => ({...inputs, content: content}))
    }

    const tipoTemplate = singleEmailTemplate ? singleEmailTemplate[0].type : null;
    const variables = VARIABLES_POR_TIPO[tipoTemplate] || VARIABLES_POR_TIPO[1];

    return (
        <div className='card'>
            <div className="card-header py-3" style={{ background: '#2F6FED', borderRadius: '0.475rem 0.475rem 0 0' }}>
                <h4 className="text-white mb-0">
                    Formato Correo - {emailTemplateValue.name || '...'}
                </h4>
            </div>
            <div className='card-body'>
                <div className="alert alert-warning mb-4">
                    Estimado usuario, tomar en consideración que aquellos campos que se encuentran
                    entre llaves ({'{}'}) tanto en el Asunto como en el Contenido del correo serán
                    reemplazados por aquellos datos que indican su etiqueta.
                </div>
                <Form>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage('globally.input.name.label')}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='name'
                                   readOnly={true}
                                   placeholder={placeholderText('globally.input.name.placeholder.label')}
                                   className='form-control disabled' autoFocus={true}
                                   onChange={(e) => onChangeInput(e)}
                                   value={emailTemplateValue.name}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>

                            <label className='form-label mt-3'>
                                Asunto:
                            </label>
                            <span className='required'/>
                            <input type='text' name='subject'
                                   placeholder='Ej: Documento Electrónico: {{NUMERO DE COMPROBANTE}}'
                                   className='form-control'
                                   onChange={(e) => onChangeInput(e)}
                                   value={emailTemplateValue.subject}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['subject'] ? errors['subject'] : null}</span>

                            <label
                                className='form-label mt-3'>{getFormattedMessage('globally.input.content.label')}: </label>
                            <ReactQuill theme="snow" formats={formats} value={emailTemplateValue.content}
                                        onChange={handleContentChange}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['content'] ? errors['content'] : null}</span>

                        </div>
                        <div className='col-md-6 mb-3 '>
                            <div className="email-template-padding">
                                <label
                                    className='form-label text-decoration-underline'>{getFormattedMessage('email-content-variables.title')}
                                    : </label>
                                <ul className="text-gray-600">
                                    {variables.map((variable) => (
                                        <li key={variable}>{variable}</li>
                                    ))}
                                </ul>
                            </div>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['content'] ? errors['content'] : null}</span>
                        </div>
                        <ModelFooter onEditRecord={singleEmailTemplate} onSubmit={onSubmit} editDisabled={disabled}
                                     link='/app/email-templates' addDisabled={!emailTemplateValue.name}/>
                    </div>
                </Form>
            </div>
        </div>
    )
};

export default connect(null, {UpdateEmailTemplate})(EmailTemplateForm);
