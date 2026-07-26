import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MasterLayout from '../MasterLayout';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import TabTitle from '../../shared/tab-title/TabTitle';
import ReactDataTable from '../../shared/table/ReactDataTable';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import CreateVariation from './CreateVariation';
import { fetchVariations } from '../../store/action/variationAction';
import ActionButton from '../../shared/action-buttons/ActionButton';
import EditVariation from './EditVariation';
import DeleteVariation from './DeleteVariation';


const Variation = (props) => {

    const dispatch = useDispatch();
    const { variations, isLoading, totalRecord } = useSelector(state => state);
    const [editModel, setEditModel] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [variation, setVariation] = useState();

    useEffect(() => {
        dispatch(fetchVariations());
    }, []);

    const handleClose = (item) => {
        setEditModel(!editModel)
        setVariation(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        dispatch(fetchVariations(filter, true));
    };


    const itemsValue = variations.length >= 0 && variations.map(variation => ({
        name: variation.attributes.name,
        id: variation.id,
        variation_types: variation.attributes.variation_types,
        is_presentation: variation.attributes.is_presentation,
    }));

    const columns = [
        {
            name: placeholderText('variation.name'),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
        },
        {
            name: placeholderText('variation.variation_types'),
            selector: row => row.variation_types.map(type => type.name).join(' , '),
            cell: row => {
                const nombres = row.variation_types.map(type => type.name);
                const limite = 4;
                const visibles = nombres.slice(0, limite);
                const restantes = nombres.length - limite;
                return (
                    <span title={nombres.join(', ')}>
                        {visibles.join(', ')}
                        {restantes > 0 && (
                            <span className="badge bg-light-secondary ms-1">
                                +{restantes} más
                            </span>
                        )}
                    </span>
                );
            },
            wrap: true,
            grow: 2,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ]

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('variations.title')} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                AddButton={<CreateVariation />}
                totalRows={totalRecord} />
            <EditVariation handleClose={handleClose} show={editModel} variation={variation} />
            <DeleteVariation onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                onDelete={isDelete} />
        </MasterLayout>
    )

}
export default Variation;
