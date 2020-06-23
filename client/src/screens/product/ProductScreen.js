import React, {useState} from 'react'
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'
import { Form, Button, Tab, Tabs } from 'react-bootstrap'
import {
  queryProducts,
} from '../../actions/productActions';
import  ProductItemComponent  from './ProductItemComponent';

const ProductScreen = ({
  // from state
  // authReduces
  appInitialised,
  isAuthenticated,
  // productReducer
  queriedProducts,
  // from actions
  queryProducts,
}) => {
  const initialState = {
    productQueryText: '',
    selectedProduct: null,
  }
  const [ componentState, setComponentState ] = useState({ ...initialState })

  const { 
    productQueryText,
    selectedProduct
  } = componentState;



  if( !isAuthenticated && appInitialised ) {
    return  <Redirect to='/' />;
  }
  return (
    <div>
      Product Screen
      <Form.Control
        type='text'
        placeholder='Search Products'
        name='categoryQueryText'
        value={productQueryText}
        onChange={(e) => {
          // if (selectedProduct) {
          //   setSelectedProduct(null);
          // }
          setComponentState({
            ...componentState,
            productQueryText: e.target.value
          });          
          queryProducts({ search: e.target.value });
        }}
      />
      {
        queriedProducts.length > 0 && (
          queriedProducts.map(productItem => (
            <ProductItemComponent
              key={productItem._id}
              productItem={productItem}
              clickHandler={({ product }) => {
                console.log('In future, this click will lead us to ProductDetailsPage')
                // setProductQueryText('')
                // queryProducts('')
                // setSelectedProduct(product);
                // setFormData({
                //   ...formData,
                //   productId: product._id
                // })
              }}
            />
          ))
        )
      }
    </div>
  );
};


const mapStateToProps = (state) => ({
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
  queriedProducts: state.productReducer.queriedProducts,
});

export default connect(
  mapStateToProps, 
  {
    queryProducts
  }
)(ProductScreen);
