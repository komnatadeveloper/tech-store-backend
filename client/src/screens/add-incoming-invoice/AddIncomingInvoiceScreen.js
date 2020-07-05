import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// actions
import { querySuppliers } from "../../actions/supplierActions";
import { queryProducts } from "../../actions/productActions";
import { addOrder } from "../../actions/orderActions";
// Components
import { ProductItemComponent } from './ProductItemComponent'
import { ProductItemInOrderList } from "./ProductItemInOrderList";
// helpers
import { mainImageIdHelper } from "../../helpers/helpers";

  



const AddIncomingInvoiceScreen = ({
  // from state
  appInitialised,
  isAuthenticated,
  queriedProducts,
  // from actions
  querySuppliers,
  queryProducts,
  addOrder
}) => {

  const initialFormData = {
    supplierId: '',
    type: 'procurement',
    items: [],
    address: '',
    orderTotalPrice: 0.00,
  };
  const [formData, setFormData] = useState(initialFormData);
  const {
    supplierId,
    orderTotalPrice,
    address,
    items,
  } = formData;

  const [ supplierTitle, setSupplierTitle ] = useState('');
  const [search, setSearch] = useState('');
  const [ searchProduct, setSearchProduct ] = useState('');
  const [ suppliers, setSuppliers] = useState([]);

  const addProductItem = (productItem) => {
    let index = items.findIndex(
      item => item.productId === productItem._id
    );
    if( index >= 0 ) {
      let tempItems = [...items];
      tempItems[index] = {
        ...items[index],
        quantity: items[index].quantity + 1
      };
      setFormData({
        ...formData,
        items: [
          ...tempItems
        ]
      });
    } else {
      let tempItems = [...items];      
      const productItemObject = {
        productId: productItem._id,
        brand: productItem.brand,
        productNo: productItem.productNo,
        keyProperties: productItem.keyProperties,
        mainImageId: mainImageIdHelper({
          imageList: productItem.imageList
        }),
        price: 0.00,
        quantity: 1
      };
      tempItems.push(productItemObject);
      setFormData({
        ...formData,
        items: [
          ...tempItems
        ]
      });
    }
    setSearchProduct('');
    queryProducts({
      search: ''
    })
  }

  const changeItemQuantity = ({
    newQuantity,
    productId
  }) => {
    let index = items.findIndex(
      item => item.productId === productId
    );
    if(index < 0 ) {
      return;
    }
    let _newQuantity;
    if ( 
      !Number.isInteger(newQuantity) 
    ) {
      const tempQuantity = parseInt(newQuantity)
      console.log('parseInt(newQuantity) -> ', tempQuantity);
      if ( isNaN(tempQuantity) ) {
        console.log('it is isNan');
        return;
      }
      _newQuantity = tempQuantity;
    } else {
      _newQuantity = newQuantity;
    }
    if (_newQuantity === 0) {
      let tempItems = [
        ...items.filter(
          item => item.productId !== productId
        )
      ];
      setFormData({
        ...formData,
        items: [
          ...tempItems
        ],
        orderTotalPrice: calculateTotalPrice({
          items: tempItems
        })
      });
      return;
    }
    let tempItems = [
      ...items
    ];
    tempItems[index] = {
      ...items[index],
      quantity: _newQuantity
    };
    setFormData({
      ...formData,
      items: [
        ...tempItems
      ],
      orderTotalPrice: calculateTotalPrice({
        items: tempItems
      })
    });
  } // End of changeItemQuantity


  const changeItemPrice = ({
    newPrice,
    productId
  }) => {
    let index = items.findIndex(
      item => item.productId === productId
    );
    if (index < 0) {
      return;
    }
    if (newPrice === undefined || newPrice === null ) {
      return;
    }
    let _newPrice = parseFloat(newPrice);
    if(isNaN(_newPrice)) {
      return;
    }
    _newPrice = parseFloat(
      _newPrice.toFixed(2)
    );
    let tempItems = [
      ...items
    ];
    tempItems[index] = {
      ...items[index],
      price: _newPrice
    };
    setFormData({
      ...formData,
      items: [
        ...tempItems
      ],
      orderTotalPrice: calculateTotalPrice({
        items: tempItems
      })
    });
  } // End of changeItemPrice

  const calculateTotalPrice = ({
    items
  }) => {
    if (items.length === 0) {
      return 0.00;
    }
    let sum = 0.00;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].price * parseInt(items[i].quantity)
    }
    return sum;
  } // End of calculateTotalPrice



  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isAuthenticated && appInitialised) {
    return <Redirect to='/' />;
  }
  return (
    <div
      style={{
        maxWidth: "950px",
        backgroundColor: "#ddd",
      }}
      className='m-auto p-2'
    >
      Addd Incoming Incoive Screen
      <Form>

        <Form.Group controlId='formBasicEmail' className='my-auto'>
          <div className='d-flex flex-row justify-content-between'>
            <div className='d-flex flex-row my-auto'>
              <Form.Label className='text-center my-auto'>Supplier:</Form.Label>
              {
                supplierTitle !== '' && (
                  <Form.Label className='ml-2 font-weight-bold text-center my-auto'>{supplierTitle}</Form.Label>
                )
              }
            </div>
            {
              supplierTitle !== '' && (
                <Button
                  onClick={() => {
                    setSupplierTitle('');
                    setFormData({
                      ...formData,
                      supplierId: '',
                      address: ''
                    });
                  }}
                >
                  Edit Supplier
                </Button>
              )
            }
          </div>
          {
            supplierTitle === '' && (

              <Form.Control
                type='search'
                name='search'
                value={search}
                placeholder='Search Supplier'
                name='supplierSearch'
                // value={email}
                onChange={(e) =>{
                  setSearch(e.target.value);
                  querySuppliers({
                    search: e.target.value,
                    callBack: () => {
                      console.log('AddIncomingInvoiceScreen -> querySuppliers -> callBack')
                    }
                  })
                    .then( supplierList => {
                      setSuppliers(supplierList)
                    } )
                }}
              />
            )
          }
        </Form.Group>
        {
          suppliers.length > 0 &&
          suppliers.map( supplierItem => (
            <div
              key={supplierItem._id}
              className='bg-warning p-3 d-flex flex-column'
              onClick={() => {
                setFormData({
                  ...formData,
                  supplierId: supplierItem._id,
                  address: supplierItem.address,
                });
                setSupplierTitle(`${supplierItem.name} ${supplierItem.surName}`);
                setSuppliers([]);
                setSearch('');
              }}
            >
              <div className='d-flex flex-row justify-content-between'>
                <div className='d-flex flex-row'>
                  <p>Name:</p>
                  <p className='ml-2 font-weight-bold'>{ supplierItem.name }</p>
                </div>
                <div className='d-flex flex-row'>
                  <p>Surname:</p>
                  <p className='ml-2 font-weight-bold'>{ supplierItem.surName }</p>
                </div>
              </div>
              <div className='d-flex flex-row'>
                <p>Address:</p>
                <p className='ml-2 font-weight-bold'>{supplierItem.address}</p>
              </div>
              <div className='d-flex flex-row justify-content-end'>
                <p>Balance:</p>
                <p className='ml-2 font-weight-bold'>{supplierItem.balance.toFixed(2)}</p>
              </div>
            </div>
          ) )
        }
        {
          items.length > 0 
          && items.map(productItemInOrderList => (
            <ProductItemInOrderList
              productItemInOrderList={productItemInOrderList}
              changeItemQuantity={changeItemQuantity}
              changeItemPrice={changeItemPrice}
            />
          ) ) 
        }
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Product</Form.Label>
          <Form.Control
            type='search'
            placeholder='Add Product'
            name='email'
            value={searchProduct}
            onChange={(e) => {
              setSearchProduct(e.target.value);
              queryProducts({
                search: e.target.value
              });

            }}
          />
        </Form.Group>
        {
          queriedProducts.length > 0 
            && (queriedProducts.map(
              productItem => (
                <ProductItemComponent
                  key={productItem}
                  productItem={productItem}
                  clickHandler={addProductItem}

                />
              )
            ))
        }
        {/* {
          queriedProducts.length > 0 && (
            queriedProducts.map(productItem => (
              <div
                key={productItem._id}
              >{productItem.brand}</div>
            )

        } */}
        <div className='d-flex flex-row'>
          <p className='mr-2 ' >Address:</p>
          <p className='font-weight-bold ' >{address}</p>
        </div>
        
        {/* <Form.Group controlId='formBasicEmail'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address'
            name='address'
            value={address}
            onChange={(e) => onChange(e)}
          />
        </Form.Group> */}


      </Form>
      <div className='d-flex flex-row justify-content-between'>
        <p style={{fontSize: 22}} className='text-light font-weight-bold'>Sub Total:</p>
        <p style={{fontSize: 22}} className='text-light font-weight-bold'>
          {orderTotalPrice.toFixed(2)}
        </p>
      </div>  
      <Button
        variant='primary'
        type='submit'
        className='w-100 mt-5'
        onClick={(e) => {
          e.preventDefault();
          console.log("Client -> AddIncomingInvoiceScreen -> formData ->", formData);
          addOrder({
            formData,
            callBack: () => {
              console.log('Client -> AddIncomingInvoiceScreen -> addOrder -> callBack FIRED');
              setFormData(initialFormData);
              setSupplierTitle('');
              setSearch('');
              setSearchProduct('');
              setSuppliers([]);
            }
          })

        }}
      >
        Add Invoice
        </Button>
    </div>
  )
}


const mapStateToProps = (state) => ({
  // categories: state.categoryReducer.categories,
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
  queriedProducts: state.productReducer.queriedProducts,
});

export default connect(
  mapStateToProps,
  {

    querySuppliers,
    queryProducts,
    addOrder
  }
)(AddIncomingInvoiceScreen);
