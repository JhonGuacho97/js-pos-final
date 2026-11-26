import React, { useEffect } from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.scss';
import { Nav, Button } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { fetchAllProductCategories } from '../../store/action/productCategoryAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Category = (props) => {
    const { fetchAllProductCategories, productCategories, setCategory, categoryId } = props;

    useEffect(() => {
        fetchAllProductCategories();
    }, []);

    //filter category function
    const onSelectCategory = (productCategory) => {
        setCategory(productCategory);
    };

    const categoryItem = productCategories
        ?.filter(productCategory => productCategory.attributes.products_count > 0)
        .map((productCategory) => (
            <Nav.Item key={productCategory.id} className="button-list__item">
                <Button
                    variant="light"
                    className={`custom-btn-size w-100 ${String(categoryId) === String(productCategory.id)
                        ? "button-list__item-active text-white"
                        : ""
                        }`}
                    aria-pressed={String(categoryId) === String(productCategory.id)}
                    onClick={() => onSelectCategory(productCategory.id)}
                >
                    {productCategory.attributes.name}
                </Button>
            </Nav.Item>
        ));

    return (
        <Nav className='button-list mb-2 d-flex flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`custom-btn-size ${!categoryId || String(categoryId) === '0' ? 'button-list__item-active text-white' : ''}`}
                    aria-pressed={!categoryId || String(categoryId) === '0'}
                    onClick={() => onSelectCategory(0)}>
                    {getFormattedMessage('pos-all.categories.label')}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {categoryItem}
            </Swiper>
        </Nav>
    )
};
const mapStateToProps = (state) => {
    const { productCategories } = state;
    return { productCategories }
};

export default connect(mapStateToProps, { fetchAllProductCategories })(Category);
