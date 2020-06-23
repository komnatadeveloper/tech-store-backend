import React from 'react'
import { connect } from "react-redux";
import { Button } from 'react-bootstrap'
import {
  deleteProduct,
} from '../../actions/productActions';
import { mainImageUrlHelper } from '../../helpers/helpers'


const ProductItemComponent = ({ 
  // as prop
  productItem, 
  clickHandler,
  // from actions
  deleteProduct
}) => {
  const {
    _id,
    brand,
    // category, 
    imageList,
    keyProperties,
    price,
    productNo,
    stockStatus
  } = productItem

  const imageUrl = mainImageUrlHelper({ imageList })
  // console.log('FeaturedProductItem -> imageUrl ->', imageUrl)
  return (
    <div
      className='d-flex flex-row border my-2 bg-warning p-2'
      onClick={() => { clickHandler({ product: productItem }) }}

    >
      <img
        src={imageUrl}
        style={{
          height: 120,
          width: 200

        }}
      />
      <div
        className='d-flex flex-column pl-4 flex-fill'
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
        <div className='d-flex flex-row justify-content-between'>
          <div className='d-flex flex-row'>
            <p className='mr-2'>Stock Status</p>
            <p>{stockStatus.stockQuantity}</p>
          </div>
          <div className='d-flex flex-row'>
            <p className='mr-2'>Price</p>
            <p>{price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className='ml-3 ' >
        <Button
          onClick={() => {
            deleteProduct({
              productId: _id
            })
          }}
          variant='danger'
        >
          Delete Product
        </Button>
      </div>

    </div>
  )
}


export default connect(
  null,
  {
    deleteProduct
  }
)(ProductItemComponent);