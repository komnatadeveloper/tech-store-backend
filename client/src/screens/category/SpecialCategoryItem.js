import React, { useState } from 'react'
import { Button, Collapse, } from 'react-bootstrap'
import SubCategoryAddComponent from './SubCategoryAddComponent';
import { SubCategoryItem } from './SubCategoryItem';
import { imageUrlHelper } from '../../helpers/helpers';


export const SpecialCategoryItem = ({
  title,
  category,
  handleMainButtonClick
}) => {
  // const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  // const [showSubCategoryList, setShowSubCategoryList] = useState(false);
  const { _id } = category;
  console.log("MainCategoryItem -> props -> category -> ", category);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1.5px solid blue",
        // backgroundColor: "#333",
      }}
      className='bg-warning'
    >
      <div
        style={{
          padding: "0.75rem",
          flexDirection: "row",
          display: "flex",
          // justifyContent: "space-between",
          // borderBottom:
          //   (showAddSubCategory || showSubCategoryList) && "1px solid white",
        }}
      >
        {
          category.rawCategory.imageId && (
            <img
              style={{
                width: 160,
                height: 96
              }}
              src={imageUrlHelper({
                imageId: category.rawCategory.imageId
              })}
            />
          )
        }
        <div
          className='d-flex ml-5'
        >
          <p
            style={{
              fontSize: 20,
            }}
            className='m-auto text-center font-weight-bold text-light'
          >
            {title}
          </p>
        </div>
        
      </div>
      
      
    </div>
  );
}
