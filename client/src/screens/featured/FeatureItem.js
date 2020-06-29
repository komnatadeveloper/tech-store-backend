import React from 'react'
import { connect } from "react-redux";
import {  deleteFeature } from '../../actions/featureActions';
import { Button} from 'react-bootstrap'
import { imageUrlHelper } from '../../helpers/helpers'
  

const FeatureItem = ({
  // as prop
  feature,
  // from actions
  deleteFeature
}) => {
  const { 
    _id,
    featureType,
    imageId,
    brand,
    categoryId,
    productId,
   } = feature
   
  return (
    <div
      className='d-block d-flex flex-row justify-content-between my-4 bg-warning'
    >
      <img
        style={{
          maxWidth:'50%'
        }}
        className='p-3'
        src={imageUrlHelper({imageId})}
      ></img>

      <div
        className='w-50 d-block p-3 d-flex flex-column justify-content-between'
      >        
        <div>
          {
            (featureType === 'category' || featureType === 'categoryWithBrand') && (
              <div
                className='d-block d-flex flex-row justify-content-between border-bottom pb-0 align-items-center px-2'
              >

                <p className='my-auto text-center'>Category</p>
                <p className='my-auto text-center'>{categoryId.title}</p>
              </div>
            )
          }
          {
            ( featureType === 'categoryWithBrand') && (
              <div
                className='d-block d-flex flex-row justify-content-between border-bottom pb-0 align-items-center px-2'
              >

                <p className='my-auto text-center'>Brand</p>
                <p className='my-auto text-center'>{brand}</p>
              </div>
            )
          }
          {
            (featureType === 'product' ) && (
            // <h3>{productId.brand}</h3>
              <React.Fragment>
                <div
                  className='d-block d-flex flex-row justify-content-between border-bottom pb-0 align-items-center px-2'
                >
                  <div className='d-flex flex-row'>                  
                    <p className='my-auto text-center mr-1'>Brand:</p>
                    <p className='my-auto text-center'>{productId.brand}</p>
                  </div>
                  <div className='d-flex flex-row'>                  
                    <p className='my-auto text-center mr-1'>ProductNo:</p>
                    <p className='my-auto text-center overflow-hidden'>{productId.productNo}</p>
                  </div>
                </div>
                <div
                  className='d-block d-flex flex-row  border-bottom pb-0 align-items-center px-2'
                >                
                  <p className='my-auto text-center mr-1'>Key Properties:</p>
                  <p className='my-auto text-center overflow-hidden'>{productId.keyProperties}</p>
                </div>
                <div
                  className='d-block d-flex flex-row justify-content-between border-bottom pb-0 align-items-center px-2'
                >
                  <div className='d-flex flex-row'>
                    <p className='my-auto text-center mr-1'>Stock:</p>
                    <p className='my-auto text-center'>{productId.stockStatus.stockQuantity}</p>
                  </div>
                  <div className='d-flex flex-row'>
                    <p className='my-auto text-center mr-1'>Price:</p>
                    <p className='my-auto text-center'>{productId.price.toFixed(2)}</p>
                  </div>
                </div>
              </React.Fragment>
            )
          }
        </div>
        <Button
        variant='danger'
          onClick={() => {
            deleteFeature({
              featureId: _id,
              callBack: () => {
                console.log('FeatureItem -> deleteFeature -> callBack FIRED');
              }
            })
          }}
        >
          Delete
        </Button>
        
      </div>
    </div>
  )
}

export default connect(
  null,
  {
    deleteFeature
  }
)(FeatureItem);
