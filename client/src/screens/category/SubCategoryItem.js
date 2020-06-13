import React, { useState } from "react";
import { Button, Collapse, } from "react-bootstrap";
import ThirdLevelCategoryAddComponent from "./ThirdLevelCategoryAddComponent";
import { ThirdLevelCategoryItem } from "./ThirdLevelCategoryItem";

export const SubCategoryItem = ({
  title,
  parentCategory,
  category,
}) => {
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showSubCategoryList, setShowSubCategoryList] = useState(false);
  const { _id } = category;
  console.log("SubCategoryItem -> props -> parentCategory -> ", parentCategory);
  return (
    <div
      style={{
        backgroundColor: "#555",
      }}
      className='d-flex flex-column ml-4 mr-1'
    >
      <div
        style={{
          padding: "0.75rem",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          borderBottom:
            (showAddSubCategory || showSubCategoryList) && "1px solid white",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
          className='d-flex'
        >
          <p
            style={{
              fontSize: 18,
            }}
            className='m-auto text-center text-light font-weight-bold'
          >
            {title}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            aria-expanded={showAddSubCategory}
            aria-controls={`collapseAddSubItem${_id}`}
            timeout={1500}
            onClick={() => {
              setShowAddSubCategory(!showAddSubCategory);
            }}
          >
            <div className='d-flex flex-row m-auto'>
              <span className='mr-2 text-center'>Add 3rd Level Category</span>
              <i
                className={
                  showAddSubCategory
                    ? "fa fa-chevron-up  text-center m-auto"
                    : "fa fa-chevron-down text-center m-auto"
                }
              ></i>
            </div>
          </Button>
          <div
            style={{
              width: "2.5rem",
              display: "flex",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            {category.thirdLevelChildrenCategories.length > 0 && (
              <Button
                variant='link'
                className='ml-3'
                onClick={() => {
                  setShowSubCategoryList(!showSubCategoryList);
                }}
              >
                <i
                  className={
                    showSubCategoryList
                      ? "fa fa-chevron-up text-light"
                      : "fa fa-chevron-down text-light"
                  }
                ></i>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Collapse in={showAddSubCategory} timeout={1500}>
        <div
          id={`collapseAddSubItem${_id}`}
          style={{
            backgroundColor: "orange",
          }}
        >
          <ThirdLevelCategoryAddComponent parentCategory={category} />
        </div>
      </Collapse>
      {showSubCategoryList &&
        category.thirdLevelChildrenCategories.map((thirdLevelCategoryItem) => (
          <ThirdLevelCategoryItem
            category={thirdLevelCategoryItem}
            parentCategory={category.rawCategory}
            title={thirdLevelCategoryItem.title}
          />
        ))}
    </div>
  );
};
