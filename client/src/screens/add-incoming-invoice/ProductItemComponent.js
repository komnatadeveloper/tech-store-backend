import React from 'react'
import { Button } from 'react-bootstrap'
import { mainImageUrlHelper } from '../../helpers/helpers'


export const ProductItemComponent = ({ productItem, clickHandler }) => {
  const {
    // _id,
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
      onClick={() => { 
        clickHandler(productItem ) ;
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

    </div>
  )
}
