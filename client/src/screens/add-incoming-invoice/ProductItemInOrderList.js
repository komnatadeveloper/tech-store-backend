import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { imageUrlHelper } from '../../helpers/helpers'

export const ProductItemInOrderList = ({
  productItemInOrderList,
  changeItemQuantity,
  changeItemPrice
}) => {
  // const {
  //   // _id,
  //   brand,
  //   // category, 
  //   imageList,
  //   keyProperties,
  //   price,
  //   productNo,
  //   stockStatus
  // } = productItem

  // const productItemObject = {
  //   productId: productItem._id,
  //   brand: productItem.brand,
  //   productNo: productItem.productNo,
  //   keyProperties: productItem.keyProperties,
  //   mainImageId: mainImageIdHelper({
  //     imageList: productItem.imageList
  //   }),
  //   price: 0.00,
  //   quantity: 1
  // };

  const {
    productId,
    brand,
    productNo,
    keyProperties,
    mainImageId,
    price,
    quantity
  } = productItemInOrderList;

  const imageUrl = imageUrlHelper({ imageId: mainImageId })
  // console.log('FeaturedProductItem -> imageUrl ->', imageUrl)
  return (
    <div
      className='d-flex flex-row border my-2 bg-warning p-2'
      onClick={() => {
        // clickHandler({ product: productItem }) 
      }}

    >
      <img
        src={imageUrl}
        style={{
          height: 120,
          width: 200

        }}
      />
      <div
        className='d-flex flex-column pl-4 w-100'
      >
        {/* 1st Row - Right Of Image */}
        <div
          className='d-flex flex-row justify-content-between'
        >
          <div className='d-flex flex-row'>
            <p className='mr-2'>Brand:</p>
            <p>{brand}</p>
          </div>
          <div className='d-flex flex-row'>
            <p className='mr-2'>Product No:</p>
            <p>{productNo}</p>
          </div>
        </div>
        {/* 2nd Row - Right Of Image */}
        <p className='d-d-block'>{keyProperties}</p>
        {/* 3rd Row - Right Of Image */}

      </div>
      <div
        style={{
          width: 225,
          // backgroundColor:'red'
        }}
        className='d-flex flex-column ml-3 border'
      >
        <div className='d-flex flex-row align-items-center'>
          <Button
            onClick={() => {
              changeItemQuantity({
                newQuantity: quantity - 1 ,
                productId
              })
            }}
          >
            <i className='fa fa-minus'/>
          </Button>
          <Form.Control
            type='text'
            className='text-center'
            style={{
              fontSize: 12
            }}
            // placeholder='Add Product'
            // name='email'
            value={quantity}
            onChange={(e) => {

              changeItemQuantity({
                newQuantity: e.target.value,
                productId
              })
            }}
            // onSubmit={(e) => {
            // }}
          />
          <Button
            onClick={() => {
              changeItemQuantity({
                newQuantity: quantity + 1,
                productId
              })
            }}
          >
            <i className='fa fa-plus' />
          </Button>
        </div>
        <div className='mx-2'>
          <Form.Control
            type='text'
            className='text-center my-1 px-2'
            style={{
              fontSize: 12
            }}
            // placeholder='Add Product'
            // name='email'
            value={price.toFixed(2)}
            onChange={(e) => {
              changeItemPrice({
                productId,
                newPrice: e.target.value
              })
              // changeItemQuantity({
              //   newQuantity: e.target.value,
              //   productId
              // })
            }}
          />
        </div>
        <div className='d-flex justify-content-end pr-2'>
          <p 
            style={{
              fontSize: 20
            }}
            className='text-white font-weight-bold'
          >
            {(price * parseInt(quantity)).toFixed(2) }
          </p>
        </div>
      </div>

    </div>
  )
}
