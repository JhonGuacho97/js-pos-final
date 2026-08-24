import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {ReactSearchAutocomplete} from 'react-search-autocomplete';
import {addToast} from '../../../../store/action/toastAction';
import {toastType} from '../../../../constants';
import {searchPurchaseProduct} from '../../../../store/action/purchaseProductAction';
import {getFormattedMessage, placeholderText} from '../../../sharedMethod';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import SalesPresentationSelectModal from './SalesPresentationSelectModal';
import PurchasePresentationSelectModal from './PurchasePresentationSelectModal';

/**
 * Buscador de productos compartido por 8 formularios (Compra, Devolución de
 * compra, Venta, Cotización, Devolución de venta, Ajuste, Transferencia,
 * Imprimir código).
 *
 * presentationMode ('sale' | 'purchase' | undefined) es OPCIONAL: si el
 * formulario que lo usa no lo manda, el comportamiento es exactamente el
 * de siempre (cero cambios para los formularios que no lo necesitan hoy).
 * Cuando sí se manda, y el producto encontrado tiene manage_presentations
 * activo, en vez de agregarlo directo al carrito se abre un modal para
 * elegir la presentación (Six Pack/Caja/...) y la cantidad -- 'sale' usa
 * el precio de venta de esa presentación, 'purchase' usa su costo.
 */
const ProductSearch = (props) => {
    const {
        values,
        products,
        updateProducts,
        setUpdateProducts,
        customProducts,
        searchPurchaseProduct,
        handleValidation,
        isAllProducts,
        presentationMode,
        initialSearchCode,
    } = props;
    const [searchString, setSearchString] = useState("");
    const [presentationProduct, setPresentationProduct] = useState(null);
    const dispatch = useDispatch();
    const filterProducts = isAllProducts && values.warehouse_id ? products.map((item) => ({
        name: item.attributes.name, code: item.attributes.code, id: item.id,
        variationLabel: item.attributes.variation_product?.variation_type_name || null,
    })) : values.warehouse_id && products.filter((qty) => qty && qty.attributes && qty.attributes.stock && qty.attributes.stock.quantity > 0).map((item) => ({
        name: item.attributes.name, code: item.attributes.code, id: item.id,
        variationLabel: item.attributes.variation_product?.variation_type_name || null,
    }))

    useEffect(() => {
        // Prellenado desde "Reponer" (dashboard): solo escribe el texto de
        // búsqueda una vez que ya hay productos cargados para el almacén --
        // el usuario sigue teniendo que elegirlo de la lista, esto no
        // agrega nada al carrito por sí solo.
        if (initialSearchCode && values.warehouse_id && filterProducts?.length && !searchString) {
            setSearchString(initialSearchCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSearchCode, values.warehouse_id, filterProducts?.length]);

    const onProductSearch = (code) => {
        if (!values.warehouse_id) {
            handleValidation();
        } else {
            setSearchString(code);
            const matchedProduct = products.find((item) => item.attributes.code === code || item.attributes.code === code.code);
            const newId = matchedProduct ? [matchedProduct.id] : [];
            const finalIdArrays = customProducts.map((id) => id.product_id);
            const finalId = finalIdArrays.filter((finalIdArray) => finalIdArray === newId[0]);
            if (finalId[0] !== undefined) {
                if (updateProducts.find(exitId => exitId.product_id === finalId[0])) {
                    dispatch(addToast({
                        text: getFormattedMessage('globally.product-already-added.validate.message'),
                        type: toastType.ERROR
                    }));
                } else if (presentationMode && matchedProduct?.attributes?.manage_presentations) {
                    // Este producto vende/compra por presentaciones -- se
                    // pregunta cuál y cuántas en vez de agregar directo.
                    setPresentationProduct(matchedProduct);
                } else {
                    searchPurchaseProduct(newId[0])
                    const pushArray = [...customProducts]
                    if (updateProducts.filter(product => product.code === code || product.code === code.code).length > 0) {
                        setUpdateProducts(updateProducts => updateProducts.map((item) => {
                            return item
                        }))
                    } else {
                        const newProduct = pushArray.find(element => element.product_id === finalId[0]);
                        setUpdateProducts([...updateProducts, newProduct]);
                    }
                }
                removeSearchClass();
                setSearchString("");
            }
        }
    }

    const onPresentationConfirm = (product, presentation, qty) => {
        const baseLine = customProducts.find((item) => item.product_id === product.id);
        if (!baseLine) {
            return;
        }

        const newLine = {
            ...baseLine,
            product_presentation_id: presentation.id,
            product_presentation: presentation,
            presentation_quantity: qty,
            presentation_equivalence: presentation.equivalence,
            // OJO: NO tocar short_name acá -- ese campo es la unidad
            // PROPIA del producto (ej. "Unidad"), la que se usa para
            // mostrar el stock disponible ("66 UNIDAD"). Ponerle el
            // nombre de la presentación elegida (ej. "Caja") hacía que el
            // stock se mostrara mal etiquetado ("66 CAJA"), como si esas
            // 66 unidades fueran 66 cajas.
            quantity: qty,
            sub_total: 0.00,
        };

        if (presentationMode === 'purchase') {
            const cost = presentation.effective_cost ?? presentation.cost ?? 0;
            newLine.product_cost = cost;
            newLine.net_unit_cost = cost;
            newLine.fix_net_unit = cost;
        } else {
            const price = presentation.effective_price ?? presentation.price ?? 0;
            newLine.product_price = price;
            newLine.net_unit_price = price;
            newLine.fix_net_unit = price;
        }

        setUpdateProducts([...updateProducts, newLine]);
        setPresentationProduct(null);
    }

    const handleOnSearch = (string) => {
        onProductSearch(string);
    }

    const handleOnSelect = (result) => {
        onProductSearch(result);
    }

    const formatResult = (item) => {
        return (
            <span onClick={(e) => e.stopPropagation()}>{item.code} ({item.name}{item.variationLabel ? ` - ${item.variationLabel}` : ""})</span>
        )
    }

    const removeSearchClass = () => {
        const html = document.getElementsByClassName(`custom-search`)[0].firstChild.firstChild.lastChild;
        html.style.display = 'none'
    }

    return (
        <div className='position-relative custom-search'>
            <ReactSearchAutocomplete
                items={filterProducts}
                onSearch={handleOnSearch}
                inputSearchString={searchString}
                fuseOptions={{keys: ['code', 'name', 'variationLabel']}}
                maxResults={30}
                resultStringKeyName='code'
                placeholder={placeholderText('globally.search.field.label')}
                onSelect={handleOnSelect}
                formatResult={formatResult}
                showIcon={false}
                showClear={false}
            />
            <FontAwesomeIcon icon={faSearch}
                             className='d-flex align-items-center top-0 bottom-0 react-search-icon my-auto text-gray-600 position-absolute'/>
            {presentationMode === 'sale' && (
                <SalesPresentationSelectModal
                    show={!!presentationProduct}
                    onHide={() => setPresentationProduct(null)}
                    product={presentationProduct}
                    onConfirm={onPresentationConfirm}
                />
            )}
            {presentationMode === 'purchase' && (
                <PurchasePresentationSelectModal
                    show={!!presentationProduct}
                    onHide={() => setPresentationProduct(null)}
                    product={presentationProduct}
                    onConfirm={onPresentationConfirm}
                />
            )}
        </div>
    );
}

export default connect(null, {searchPurchaseProduct})(ProductSearch);
